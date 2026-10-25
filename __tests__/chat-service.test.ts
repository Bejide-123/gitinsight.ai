import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  generateInitialRecommendedQuestions,
  assembleChatContext,
  generateChatResponse,
} from "@/services/chat-service";
import { chatResponseSchema, sendChatMessageSchema } from "@/types/chat";
import type { Issue } from "@/types/analysis";

// Mock Gemini model
const mockGenerateContent = vi.fn();
vi.mock("@/config/gemini", () => ({
  getGeminiModel: () => ({
    generateContent: mockGenerateContent,
  }),
}));

// Mock GitHub fetchFileContent
vi.mock("@/services/github-service", () => ({
  fetchFileContent: vi.fn().mockResolvedValue("function authenticate() {\n  return jwt.sign();\n}"),
  parseGitHubUrl: vi.fn().mockReturnValue({ owner: "owner", repo: "repo" }),
}));

describe("Chat Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockReport = {
    repoName: "test/repo",
    repoUrl: "https://github.com/test/repo",
    maturityScore: 75,
    level: "Intermediate",
    isProductionReady: false,
    dangerousIssues: [
      {
        category: "Security",
        severity: "critical" as const,
        title: "Insecure JWT validation",
        description: "JWT tokens are not verified with expiration time.",
        isDangerous: true,
        impact: "Token replay attacks",
        recommendation: "Verify exp claim",
        evidence: ["jwt.verify(token)"],
        file: "src/auth/jwt.ts",
        lineNumber: 42,
      },
    ],
    criticalBlockers: ["Low test coverage", "Missing authentication validation"],
    missingImprovements: [
      {
        category: "Architecture",
        severity: "medium" as const,
        title: "Tightly coupled database queries",
        description: "Services access database directly without repository pattern.",
        isDangerous: false,
        impact: "Difficult to maintain",
        recommendation: "Extract repository layer",
        evidence: [],
      },
    ],
  };

  describe("generateInitialRecommendedQuestions", () => {
    it("generates questions grounded in repository security issues and blockers", () => {
      const questions = generateInitialRecommendedQuestions(mockReport);
      expect(questions.length).toBeGreaterThanOrEqual(3);
      expect(questions[0]).toContain("Insecure JWT validation");
      expect(questions[1]).toContain("Which files would I need to change");
      expect(questions.some((q) => q.includes("production readiness"))).toBe(true);
    });

    it("generates fallback questions when no issues exist", () => {
      const emptyReport = { repoName: "clean/repo" };
      const questions = generateInitialRecommendedQuestions(emptyReport);
      expect(questions.length).toBeGreaterThanOrEqual(2);
      expect(questions.some((q) => q.includes("architectural weaknesses"))).toBe(true);
    });
  });

  describe("assembleChatContext", () => {
    it("matches relevant findings when user asks about a specific issue", async () => {
      const result = await assembleChatContext({
        report: mockReport,
        history: [],
        userQuestion: "Why did you flag the JWT authentication implementation as a security risk?",
      });

      expect(result.promptText).toContain("Insecure JWT validation");
      expect(result.promptText).toContain("src/auth/jwt.ts");
      expect(result.retrievedSources.some((s) => s.path === "src/auth/jwt.ts")).toBe(true);
    });

    it("includes recent conversation history in the prompt text", async () => {
      const history = [
        { role: "user" as const, content: "What is the score?" },
        { role: "assistant" as const, content: "The maturity score is 75/100." },
      ];

      const result = await assembleChatContext({
        report: mockReport,
        history,
        userQuestion: "Why is it 75?",
      });

      expect(result.promptText).toContain("USER: What is the score?");
      expect(result.promptText).toContain("ASSISTANT: The maturity score is 75/100.");
    });
  });

  describe("Validation Schemas", () => {
    it("validates sendChatMessageSchema correctly", () => {
      expect(sendChatMessageSchema.safeParse({ message: "Hello AI" }).success).toBe(true);
      expect(sendChatMessageSchema.safeParse({ message: "   " }).success).toBe(false);
      expect(sendChatMessageSchema.safeParse({ message: "" }).success).toBe(false);
    });

    it("validates chatResponseSchema correctly", () => {
      const validPayload = {
        answer: "This is a grounded answer.",
        sources: [
          { type: "file", path: "src/auth.ts", startLine: 10, endLine: 20 },
          { type: "finding", title: "Missing auth check" },
        ],
        suggestedFollowUps: [
          "How do I fix this?",
          "Which tests should I write?",
        ],
      };

      const result = chatResponseSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });
  });

  describe("generateChatResponse", () => {
    it("parses valid JSON response from Gemini with sources and follow-ups", async () => {
      const mockAiResponse = {
        answer: "The JWT token validation is missing the `exp` parameter.",
        sources: [
          { type: "file", path: "src/auth/jwt.ts", startLine: 40, endLine: 45 },
        ],
        suggestedFollowUps: [
          "How can I patch `src/auth/jwt.ts`?",
          "Are refresh tokens affected as well?",
        ],
      };

      mockGenerateContent.mockResolvedValueOnce({
        response: {
          text: () => JSON.stringify(mockAiResponse),
        },
      });

      const response = await generateChatResponse({
        report: mockReport,
        history: [],
        userQuestion: "Why is JWT validation risky?",
      });

      expect(response.answer).toBe(mockAiResponse.answer);
      expect(response.suggestedFollowUps).toEqual(mockAiResponse.suggestedFollowUps);
      expect(response.sources.length).toBeGreaterThan(0);
    });

    it("handles Gemini failure gracefully with fallback answer and suggestions", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("API rate limit exceeded"));

      const response = await generateChatResponse({
        report: mockReport,
        history: [],
        userQuestion: "Why is this risky?",
      });

      expect(response.answer).toContain("unable to reach the AI analysis service");
      expect(response.suggestedFollowUps.length).toBeGreaterThan(0);
    });
  });
});
