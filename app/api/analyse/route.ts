import { NextResponse } from "next/server";
import { analyzeRepository } from "@/services/analysis-service";
import { analyzeRepoSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = analyzeRepoSchema.parse(body);
      const analysisResult = await analyzeRepository(validated.repoUrl);

      return NextResponse.json({
        success: true,
        data: analysisResult,
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
                  { status: 400 },
            );
      }
      
      // Handle Error objects (includes API errors, network errors, etc.)
      if (error instanceof Error) {
            return NextResponse.json(
                  {
                        success: false,
                        error: error.message,
                  },
                  { status: 400 },
            );
      }

      // Fallback for unknown error types
      return NextResponse.json(
            {
                  success: false,
                  error: "An unexpected error occurred",
            },
            { status: 500 },
      );
  }
}

// services/securityAnalyser-service.ts