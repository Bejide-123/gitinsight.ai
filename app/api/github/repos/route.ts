import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createGitHubClient } from "@/lib/github";
import { getJwtSecret } from "@/lib/env";
import type { DashboardGitHubRepository } from "@/types/github";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
    const requestedPerPage = Number.parseInt(url.searchParams.get("perPage") ?? "10", 10);
    const page = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), 10_000) : 1;
    const perPage = [5, 10, 20].includes(requestedPerPage) ? requestedPerPage : 10;

    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "GitHub authentication is not configured." },
        { status: 500 },
      );
    }

    const nextAuthToken = await getToken({ req: request, secret });
    const appToken = request.cookies.get("token")?.value ??
      request.cookies.get("auth_token")?.value;

    if (!nextAuthToken || !appToken) {
      return NextResponse.json({ error: "Sign in to view your repositories." }, { status: 401 });
    }

    let appUserId: string;
    try {
      const payload = jwt.verify(appToken, getJwtSecret());
      if (typeof payload === "string" || typeof payload.id !== "string") {
        throw new Error("Invalid app token");
      }
      appUserId = payload.id;
    } catch {
      return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
    }

    if (String(nextAuthToken.userId) !== appUserId) {
      return NextResponse.json({ error: "Reconnect GitHub to this account." }, { status: 403 });
    }

    if (typeof nextAuthToken.githubAccessToken !== "string") {
      return NextResponse.json(
        { error: "Reconnect GitHub to grant repository access." },
        { status: 403 },
      );
    }

    const client = createGitHubClient(nextAuthToken.githubAccessToken);
    const { data, headers } = await client.rest.repos.listForAuthenticatedUser({
      affiliation: "owner,collaborator,organization_member",
      page,
      per_page: perPage,
      sort: "updated",
      visibility: "all",
    });

    const repositories: DashboardGitHubRepository[] = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      htmlUrl: repo.html_url,
      description: repo.description,
      isPrivate: repo.private,
      language: repo.language,
      updatedAt: repo.updated_at ?? "",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      defaultBranch: repo.default_branch,
    }));

    const links = headers.link ?? "";
    const hasNextPage = /rel="next"/.test(links);
    const lastPageLink = links
      .split(",")
      .find((link) => /rel="last"/.test(link));
    const lastPageUrl = lastPageLink?.match(/<([^>]+)>/)?.[1];
    const totalPages = lastPageUrl
      ? Number(new URL(lastPageUrl).searchParams.get("page")) || page
      : page;

    return NextResponse.json({
      repositories,
      page,
      perPage,
      hasNextPage,
      totalPages,
    });
  } catch (error) {
    const status = typeof error === "object" && error !== null && "status" in error
      ? Number(error.status)
      : 500;
    const message = status === 401
      ? "Reconnect GitHub to refresh repository access."
      : "Could not load GitHub repositories. Please try again.";
    return NextResponse.json({ error: message }, { status: status === 401 ? 403 : 500 });
  }
}