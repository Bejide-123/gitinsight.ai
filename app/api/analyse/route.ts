import { NextResponse } from "next/server";
import { analyzeRepository } from "@/services/analysis-service";
import { analyzeRepoSchema } from "@/lib/validation";
import { ZodError } from "zod";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import Chat from "@/models/Chat";
// Authentication disabled for demo: analysis runs without checking cookies or headers

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = analyzeRepoSchema.parse(body);

    // For the presentation/demo we bypass auth and allow anonymous analysis
    const analysisResult = await analyzeRepository(validated.repoUrl);

    await dbConnect();

    // Do not persist report/chat when auth is disabled — return analysis directly
    return NextResponse.json({
      success: true,
      data: analysisResult,
      reportId: null,
      chatId: null,
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