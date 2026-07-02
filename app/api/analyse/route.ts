import { NextResponse } from "next/server";
import { analyzeRepository } from "@/services/analysis-service";
import { analyzeRepoSchema } from "@/lib/validation";
import { ZodError } from "zod";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import Chat from "@/models/Chat";
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = analyzeRepoSchema.parse(body);
    const analysisResult = await analyzeRepository(validated.repoUrl);

    await dbConnect();

    const headersList = headers();
    const userPayload = headersList.get('x-user');

    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = JSON.parse(userPayload);

    const report = new Report({ ...analysisResult, userId: user.id });
    await report.save();

    const chat = new Chat({
      userId: user.id,
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