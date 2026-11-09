import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Report from "@/models/Report";
import { getJwtSecret } from "@/lib/env";
import jwt from "jsonwebtoken";
import { compareAnalyses } from "@/services/comparison-service";
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

    const url = new URL(request.url);
    const baseRunId = url.searchParams.get("baseRunId");
    const targetRunId = url.searchParams.get("targetRunId");
    const compareWithReportId = url.searchParams.get("compareWithReportId");

    // Case 1: Compare with another report owned by this user
    if (compareWithReportId && mongoose.Types.ObjectId.isValid(compareWithReportId)) {
      const otherReport = await Report.findOne({
        _id: compareWithReportId,
        userId,
      }).lean();

      if (!otherReport) {
        return NextResponse.json(
          { success: false, error: "Comparison report not found" },
          { status: 404 }
        );
      }

      // Determine chronological order by analyzedAt
      const baseIsOther =
        new Date(otherReport.analyzedAt || 0).getTime() <=
        new Date(report.analyzedAt || 0).getTime();
      const baseObj = baseIsOther ? otherReport : report;
      const targetObj = baseIsOther ? report : otherReport;

      const comparison = compareAnalyses(baseObj as any, targetObj as any);

      return NextResponse.json({
        success: true,
        comparison,
        availableRuns: (report.runs || []).map((r: any) => ({
          runId: r.runId,
          commitSha: r.commitSha,
          commitMessage: r.commitMessage,
          branch: r.branch,
          analyzedAt: r.analyzedAt,
          maturityScore: r.maturityScore,
          level: r.level,
        })),
      });
    }

    // Case 2: Compare runs within the report's runs array
    const runs = report.runs && Array.isArray(report.runs) ? report.runs : [];

    // Synthesize current report run if runs array is empty
    const allRuns = [...runs];
    if (allRuns.length === 0) {
      allRuns.push({
        runId: report._id.toString(),
        commitSha: report.commitSha,
        commitMessage: report.commitMessage,
        branch: report.branch,
        commitAuthor: report.commitAuthor,
        commitDate: report.commitDate,
        analyzedAt: report.analyzedAt,
        maturityScore: report.maturityScore,
        level: report.level,
        isProductionReady: report.isProductionReady,
        categoryScores: report.categoryScores,
        dangerousIssues: report.dangerousIssues,
        missingImprovements: report.missingImprovements,
        criticalBlockers: report.criticalBlockers,
        nextSteps: report.nextSteps,
        strengths: report.strengths,
        selectedFilesCount: report.selectedFilesCount,
        projectContext: report.projectContext,
      });
    }

    if (allRuns.length < 2 && !baseRunId && !targetRunId) {
      // Also look for other reports for the same repo to compare with!
      const previousReport = await Report.findOne({
        userId,
        repoUrl: report.repoUrl,
        _id: { $ne: report._id },
      })
        .sort({ analyzedAt: -1 })
        .lean();

      if (previousReport) {
        const comparison = compareAnalyses(previousReport as any, report as any);
        return NextResponse.json({
          success: true,
          comparison,
          availableRuns: [
            {
              runId: previousReport._id.toString(),
              commitSha: previousReport.commitSha,
              commitMessage: previousReport.commitMessage,
              branch: previousReport.branch,
              analyzedAt: previousReport.analyzedAt,
              maturityScore: previousReport.maturityScore,
              level: previousReport.level,
            },
            {
              runId: report._id.toString(),
              commitSha: report.commitSha,
              commitMessage: report.commitMessage,
              branch: report.branch,
              analyzedAt: report.analyzedAt,
              maturityScore: report.maturityScore,
              level: report.level,
            },
          ],
        });
      }

      return NextResponse.json({
        success: true,
        hasMultipleRuns: false,
        message: "This is the initial analysis for this repository. Further runs will generate comparative trend insights.",
        availableRuns: allRuns.map((r: any) => ({
          runId: r.runId,
          commitSha: r.commitSha,
          commitMessage: r.commitMessage,
          branch: r.branch,
          analyzedAt: r.analyzedAt,
          maturityScore: r.maturityScore,
          level: r.level,
        })),
      });
    }

    // Resolve base and target runs
    let baseRun = allRuns[0];
    let targetRun = allRuns[allRuns.length - 1];

    if (baseRunId) {
      const found = allRuns.find((r) => r.runId === baseRunId);
      if (found) baseRun = found;
    } else if (allRuns.length >= 2) {
      baseRun = allRuns[allRuns.length - 2];
    }

    if (targetRunId) {
      const found = allRuns.find((r) => r.runId === targetRunId);
      if (found) targetRun = found;
    }

    const comparison = compareAnalyses(baseRun, targetRun);

    return NextResponse.json({
      success: true,
      hasMultipleRuns: true,
      comparison,
      availableRuns: allRuns.map((r: any) => ({
        runId: r.runId,
        commitSha: r.commitSha,
        commitMessage: r.commitMessage,
        branch: r.branch,
        analyzedAt: r.analyzedAt,
        maturityScore: r.maturityScore,
        level: r.level,
      })),
    });
  } catch (error: unknown) {
    console.error("Comparison API Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
