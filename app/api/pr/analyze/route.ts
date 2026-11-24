import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dbConnect from "@/lib/db";
import { getJwtSecret } from "@/lib/env";
import { analyzePullRequest } from "@/services/pr-analysis-service";
import PullRequestReport from "@/models/PullRequestReport";

const analyzePRSchema = z.object({
  repoUrl: z.string().url("Valid GitHub repository URL is required"),
  pullNumber: z.number().int().positive("Pull request number must be positive"),
});

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;
    const appToken =
      bearerToken ||
      request.headers.get("x-auth-token") ||
      request.cookies.get("token")?.value;

    if (!appToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let appUserId: string;
    try {
      const payload = jwt.verify(appToken, getJwtSecret()) as { id?: string };
      if (!payload.id) throw new Error("Invalid token");
      appUserId = payload.id;
    } catch {
      return NextResponse.json(
        { success: false, error: "Session expired or invalid token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = analyzePRSchema.parse(body);

    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const nextAuthToken = secret
      ? await getToken({ req: request, secret })
      : null;

    const githubAccessToken =
      nextAuthToken &&
      String(nextAuthToken.userId) === appUserId &&
      typeof nextAuthToken.githubAccessToken === "string"
        ? nextAuthToken.githubAccessToken
        : undefined;

    // 1. Run Pull Request Analysis
    const analysisResult = await analyzePullRequest(
      validated.repoUrl,
      validated.pullNumber,
      githubAccessToken
    );

    // 2. Persist immutable record in MongoDB
    await dbConnect();

    const prReport = new PullRequestReport({
      userId: appUserId,
      repoUrl: analysisResult.repoUrl,
      repoName: analysisResult.repoName,
      prNumber: analysisResult.prNumber,
      prTitle: analysisResult.prTitle,
      prAuthor: analysisResult.prAuthor,
      prAuthorAvatar: analysisResult.prAuthorAvatar,
      baseSha: analysisResult.baseSha,
      headSha: analysisResult.headSha,
      baseBranch: analysisResult.baseBranch,
      headBranch: analysisResult.headBranch,
      status: analysisResult.status,
      verdict: analysisResult.verdict,
      verdictReason: analysisResult.verdictReason,
      scoreDelta: analysisResult.scoreDelta,
      baseScore: analysisResult.baseScore,
      headScore: analysisResult.headScore,
      changedFilesCount: analysisResult.changedFilesCount,
      additions: analysisResult.additions,
      deletions: analysisResult.deletions,
      counts: analysisResult.counts,
      introducedIssues: analysisResult.introducedIssues,
      resolvedIssues: analysisResult.resolvedIssues,
      persistentIssues: analysisResult.persistentIssues,
      worsenedIssues: analysisResult.worsenedIssues,
      improvedIssues: analysisResult.improvedIssues,
      summary: analysisResult.summary,
      analyzedAt: new Date(),
    });

    await prReport.save();
    analysisResult.reportId = prReport._id.toString();

    return NextResponse.json({
      success: true,
      reportId: prReport._id.toString(),
      report: analysisResult,
    });
  } catch (error: unknown) {
    console.error("Error analyzing pull request:", error);
    if (error instanceof z.ZodError) {
      const issueMessage =
        error.issues?.[0]?.message ||
        (Array.isArray((error as any).errors) ? (error as any).errors[0]?.message : undefined) ||
        error.message ||
        "Invalid input";
      return NextResponse.json(
        { success: false, error: issueMessage },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
