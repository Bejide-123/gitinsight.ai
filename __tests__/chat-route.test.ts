import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const mockJwtSecret = "12345678901234567890123456789012";

const mocks = vi.hoisted(() => ({
  mockChatFindOne: vi.fn(),
  mockChatCreate: vi.fn(),
  mockReportFindOne: vi.fn(),
  mockReportFindById: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  getJwtSecret: () => mockJwtSecret,
}));

vi.mock("@/lib/db", () => ({
  default: vi.fn(),
}));

vi.mock("@/models/Chat", () => ({
  default: {
    findOne: mocks.mockChatFindOne,
    create: mocks.mockChatCreate,
  },
}));

vi.mock("@/models/Report", () => ({
  default: {
    findOne: mocks.mockReportFindOne,
    findById: mocks.mockReportFindById,
  },
}));

vi.mock("@/services/chat-service", () => ({
  generateChatResponse: vi.fn().mockResolvedValue({
    answer: "Here is the grounded answer.",
    sources: [{ type: "file", path: "src/auth.ts" }],
    suggestedFollowUps: ["Follow up question 1", "Follow up question 2"],
  }),
  generateInitialRecommendedQuestions: vi.fn().mockReturnValue([
    "Why was this flagged as a risk?",
    "What files need changing?",
  ]),
}));

// Import route handlers
import { GET, POST } from "@/app/api/chat/[id]/route";

describe("Chat API Route (/api/chat/[id])", () => {
  const userId = "507f1f77bcf86cd799439011";
  const validToken = jwt.sign({ id: userId }, mockJwtSecret);
  const chatId = new mongoose.Types.ObjectId().toString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/chat/[id]", () => {
    it("returns 401 when unauthorized", async () => {
      const req = new NextRequest(`http://localhost:3000/api/chat/${chatId}`);
      const res = await GET(req, { params: Promise.resolve({ id: chatId }) });
      expect(res.status).toBe(401);
    });

    it("returns 404 when chat is not found", async () => {
      mocks.mockChatFindOne.mockResolvedValueOnce(null);
      mocks.mockReportFindOne.mockResolvedValueOnce(null);

      const req = new NextRequest(`http://localhost:3000/api/chat/${chatId}`, {
        headers: { "x-auth-token": validToken },
      });

      const res = await GET(req, { params: Promise.resolve({ id: chatId }) });
      expect(res.status).toBe(404);
    });

    it("returns 200 with chat and suggestions when authorized", async () => {
      const mockChatInstance = {
        _id: chatId,
        userId,
        report: new mongoose.Types.ObjectId().toString(),
        messages: [{ role: "assistant", content: "Analysis complete." }],
        suggestedQuestions: ["Question 1", "Question 2"],
        populate: vi.fn().mockResolvedValue(true),
        save: vi.fn().mockResolvedValue(true),
      };

      mocks.mockChatFindOne.mockResolvedValueOnce(mockChatInstance);

      const req = new NextRequest(`http://localhost:3000/api/chat/${chatId}`, {
        headers: { "x-auth-token": validToken },
      });

      const res = await GET(req, { params: Promise.resolve({ id: chatId }) });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.data._id).toBe(chatId);
      expect(data.suggestedQuestions.length).toBe(2);
    });
  });

  describe("POST /api/chat/[id]", () => {
    it("returns 401 when unauthorized", async () => {
      const req = new NextRequest(`http://localhost:3000/api/chat/${chatId}`, {
        method: "POST",
        body: JSON.stringify({ message: "Hello" }),
      });

      const res = await POST(req, { params: Promise.resolve({ id: chatId }) });
      expect(res.status).toBe(401);
    });

    it("returns 400 when message is empty or whitespace", async () => {
      const req = new NextRequest(`http://localhost:3000/api/chat/${chatId}`, {
        method: "POST",
        headers: { "x-auth-token": validToken },
        body: JSON.stringify({ message: "   " }),
      });

      const res = await POST(req, { params: Promise.resolve({ id: chatId }) });
      expect(res.status).toBe(400);
    });

    it("processes message, updates chat and returns answer with suggestions", async () => {
      const reportId = new mongoose.Types.ObjectId().toString();
      const mockChatInstance = {
        _id: chatId,
        userId,
        report: reportId,
        messages: [],
        suggestedQuestions: [],
        save: vi.fn().mockResolvedValue(true),
      };

      mocks.mockChatFindOne.mockResolvedValueOnce(mockChatInstance);
      mocks.mockReportFindById.mockReturnValueOnce({
        lean: vi.fn().mockResolvedValueOnce({
          _id: reportId,
          repoName: "test/repo",
          dangerousIssues: [],
        }),
      });

      const req = new NextRequest(`http://localhost:3000/api/chat/${chatId}`, {
        method: "POST",
        headers: { "x-auth-token": validToken },
        body: JSON.stringify({ message: "Why is authentication flagged as risky?" }),
      });

      const res = await POST(req, { params: Promise.resolve({ id: chatId }) });
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.userMessage.content).toBe("Why is authentication flagged as risky?");
      expect(body.data.assistantMessage.content).toBe("Here is the grounded answer.");
      expect(body.data.suggestedFollowUps.length).toBe(2);
      expect(mockChatInstance.save).toHaveBeenCalled();
    });
  });
});
