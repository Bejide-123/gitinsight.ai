import { describe, it, expect } from "vitest";
import { classifyPullRequestFindings } from "@/services/pr-classifier-service";
import type { Issue } from "@/types/analysis";
import type { ParsedFileDiff } from "@/types/pr";

describe("PR Classifier Service", () => {
  const diffMap = new Map<string, ParsedFileDiff>([
    [
      "src/api/auth.ts",
      {
        filename: "src/api/auth.ts",
        status: "modified",
        addedLines: [20, 21, 22],
        deletedLines: [15],
        hunks: [],
      },
    ],
    [
      "src/api/legacy.ts",
      {
        filename: "src/api/legacy.ts",
        status: "removed",
        addedLines: [],
        deletedLines: [1, 2, 3, 4],
        hunks: [],
      },
    ],
  ]);

  it("classifies an issue as 'introduced' when it falls inside diff added lines", () => {
    const baseIssues: Issue[] = [];
    const headIssues: Issue[] = [
      {
        category: "Security",
        severity: "critical",
        title: "Hardcoded API Key Detected",
        description: "Found exposed key",
        isDangerous: true,
        impact: "Severe breach risk",
        recommendation: "Use env var",
        evidence: ["sk_live_123"],
        file: "src/api/auth.ts",
        lineNumber: 21,
      },
    ];

    const result = classifyPullRequestFindings(baseIssues, headIssues, diffMap, -10);

    expect(result.counts.introduced).toBe(1);
    expect(result.introducedIssues[0].state).toBe("introduced");
    expect(result.introducedIssues[0].introducedInLineRange).toBe(true);
    expect(result.verdict).toBe("blocked");
  });

  it("classifies an issue as 'collateral_introduced' when outside modified diff lines", () => {
    const baseIssues: Issue[] = [];
    const headIssues: Issue[] = [
      {
        category: "Code Quality",
        severity: "low",
        title: "Missing JSDoc Comment",
        description: "Function lacks docs",
        isDangerous: false,
        impact: "Maintainability debt",
        recommendation: "Add JSDoc",
        evidence: [],
        file: "src/api/auth.ts",
        lineNumber: 95, // Line 95 is outside addedLines [20, 21, 22]
      },
    ];

    const result = classifyPullRequestFindings(baseIssues, headIssues, diffMap, 0);

    expect(result.counts.introduced).toBe(1);
    expect(result.introducedIssues[0].state).toBe("collateral_introduced");
    expect(result.introducedIssues[0].introducedInLineRange).toBe(false);
  });

  it("classifies an issue as 'resolved' when deleted or modified in PR", () => {
    const baseIssues: Issue[] = [
      {
        category: "Security",
        severity: "high",
        title: "SQL Injection Vulnerability",
        description: "Raw SQL query",
        isDangerous: true,
        impact: "DB leak",
        recommendation: "Use parameterized query",
        evidence: [],
        file: "src/api/auth.ts",
        lineNumber: 15, // Line 15 was in deletedLines
      },
      {
        category: "Architecture",
        severity: "medium",
        title: "Dead Code in Legacy Module",
        description: "Legacy code unused",
        isDangerous: false,
        impact: "Bloat",
        recommendation: "Delete file",
        evidence: [],
        file: "src/api/legacy.ts",
        lineNumber: 2, // File was removed
      },
    ];
    const headIssues: Issue[] = [];

    const result = classifyPullRequestFindings(baseIssues, headIssues, diffMap, +15);

    expect(result.counts.resolved).toBe(2);
    expect(result.resolvedIssues.map((r) => r.issue.title)).toContain("SQL Injection Vulnerability");
    expect(result.resolvedIssues.map((r) => r.issue.title)).toContain("Dead Code in Legacy Module");
  });

  it("classifies an issue as 'worsened' when severity escalates from base to head", () => {
    const baseIssues: Issue[] = [
      {
        category: "Security",
        severity: "medium",
        title: "Permissive CORS Configuration",
        description: "Wildcard CORS",
        isDangerous: false,
        impact: "Cross-origin risk",
        recommendation: "Specify origin",
        evidence: [],
        file: "src/api/auth.ts",
        lineNumber: 5,
      },
    ];
    const headIssues: Issue[] = [
      {
        category: "Security",
        severity: "critical", // Escalated to critical
        title: "Permissive CORS Configuration",
        description: "Wildcard CORS with credentials",
        isDangerous: true,
        impact: "Direct credential theft",
        recommendation: "Specify origin",
        evidence: [],
        file: "src/api/auth.ts",
        lineNumber: 5,
      },
    ];

    const result = classifyPullRequestFindings(baseIssues, headIssues, diffMap, -8);

    expect(result.counts.worsened).toBe(1);
    expect(result.worsenedIssues[0].state).toBe("worsened");
    expect(result.verdict).toBe("blocked");
  });

  it("classifies an issue as 'persistent' when severity is unchanged, even if line shifted", () => {
    const baseIssues: Issue[] = [
      {
        category: "Maintainability",
        severity: "low",
        title: "Long Function Exceeds 80 Lines",
        description: "Refactor function",
        isDangerous: false,
        impact: "Readability",
        recommendation: "Split function",
        evidence: [],
        file: "src/api/auth.ts",
        lineNumber: 40,
      },
    ];
    const headIssues: Issue[] = [
      {
        category: "Maintainability",
        severity: "low",
        title: "Long Function Exceeds 80 Lines",
        description: "Refactor function",
        isDangerous: false,
        impact: "Readability",
        recommendation: "Split function",
        evidence: [],
        file: "src/api/auth.ts",
        lineNumber: 45, // Shifted 5 lines down
      },
    ];

    const result = classifyPullRequestFindings(baseIssues, headIssues, diffMap, 0);

    expect(result.counts.persistent).toBe(1);
    expect(result.persistentIssues[0].state).toBe("persistent");
    expect(result.persistentIssues[0].changeSummary).toContain("line moved");
    expect(result.verdict).toBe("approved");
  });
});
