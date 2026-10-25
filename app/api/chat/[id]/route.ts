import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import Report from "@/models/Report";
import { getJwtSecret } from "@/lib/env";
import { sendChatMessageSchema } from "@/types/chat";
import {
  generateChatResponse,
  generateInitialRecommendedQuestions,
} from "@/services/chat-service";
import mongoose from "mongoose";

// Helper to authenticate user from headers
function getAuthenticatedUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;
  const token = bearerToken || request.headers.get("x-auth-token");

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "object" && decoded && "id" in decoded) {
      return (decoded as { id: string }).id;
    }
  } catch {
    return null;
  }
  return null;
}

// Find chat by chat ID or report ID, ensuring ownership
async function findOrCreateUserChat(id: string, userId: string) {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) return null;

  // 1. Try finding by Chat _id
  let chat = await Chat.findOne({ _id: id, userId });
  if (chat) return chat;

  // 2. Try finding by Report ID
  chat = await Chat.findOne({ report: id, userId });
  if (chat) return chat;

  // 3. If no chat found, check if a valid Report exists for this user
  const report = await Report.findOne({ _id: id, userId });
  if (report) {
    chat = await Chat.create({
      userId,
      report: report._id,
      repositoryFullName: report.repoName,
      title: `Discussion for ${report.repoName}`,
      messages: [
        {
          role: "assistant",
          content: "Analysis complete. What would you like to know about this repository?",
          suggestedFollowUps: generateInitialRecommendedQuestions(report),
        },
      ],
      suggestedQuestions: generateInitialRecommendedQuestions(report),
    });
    return chat;
  }

  return null;
}

// ============================================================
// GET: Retrieve Chat & Suggested Questions
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const chat = await findOrCreateUserChat(id, userId);

    if (!chat) {
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });
    }

    await chat.populate("report");

    // Ensure suggested questions exist
    let suggestedQuestions = chat.suggestedQuestions;
    if (!suggestedQuestions || suggestedQuestions.length === 0) {
      suggestedQuestions = generateInitialRecommendedQuestions(chat.report);
      chat.suggestedQuestions = suggestedQuestions;
      await chat.save();
    }

    return NextResponse.json({
      success: true,
      data: chat,
      suggestedQuestions,
    });
  } catch (error: unknown) {
    console.error("Get Chat API Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ============================================================
// POST: Send Chat Message & Receive Grounded Answer
// ============================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = sendChatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const chat = await findOrCreateUserChat(id, userId);

    if (!chat) {
      return NextResponse.json({ success: false, error: "Chat not found" }, { status: 404 });
    }

    // Retrieve report document
    const report = await Report.findById(chat.report).lean();
    if (!report) {
      return NextResponse.json(
        { success: false, error: "Associated report not found" },
        { status: 404 }
      );
    }

    // Extract optional GitHub token
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    }).catch(() => null);

    const githubAccessToken =
      nextAuthToken &&
      String(nextAuthToken.userId) === userId &&
      typeof nextAuthToken.githubAccessToken === "string"
        ? nextAuthToken.githubAccessToken
        : undefined;

    // Generate grounded response with Gemini
    const chatResponse = await generateChatResponse({
      report,
      history: chat.messages || [],
      userQuestion: parsed.data.message,
      githubAccessToken,
    });

    // Create user message
    const userMsg = {
      role: "user" as const,
      content: parsed.data.message,
      createdAt: new Date(),
    };

    // Create assistant message
    const assistantMsg = {
      role: "assistant" as const,
      content: chatResponse.answer,
      sources: chatResponse.sources,
      suggestedFollowUps: chatResponse.suggestedFollowUps,
      createdAt: new Date(),
    };

    chat.messages.push(userMsg, assistantMsg);
    chat.suggestedQuestions = chatResponse.suggestedFollowUps;
    chat.updatedAt = new Date();
    await chat.save();

    return NextResponse.json({
      success: true,
      data: {
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        suggestedFollowUps: chatResponse.suggestedFollowUps,
      },
    });
  } catch (error: unknown) {
    console.error("Chat Message API Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
