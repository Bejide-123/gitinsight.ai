import { describe, it, expect } from "vitest";
import {
  enrichIssueWithRemediation,
  enrichFindingsList,
} from "@/services/remediation-service";
import type { Issue } from "@/types/analysis";
import type { ClassifiedPRFinding } from "@/types/pr";

describe("Remediation Service", () => {
  it("generates deterministic remediation for hardcoded secrets", async () => {
    const issue: Issue = {
      category: "Security",
      severity: "critical",
      title: "Hardcoded API Key Detected",
      description: "Found credentials in source code",
      isDangerous: true,
      impact: "CRITICAL SECURITY BREACH",
      recommendation: "Move secrets to .env file",
      evidence: ['const STRIPE_KEY = "sk_live_123456789";'],
      file: "services/stripe.ts",
      lineNumber: 12,
    };

    const guidance = await enrichIssueWithRemediation(issue);

    expect(guidance.ruleId).toBe("SEC_HARDCODED_SECRET");
    expect(guidance.steps.length).toBeGreaterThanOrEqual(3);
    expect(guidance.suggestedPatch).toBeDefined();
    expect(guidance.suggestedPatch?.fileName).toBe("services/stripe.ts");
    expect(guidance.suggestedPatch?.diffHunk).toContain("process.env.API_KEY");
    expect(guidance.tradeoffs.length).toBeGreaterThan(0);
    expect(guidance.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("generates deterministic remediation for SQL injection", async () => {
    const issue: Issue = {
      category: "Security",
      severity: "critical",
      title: "SQL Injection Risk",
      description: "Direct string concatenation into database query",
      isDangerous: true,
      impact: "DB compromised",
      recommendation: "Use parameterized queries",
      evidence: ['db.query(`SELECT * FROM users WHERE id = ${id}`);'],
      file: "routes/user.ts",
      lineNumber: 44,
    };

    const guidance = await enrichIssueWithRemediation(issue);

    expect(guidance.ruleId).toBe("SEC_SQL_INJECTION");
    expect(guidance.suggestedPatch?.afterCode).toContain("$1");
    expect(guidance.steps.some((s) => s.toLowerCase().includes("parameterized"))).toBe(true);
  });

  it("generates deterministic remediation for permissive CORS", async () => {
    const issue: Issue = {
      category: "Security",
      severity: "medium",
      title: "Overly Permissive CORS Header",
      description: "Wildcard * used in Access-Control-Allow-Origin",
      isDangerous: false,
      impact: "Cross-site data leak",
      recommendation: "Specify allowed origin",
      evidence: ['res.setHeader("Access-Control-Allow-Origin", "*");'],
      file: "server.ts",
      lineNumber: 10,
    };

    const guidance = await enrichIssueWithRemediation(issue);

    expect(guidance.ruleId).toBe("SEC_PERMISSIVE_CORS");
    expect(guidance.autoFixable).toBe(true);
    expect(guidance.suggestedPatch?.afterCode).toContain("ALLOWED_ORIGIN");
  });

  it("batch-enriches a list of classified findings", async () => {
    const findings: ClassifiedPRFinding[] = [
      {
        state: "introduced",
        issue: {
          category: "Security",
          severity: "critical" as const,
          title: "Hardcoded Secret Detected",
          description: "Found secret",
          isDangerous: true,
          impact: "Breach",
          recommendation: "Fix secret",
          evidence: [],
          file: "config.ts",
          lineNumber: 5,
        },
        fingerprint: "sec::config.ts::secret",
        changeSummary: "Introduced in PR",
      },
    ];

    const enriched = await enrichFindingsList(findings);

    expect(enriched[0].remediation).toBeDefined();
    expect(enriched[0].issue.remediation).toBeDefined();
    expect(enriched[0].remediation?.ruleId).toBe("SEC_HARDCODED_SECRET");
  });
});
