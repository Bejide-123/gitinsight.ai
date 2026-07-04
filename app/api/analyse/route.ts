import { NextResponse } from "next/server";
import { analyzeRepository } from "@/services/analysis-service";
import { analyzeRepoSchema } from "@/lib/validation";
import { ZodError } from "zod";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import Chat from "@/models/Chat";
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = analyzeRepoSchema.parse(body);
    
    console.log(`[ANALYSE API] Starting analysis for repo: ${validated.repoUrl}`);

    // Get token from middleware header
    const token = request.headers.get('x-auth-token');
    
    console.log(`[ANALYSE API] Token from middleware: ${!!token}`);
    if (token) {
      console.log(`[ANALYSE API] Token preview: ${token.slice(0, 20)}...`);
    }

    if (!token) {
      console.log(`[ANALYSE API] No token provided, returning 401`);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let userId: string;
    try {
      console.log(`[ANALYSE API] Verifying JWT token`);
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      if (typeof decodedToken === 'string' || !decodedToken || typeof decodedToken !== 'object' || typeof decodedToken.id !== 'string') {
        throw new Error('Invalid token payload');
      }

      userId = decodedToken.id;
      console.log(`[ANALYSE API] JWT verified successfully, userId: ${userId}`);
    } catch (err) {
      console.error(`[ANALYSE API] JWT verification failed:`, err);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const analysisResult = await analyzeRepository(validated.repoUrl);

    await dbConnect();

    const report = new Report({ ...analysisResult, userId });
    await report.save();

    const chat = new Chat({
      userId,
      report: report._id,
      messages: [
        {
          role: "assistant",
          content: "Analysis complete. Here is your report.",
        },
      ],
    });
    await chat.save();

    return NextResponse.json({
      success: true,
      data: analysisResult,
      reportId: report._id,
      chatId: chat._id,
      userId,
    });
  } catch (error: unknown) {
    console.error("Analysis API Error:", error);
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    // Handle Error objects (includes API errors, network errors, etc.)
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Fallback for unknown error types
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}


// services/securityAnalyser-service.ts