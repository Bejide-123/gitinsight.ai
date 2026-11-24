import { beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  mockPRReportFindOne: vi.fn(),
  mockPRReportSave: vi.fn(),
  mockAnalyzePR: vi.fn(),
  mockFetchPRs: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: vi.fn(),
}));

vi.mock("@/services/pr-analysis-service", () => ({
  analyzePullRequest: mocks.mockAnalyzePR,
}));

vi.mock("@/services/github-pr-service", () => ({
  fetchPullRequests: mocks.mockFetchPRs,
}));

vi.mock("@/models/PullRequestReport", () => {
  const MockModel = function (this: any, data: any) {
    Object.assign(this, data);
    this._id = new mongoose.Types.ObjectId();
    this.save = mocks.mockPRReportSave.mockResolvedValue(this);
  } as any;
  MockModel.findOne = mocks.mockPRReportFindOne;
  MockModel.index = vi.fn();
  return { default: MockModel };
});

import { GET as pullsHandler } from "@/app/api/github/repos/[owner]/[repo]/pulls/route";
import { POST as analyzePRHandler } from "@/app/api/pr/analyze/route";
import { GET as getPRHandler } from "@/app/api/pr/[id]/route";

describe("Pull Request API Routes", () => {
  const jwtSecret = "this-is-a-secure-test-secret-for-jwt-123456";
  const userId = new mongoose.Types.ObjectId().toString();
  const prReportId = new mongoose.Types.ObjectId().toString();

  const validToken = jwt.sign({ id: userId }, jwtSecret);

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = jwtSecret;
  });

  describe("GET /api/github/repos/[owner]/[repo]/pulls", () => {
    it("returns 401 when no token is provided", async () => {
      const req = new NextRequest("http://localhost/api/github/repos/octocat/hello/pulls");
      const res = await pullsHandler(req, {
        params: Promise.resolve({ owner: "octocat", repo: "hello" }),
      });

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("returns 200 with list of pull requests when authenticated", async () => {
      const mockPulls = [
        {
          number: 101,
          title: "feat: add oauth",
          author: "alice",
          state: "open",
          htmlUrl: "https://github.com/octocat/hello/pull/101",
          baseBranch: "main",
          headBranch: "feat-oauth",
          createdAt: "2026-11-20T10:00:00Z",
          updatedAt: "2026-11-22T10:00:00Z",
        },
      ];
      mocks.mockFetchPRs.mockResolvedValueOnce(mockPulls);

      const req = new NextRequest("http://localhost/api/github/repos/octocat/hello/pulls", {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const res = await pullsHandler(req, {
        params: Promise.resolve({ owner: "octocat", repo: "hello" }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.pullRequests).toHaveLength(1);
      expect(data.pullRequests[0].number).toBe(101);
    });
  });

  describe("POST /api/pr/analyze", () => {
    it("returns 401 when unauthorized", async () => {
      const req = new NextRequest("http://localhost/api/pr/analyze", {
        method: "POST",
        body: JSON.stringify({ repoUrl: "https://github.com/octocat/hello", pullNumber: 1 }),
      });

      const res = await analyzePRHandler(req);
      expect(res.status).toBe(401);
    });

    it("returns 400 when pullNumber is invalid", async () => {
      const req = new NextRequest("http://localhost/api/pr/analyze", {
        method: "POST",
        headers: { authorization: `Bearer ${validToken}` },
        body: JSON.stringify({ repoUrl: "https://github.com/octocat/hello", pullNumber: -5 }),
      });

      const res = await analyzePRHandler(req);
      expect(res.status).toBe(400);
    });

    it("runs analysis and saves immutable report when valid", async () => {
      const mockAnalysisResult = {
        repoUrl: "https://github.com/octocat/hello",
        repoName: "octocat/hello",
        prNumber: 42,
        prTitle: "fix: security patch",
        prAuthor: "bob",
        baseSha: "aaaaaaa",
        headSha: "bbbbbbb",
        baseBranch: "main",
        headBranch: "fix-sec",
        status: "open",
        verdict: "approved",
        verdictReason: "Clean review",
        scoreDelta: 5,
        baseScore: 80,
        headScore: 85,
        changedFilesCount: 2,
        additions: 15,
        deletions: 3,
        counts: { introduced: 0, resolved: 1, persistent: 2, worsened: 0, improved: 0 },
        introducedIssues: [],
        resolvedIssues: [],
        persistentIssues: [],
        worsenedIssues: [],
        improvedIssues: [],
        summary: "Clean review",
        analyzedAt: new Date().toISOString(),
      };

      mocks.mockAnalyzePR.mockResolvedValueOnce(mockAnalysisResult);

      const req = new NextRequest("http://localhost/api/pr/analyze", {
        method: "POST",
        headers: { authorization: `Bearer ${validToken}` },
        body: JSON.stringify({
          repoUrl: "https://github.com/octocat/hello",
          pullNumber: 42,
        }),
      });

      const res = await analyzePRHandler(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.reportId).toBeDefined();
      expect(data.report.verdict).toBe("approved");
      expect(mocks.mockPRReportSave).toHaveBeenCalled();
    });
  });

  describe("GET /api/pr/[id]", () => {
    it("returns 401 when unauthorized", async () => {
      const req = new NextRequest(`http://localhost/api/pr/${prReportId}`);
      const res = await getPRHandler(req, {
        params: Promise.resolve({ id: prReportId }),
      });

      expect(res.status).toBe(401);
    });

    it("returns 404 when report not found", async () => {
      mocks.mockPRReportFindOne.mockReturnValueOnce({
        lean: vi.fn().mockResolvedValueOnce(null),
      });

      const req = new NextRequest(`http://localhost/api/pr/${prReportId}`, {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const res = await getPRHandler(req, {
        params: Promise.resolve({ id: prReportId }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe("Pull request analysis report not found");
    });

    it("returns 200 with report when found", async () => {
      const mockDoc = {
        _id: prReportId,
        userId,
        repoName: "octocat/hello",
        prNumber: 42,
        verdict: "needs_work",
        scoreDelta: -3,
      };

      mocks.mockPRReportFindOne.mockReturnValueOnce({
        lean: vi.fn().mockResolvedValueOnce(mockDoc),
      });

      const req = new NextRequest(`http://localhost/api/pr/${prReportId}`, {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const res = await getPRHandler(req, {
        params: Promise.resolve({ id: prReportId }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.report.verdict).toBe("needs_work");
    });
  });
});
