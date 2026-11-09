import { describe, expect, it } from "vitest";
import {
  compareFindings,
  compareAnalyses,
  getFindingFingerprint,
} from "@/services/comparison-service";
import type { Issue } from "@/types/analysis";

describe("Comparison Service", () => {
  const issueA1: Issue = {
    category: "Security",
    severity: "critical",
    title: "Hardcoded database secret",
    description: "Database credentials exposed in config.ts",
    isDangerous: true,
    impact: "Data breach",
    recommendation: "Use environment variables",
    evidence: ["const db = 'secret'"],
    file: "src/config.ts",
    lineNumber: 12,
  };

  const issueA2: Issue = {
    category: "Testing",
    severity: "medium",
    title: "Missing unit test for auth flow",
    description: "Auth service lacks test coverage",
    isDangerous: false,
    impact: "Regression risk",
    recommendation: "Add vitest test",
    evidence: [],
    file: "src/auth.ts",
    lineNumber: 50,
  };

  const issueB2_persistent: Issue = {
    ...issueA2, // Present in both with same severity -> Persistent!
  };

  const issueB3_new: Issue = {
    category: "Architecture",
    severity: "high",
    title: "Circular dependency detected",
    description: "Cycle between auth and user modules",
    isDangerous: false,
    impact: "Build and runtime instability",
    recommendation: "Extract common types",
    evidence: ["import { User } from './user'"],
    file: "src/auth/service.ts",
    lineNumber: 5,
  };

  const issueB4_changed: Issue = {
    category: "Security",
    severity: "critical", // Changed from medium to critical!
    title: "Unvalidated redirect URL",
    description: "Open redirect in login callback",
    isDangerous: true,
    impact: "Phishing risk",
    recommendation: "Whitelist domains",
    evidence: [],
    file: "src/routes/auth.ts",
    lineNumber: 85,
  };

  const issueA4_prev: Issue = {
    ...issueB4_changed,
    severity: "medium",
    lineNumber: 30,
  };

  describe("getFindingFingerprint", () => {
    it("generates consistent fingerprints ignoring path separator differences", () => {
      const fp1 = getFindingFingerprint({ ...issueA1, file: "src\\config.ts" });
      const fp2 = getFindingFingerprint({ ...issueA1, file: "src/config.ts" });
      expect(fp1).toBe(fp2);
    });
  });

  describe("compareFindings", () => {
    it("correctly partitions findings into new, resolved, persistent, and changed", () => {
      const baseIssues = [issueA1, issueA2, issueA4_prev];
      const targetIssues = [issueB2_persistent, issueB3_new, issueB4_changed];

      const diff = compareFindings(baseIssues, targetIssues);

      // issueA1 is in base but not in target -> Resolved
      expect(diff.resolved.length).toBe(1);
      expect(diff.resolved[0].issue.title).toBe("Hardcoded database secret");
      expect(diff.resolved[0].state).toBe("resolved");

      // issueB3 is in target but not in base -> New
      expect(diff.new.length).toBe(1);
      expect(diff.new[0].issue.title).toBe("Circular dependency detected");
      expect(diff.new[0].state).toBe("new");

      // issueB2 is in both with same severity -> Persistent
      expect(diff.persistent.length).toBe(1);
      expect(diff.persistent[0].issue.title).toBe("Missing unit test for auth flow");
      expect(diff.persistent[0].state).toBe("persistent");

      // issueB4 is in both with escalated severity -> Changed
      expect(diff.changed.length).toBe(1);
      expect(diff.changed[0].issue.title).toBe("Unvalidated redirect URL");
      expect(diff.changed[0].state).toBe("changed");
      expect(diff.changed[0].changeSummary).toContain("Severity escalated from medium to critical");

      // Counts match
      expect(diff.counts.total).toBe(4);
      expect(diff.counts.new).toBe(1);
      expect(diff.counts.resolved).toBe(1);
      expect(diff.counts.persistent).toBe(1);
      expect(diff.counts.changed).toBe(1);
    });

    it("classifies a finding moved to another file as changed", () => {
      const movedIssue = { ...issueA1, file: "src/security/config.ts" };
      const diff = compareFindings([issueA1], [movedIssue]);

      expect(diff.new).toHaveLength(0);
      expect(diff.resolved).toHaveLength(0);
      expect(diff.changed).toHaveLength(1);
      expect(diff.changed[0].details?.previousFile).toBe("src/config.ts");
      expect(diff.changed[0].details?.newFile).toBe("src/security/config.ts");
      expect(diff.changed[0].changeSummary).toContain("File moved");
    });

    it("classifies material finding detail changes as changed", () => {
      const updatedIssue = {
        ...issueA1,
        description: "Credentials are exposed through a different path",
      };
      const diff = compareFindings([issueA1], [updatedIssue]);

      expect(diff.changed).toHaveLength(1);
      expect(diff.changed[0].changeSummary).toContain("Finding details modified");
    });

    it("matches duplicate findings one-to-one", () => {
      const diff = compareFindings([issueA1, issueA1], [issueA1]);

      expect(diff.persistent).toHaveLength(1);
      expect(diff.resolved).toHaveLength(1);
      expect(diff.counts.total).toBe(2);
    });
  });

  describe("compareAnalyses", () => {
    it("computes overall score delta and category breakdowns accurately", () => {
      const runA = {
        commitSha: "1111111111111111111111111111111111111111",
        analyzedAt: new Date("2026-11-01T10:00:00Z"),
        maturityScore: 65,
        level: "Intermediate",
        isProductionReady: false,
        categoryScores: {
          security: { score: 50, weight: 0.25, issues: [issueA1] },
          architecture: { score: 70, weight: 0.25, issues: [] },
          testing: { score: 60, weight: 0.2, issues: [issueA2] },
        },
        dangerousIssues: [issueA1],
        missingImprovements: [issueA2],
        selectedFilesCount: 20,
        projectContext: {
          intent: "mvp" as const,
          confidence: 90,
          signals: [],
          expectedFeatures: [],
          notRequiredFeatures: [],
        },
      };

      const runB = {
        commitSha: "2222222222222222222222222222222222222222",
        analyzedAt: new Date("2026-11-05T12:00:00Z"),
        maturityScore: 78,
        level: "Production Ready",
        isProductionReady: true,
        categoryScores: {
          security: { score: 85, weight: 0.25, issues: [] },
          architecture: { score: 75, weight: 0.25, issues: [] },
          testing: { score: 65, weight: 0.2, issues: [issueA2] },
        },
        dangerousIssues: [], // Fixed issueA1!
        missingImprovements: [issueA2],
        selectedFilesCount: 22,
        projectContext: {
          intent: "mvp" as const,
          confidence: 90,
          signals: [],
          expectedFeatures: [],
          notRequiredFeatures: [],
        },
      };

      const result = compareAnalyses(runA, runB);

      expect(result.overallDelta).toBe(13); // 78 - 65
      expect(result.levelChanged).toBe(true);
      expect(result.readinessChanged).toBe(true);

      // Security category delta
      expect(result.categoryComparisons.security.delta).toBe(35); // 85 - 50
      expect(result.categoryComparisons.security.status).toBe("improved");
      expect(result.categoryComparisons.security.pointContribution).toBeGreaterThan(0);

      // Findings diff inside comparison
      expect(result.findings.counts.resolved).toBe(1);
      expect(result.findings.resolved[0].issue.title).toBe("Hardcoded database secret");

      // Attributions
      expect(result.attributions.length).toBeGreaterThan(0);
      expect(result.attributions[0].category.toLowerCase()).toBe("security");
      expect(result.attributions[0].type).toBe("positive");

      // Summary
      expect(result.summary).toContain("improved by +13 points");
    });

    it("evaluates fairness when project intent configuration changes", () => {
      const runA = {
        commitSha: "3333333333333333333333333333333333333333",
        maturityScore: 70,
        categoryScores: {
          security: { score: 60, weight: 0.2, issues: [] },
        },
        projectContext: { intent: "portfolio" as const, confidence: 90, signals: [], expectedFeatures: [], notRequiredFeatures: [] },
        selectedFilesCount: 10,
      };

      const runB = {
        commitSha: "4444444444444444444444444444444444444444",
        maturityScore: 62,
        categoryScores: {
          security: { score: 60, weight: 0.35, issues: [] }, // Code identical, but enterprise weighs security much heavier!
        },
        projectContext: { intent: "enterprise" as const, confidence: 95, signals: [], expectedFeatures: [], notRequiredFeatures: [] },
        selectedFilesCount: 10,
      };

      const result = compareAnalyses(runA, runB);

      expect(result.fairness.intentChanged).toBe(true);
      expect(result.fairness.baseIntent).toBe("portfolio");
      expect(result.fairness.targetIntent).toBe("enterprise");
      expect(result.fairness.categoryWeightsChanged).toBe(true);
      expect(result.fairness.notices.some((n) => n.includes("intent changed"))).toBe(true);
    });

    it("uses recorded score weights and excludes unavailable category scores", () => {
      const result = compareAnalyses(
        {
          maturityScore: 60,
          categoryScores: {
            security: { score: 60, weight: 0.4, issues: [] },
          },
        },
        {
          maturityScore: 70,
          categoryScores: {
            security: { score: 70, weight: 0.6, issues: [] },
          },
        }
      );

      expect(result.categoryComparisons.security.available).toBe(true);
      expect(result.categoryComparisons.security.baseWeight).toBe(0.4);
      expect(result.categoryComparisons.security.targetWeight).toBe(0.6);
      expect(result.categoryComparisons.security.pointContribution).toBe(10);
      expect(result.categoryComparisons.architecture.available).toBe(false);
      expect(result.categoryComparisons.architecture.pointContribution).toBe(0);
      expect(result.fairness.categoryWeightsChanged).toBe(true);
      expect(result.fairness.normalizedScoreDelta).toBe(10);
    });

    it("flags any known analysis scope change", () => {
      const result = compareAnalyses(
        { maturityScore: 60, selectedFilesCount: 20 },
        { maturityScore: 60, selectedFilesCount: 22 }
      );

      expect(result.fairness.fileScopeChanged).toBe(true);
      expect(result.fairness.fileDelta).toBe(2);
    });

    it("detects same commit comparison and notices analyzer/configuration change", () => {
      const sha = "abcdef1234567890abcdef1234567890abcdef12";
      const runA = {
        commitSha: sha,
        maturityScore: 70,
        categoryScores: {},
        selectedFilesCount: 15,
      };
      const runB = {
        commitSha: sha,
        maturityScore: 75,
        categoryScores: {},
        selectedFilesCount: 15,
      };

      const result = compareAnalyses(runA, runB);
      expect(result.fairness.sameCommit).toBe(true);
      expect(result.fairness.notices.some((n) => n.includes("same commit"))).toBe(true);
    });
  });
});
