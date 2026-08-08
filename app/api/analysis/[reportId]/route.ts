// app/api/analysis/[reportId]/route.ts

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import Chat from "@/models/Chat";
import jwt from "jsonwebtoken";
import type { Analysis } from "@/types/analysis";

function transformToAnalysis(report: any): Analysis {
  return {
    repoUrl: report.repoUrl || "",
    repoName: report.repoName || "",
    analyzedAt: report.analyzedAt || report.createdAt || new Date(),
    projectContext: report.projectContext || {
      intent: "portfolio" as const,
      confidence: 0,
      signals: [],
      expectedFeatures: [],
      notRequiredFeatures: [],
    },
    maturityScore: report.maturityScore || report.overallScore || 0,
    level: report.level || "Unknown",
    isProductionReady: report.isProductionReady || false,
    techStack: report.techStack || [],
    categoryScores: report.categoryScores || {},
    dangerousIssues: report.dangerousIssues || [],
    missingImprovements: report.missingImprovements || [],
    strengths: report.strengths || [],
    fileTreeStructure: report.fileTreeStructure || [],
    selectedFilesCount: report.selectedFilesCount || 0,
    criticalBlockers: report.criticalBlockers || [],
    nextSteps: report.nextSteps || [],
    aiInsights: report.aiInsights || null,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> } // ← Promise in Next.js 15
) {
  try {
    // Auth
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;
    const token = bearerToken || request.headers.get("x-auth-token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let userPayload;
    try {
      userPayload = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
    } catch {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = userPayload as { id: string };

    // Await params — required in Next.js 15
    const { reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: "Report ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch report — must belong to this user
    const report = await Report.findOne({
      _id: reportId,
      userId: user.id,
    }).lean();

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    // Fetch associated chat if it exists
    const chat = await Chat.findOne({
      report: reportId,
      userId: user.id,
    })
      .select("_id messages")
      .lean();

    const analysis = transformToAnalysis(report);

    return NextResponse.json({
      success: true,
      report: analysis,
      chat: chat
        ? {
            _id: (chat as any)._id.toString(),
            messages: (chat as any).messages || [],
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}