import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/env";
import { createGitHubClient } from "@/lib/github";
import { fetchPullRequests } from "@/services/github-pr-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;

    if (!owner || !repo) {
      return NextResponse.json(
        { success: false, error: "Owner and repository name are required" },
        { status: 400 }
      );
    }

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

    const client = createGitHubClient(githubAccessToken);
    const url = new URL(request.url);
    const stateParam = url.searchParams.get("state");
    const state =
      stateParam === "closed" || stateParam === "all" ? stateParam : "open";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const perPage = parseInt(url.searchParams.get("perPage") || "30", 10);

    const pullRequests = await fetchPullRequests(
      owner,
      repo,
      state,
      client,
      page,
      perPage
    );

    return NextResponse.json({
      success: true,
      pullRequests,
    });
  } catch (error: unknown) {
    console.error("Error fetching pull requests:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
