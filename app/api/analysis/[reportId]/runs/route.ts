import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import { getJwtSecret } from "@/lib/env";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = await params;
    if (!reportId || !mongoose.Types.ObjectId.isValid(reportId)) {
      return NextResponse.json({ success: false, error: "Invalid report ID" }, { status: 400 });
    }

    await dbConnect();

    const report = await Report.findOne({ _id: reportId, userId }).lean();
    if (!report) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 });
    }

    const runs = (report.runs && Array.isArray(report.runs) ? report.runs : []).map((r: any) => ({
      runId: r.runId,
      commitSha: r.commitSha,
      commitMessage: r.commitMessage,
      branch: r.branch,
      commitAuthor: r.commitAuthor,
      analyzedAt: r.analyzedAt,
      maturityScore: r.maturityScore,
      level: r.level,
      isProductionReady: r.isProductionReady,
      selectedFilesCount: r.selectedFilesCount,
    }));

    // If runs is empty, provide current report as the single run
    if (runs.length === 0) {
      runs.push({
        runId: report._id.toString(),
        commitSha: report.commitSha,
        commitMessage: report.commitMessage,
        branch: report.branch,
        commitAuthor: report.commitAuthor,
        analyzedAt: report.analyzedAt,
        maturityScore: report.maturityScore,
        level: report.level,
        isProductionReady: report.isProductionReady,
        selectedFilesCount: report.selectedFilesCount,
      });
    }

    return NextResponse.json({
      success: true,
      repoName: report.repoName,
      repoUrl: report.repoUrl,
      runs,
    });
  } catch (error: unknown) {
    console.error("Runs API Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
