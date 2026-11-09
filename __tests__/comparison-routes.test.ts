import { beforeEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  mockReportFindOne: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  default: vi.fn(),
}));

vi.mock("@/models/Report", () => ({
  default: {
    findOne: mocks.mockReportFindOne,
  },
}));

import { GET as runsHandler } from "@/app/api/analysis/[reportId]/runs/route";
import { GET as compareHandler } from "@/app/api/analysis/[reportId]/compare/route";

describe("Comparison and Runs API Routes", () => {
  const jwtSecret = "this-is-a-secure-test-secret-for-jwt-123456";
  const userId = new mongoose.Types.ObjectId().toString();
  const reportId = new mongoose.Types.ObjectId().toString();

  const validToken = jwt.sign({ id: userId }, jwtSecret);

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = jwtSecret;
  });

  describe("GET /api/analysis/[reportId]/runs", () => {
    it("returns 401 when no authorization header is provided", async () => {
      const req = new NextRequest(`http://localhost/api/analysis/${reportId}/runs`);
      const response = await runsHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("returns 400 when reportId is invalid", async () => {
      const req = new NextRequest("http://localhost/api/analysis/not-a-valid-id/runs", {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const response = await runsHandler(req, {
        params: Promise.resolve({ reportId: "not-a-valid-id" }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Invalid report ID");
    });

    it("returns 404 when report is not found", async () => {
      mocks.mockReportFindOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue(null),
      });

      const req = new NextRequest(`http://localhost/api/analysis/${reportId}/runs`, {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const response = await runsHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe("Report not found");
    });

    it("returns the runs list when report exists with historical runs", async () => {
      const mockRuns = [
        {
          runId: "run-1",
          commitSha: "abc1111",
          commitMessage: "initial commit",
          branch: "main",
          analyzedAt: new Date("2026-03-01T10:00:00Z"),
          maturityScore: 70,
          level: "prototype",
        },
        {
          runId: "run-2",
          commitSha: "def2222",
          commitMessage: "added auth & tests",
          branch: "main",
          analyzedAt: new Date("2026-03-02T10:00:00Z"),
          maturityScore: 85,
          level: "mvp",
        },
      ];

      mocks.mockReportFindOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(reportId),
          userId,
          repoName: "test-user/my-repo",
          repoUrl: "https://github.com/test-user/my-repo",
          runs: mockRuns,
        }),
      });

      const req = new NextRequest(`http://localhost/api/analysis/${reportId}/runs`, {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const response = await runsHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.runs).toHaveLength(2);
      expect(data.runs[0].commitSha).toBe("abc1111");
      expect(data.runs[1].commitSha).toBe("def2222");
    });

    it("synthesizes a single run when runs array is empty", async () => {
      mocks.mockReportFindOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(reportId),
          userId,
          repoName: "test-user/single-run-repo",
          commitSha: "sha1234",
          maturityScore: 68,
          level: "prototype",
          runs: [],
        }),
      });

      const req = new NextRequest(`http://localhost/api/analysis/${reportId}/runs`, {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const response = await runsHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.runs).toHaveLength(1);
      expect(data.runs[0].commitSha).toBe("sha1234");
    });
  });

  describe("GET /api/analysis/[reportId]/compare", () => {
    const baseRunData = {
      runId: "run-baseline",
      commitSha: "1111111",
      commitMessage: "Base commit",
      branch: "main",
      maturityScore: 60,
      level: "prototype",
      isProductionReady: false,
      selectedFilesCount: 20,
      categoryScores: {
        security: { score: 50, findings: 2 },
        architecture: { score: 60, findings: 1 },
      },
      dangerousIssues: [
        {
          id: "sec-1",
          title: "Hardcoded secret",
          severity: "high",
          category: "security",
          filePath: "src/auth.ts",
          startLine: 10,
          endLine: 12,
        },
      ],
      missingImprovements: [],
      criticalBlockers: [],
      nextSteps: [],
      strengths: [],
      projectContext: { intent: "fullstack", confidence: 90 },
      analyzedAt: new Date("2026-03-01T12:00:00Z"),
    };

    const targetRunData = {
      runId: "run-target",
      commitSha: "2222222",
      commitMessage: "Fixed hardcoded secret",
      branch: "main",
      maturityScore: 80,
      level: "mvp",
      isProductionReady: true,
      selectedFilesCount: 25,
      categoryScores: {
        security: { score: 85, findings: 0 },
        architecture: { score: 75, findings: 0 },
      },
      dangerousIssues: [],
      missingImprovements: [],
      criticalBlockers: [],
      nextSteps: [],
      strengths: [],
      projectContext: { intent: "fullstack", confidence: 90 },
      analyzedAt: new Date("2026-03-02T12:00:00Z"),
    };

    it("returns 401 when unauthorized", async () => {
      const req = new NextRequest(`http://localhost/api/analysis/${reportId}/compare`);
      const response = await compareHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(401);
    });

    it("returns comparison results between runs in the same report", async () => {
      mocks.mockReportFindOne.mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: new mongoose.Types.ObjectId(reportId),
          userId,
          repoName: "test-user/my-repo",
          repoUrl: "https://github.com/test-user/my-repo",
          runs: [baseRunData, targetRunData],
        }),
      });

      const req = new NextRequest(
        `http://localhost/api/analysis/${reportId}/compare?baseRunId=run-baseline&targetRunId=run-target`,
        {
          headers: { authorization: `Bearer ${validToken}` },
        }
      );
      const response = await compareHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.hasMultipleRuns).toBe(true);
      expect(data.comparison.overallDelta).toBe(20);
      expect(data.comparison.findings.counts.resolved).toBe(1);
      expect(data.comparison.findings.resolved[0].issue.title).toBe("Hardcoded secret");
      expect(data.comparison.fairness.intentChanged).toBe(false);
      expect(data.comparison.fairness.sameCommit).toBe(false);
    });

    it("handles single-run report by indicating no prior runs when no other repo reports exist", async () => {
      // First findOne returns report, second findOne for previousReport returns null
      mocks.mockReportFindOne
        .mockReturnValueOnce({
          lean: vi.fn().mockResolvedValue({
            _id: new mongoose.Types.ObjectId(reportId),
            userId,
            repoName: "test-user/fresh-repo",
            repoUrl: "https://github.com/test-user/fresh-repo",
            commitSha: "1111111",
            maturityScore: 70,
            level: "mvp",
            runs: [],
          }),
        })
        .mockReturnValueOnce({
          sort: vi.fn().mockReturnValue({
            lean: vi.fn().mockResolvedValue(null),
          }),
        });

      const req = new NextRequest(`http://localhost/api/analysis/${reportId}/compare`, {
        headers: { authorization: `Bearer ${validToken}` },
      });
      const response = await compareHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.hasMultipleRuns).toBe(false);
      expect(data.message).toBeDefined();
    });

    it("compares two separate report documents when compareWithReportId is provided", async () => {
      const otherReportId = new mongoose.Types.ObjectId().toString();

      mocks.mockReportFindOne
        .mockReturnValueOnce({
          lean: vi.fn().mockResolvedValue({
            _id: new mongoose.Types.ObjectId(reportId),
            userId,
            repoName: "test-user/repo-a",
            ...targetRunData,
          }),
        })
        .mockReturnValueOnce({
          lean: vi.fn().mockResolvedValue({
            _id: new mongoose.Types.ObjectId(otherReportId),
            userId,
            repoName: "test-user/repo-a",
            ...baseRunData,
          }),
        });

      const req = new NextRequest(
        `http://localhost/api/analysis/${reportId}/compare?compareWithReportId=${otherReportId}`,
        {
          headers: { authorization: `Bearer ${validToken}` },
        }
      );
      const response = await compareHandler(req, {
        params: Promise.resolve({ reportId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.comparison).toBeDefined();
      expect(data.comparison.overallDelta).toBe(20);
    });
  });
});
