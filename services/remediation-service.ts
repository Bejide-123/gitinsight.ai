import type { Issue } from "@/types/analysis";
import type { RemediationGuidance, SuggestedPatch } from "@/types/pr";
import { getGeminiModel } from "@/config/gemini";

interface RuleTemplate {
  ruleId: string;
  match: (issue: Issue) => boolean;
  generate: (issue: Issue) => RemediationGuidance;
}

const DETERMINISTIC_TEMPLATES: RuleTemplate[] = [
  // 1. Hardcoded Secrets
  {
    ruleId: "SEC_HARDCODED_SECRET",
    match: (issue) =>
      /hardcoded.*(?:key|secret|token|password)/i.test(issue.title) ||
      /secret/i.test(issue.category && issue.title),
    generate: (issue) => {
      const fileName = issue.file || "source file";
      const line = issue.lineNumber || 1;
      const evidenceSnippet = issue.evidence?.[0] || 'const API_KEY = "sk_live_123456789";';

      const suggestedPatch: SuggestedPatch = {
        fileName,
        startLine: line,
        endLine: line,
        beforeCode: evidenceSnippet,
        afterCode: `// Load from environment variable\nconst API_KEY = process.env.API_KEY || "";`,
        diffHunk: `@@ -${line},1 +${line},2 @@\n- ${evidenceSnippet}\n+ // Load from environment variable\n+ const API_KEY = process.env.API_KEY || "";`,
      };

      return {
        ruleId: "SEC_HARDCODED_SECRET",
        whyItMatters:
          "Hardcoded credentials in source control can be extracted by any collaborator, git history crawler, or leak via automated logs, leading to full infrastructure compromise.",
        exploitScenario:
          "An attacker discovers this secret in the git commit log, allowing unauthorized access to external APIs or production databases.",
        steps: [
          "Immediately revoke and rotate the exposed credential in the provider dashboard.",
          "Add the secret variable name to `.env.example` without any sensitive values.",
          "Inject the secret via production environment secrets (e.g., GitHub Secrets, Vercel, Vault).",
          "Replace inline references in code with `process.env.<VARIABLE_NAME>`.",
        ],
        suggestedPatch,
        tradeoffs: [
          "Requires configuring environment variables in local `.env.local` and all CI/CD pipelines.",
          "Deployment may fail if the environment variable is not defined before startup.",
        ],
        confidence: 0.95,
        autoFixable: false,
      };
    },
  },

  // 2. SQL Injection
  {
    ruleId: "SEC_SQL_INJECTION",
    match: (issue) =>
      /sql injection/i.test(issue.title) || /sql/i.test(issue.title),
    generate: (issue) => {
      const fileName = issue.file || "database query file";
      const line = issue.lineNumber || 1;
      const snippet = issue.evidence?.[0] || 'db.query(`SELECT * FROM users WHERE id = ${userId}`);';

      const suggestedPatch: SuggestedPatch = {
        fileName,
        startLine: line,
        endLine: line,
        beforeCode: snippet,
        afterCode: `// Use parameterized query\ndb.query("SELECT * FROM users WHERE id = $1", [userId]);`,
        diffHunk: `@@ -${line},1 +${line},2 @@\n- ${snippet}\n+ // Use parameterized query\n+ db.query("SELECT * FROM users WHERE id = $1", [userId]);`,
      };

      return {
        ruleId: "SEC_SQL_INJECTION",
        whyItMatters:
          "String-interpolated SQL statements allow untrusted user input to escape the data context and alter query structure, allowing attackers to dump tables or execute destructive commands.",
        exploitScenario:
          "An attacker submits `' OR 1=1 --` into the query parameter, bypassing authentication or exposing all customer records.",
        steps: [
          "Replace raw string concatenation/interpolation with database parameterized placeholders (`$1`, `?`).",
          "Pass parameters as a separate argument array to the database client.",
          "Adopt a type-safe query builder or ORM (e.g., Prisma, Drizzle, Kysely) for runtime query protection.",
        ],
        suggestedPatch,
        tradeoffs: [
          "Batch dynamic sorting or identifiers cannot use parameters and require strict column whitelisting.",
        ],
        confidence: 0.95,
        autoFixable: false,
      };
    },
  },

  // 3. Command Injection
  {
    ruleId: "SEC_COMMAND_INJECTION",
    match: (issue) => /command injection/i.test(issue.title),
    generate: (issue) => {
      const fileName = issue.file || "executor file";
      const line = issue.lineNumber || 1;
      const snippet = issue.evidence?.[0] || 'exec(`ping ${ip}`);';

      const suggestedPatch: SuggestedPatch = {
        fileName,
        startLine: line,
        endLine: line,
        beforeCode: snippet,
        afterCode: `// Use execFile without shell interpretation\nexecFile("ping", [ip], (err, stdout) => { ... });`,
        diffHunk: `@@ -${line},1 +${line},2 @@\n- ${snippet}\n+ execFile("ping", [ip], (err, stdout) => { ... });`,
      };

      return {
        ruleId: "SEC_COMMAND_INJECTION",
        whyItMatters:
          "Passing unvalidated input directly to a system shell enables Remote Code Execution (RCE) with the privileges of the application process.",
        exploitScenario:
          "An attacker enters `; rm -rf /` or opens a reverse shell to gain full host control.",
        steps: [
          "Do not invoke a shell environment via `exec()` or `child_process.exec`.",
          "Use `execFile` or `spawn` where executable paths and argument arrays are strictly separated.",
          "Validate input against an alphanumeric allowlist before execution.",
        ],
        suggestedPatch,
        tradeoffs: [
          "Pipes (`|`) and shell redirects (`>`) cannot be used with `execFile` and must be handled in Node streams.",
        ],
        confidence: 0.95,
        autoFixable: false,
      };
    },
  },

  // 4. Overly Permissive CORS
  {
    ruleId: "SEC_PERMISSIVE_CORS",
    match: (issue) => /cors/i.test(issue.title),
    generate: (issue) => {
      const fileName = issue.file || "server file";
      const line = issue.lineNumber || 1;
      const snippet = issue.evidence?.[0] || 'res.setHeader("Access-Control-Allow-Origin", "*");';

      const suggestedPatch: SuggestedPatch = {
        fileName,
        startLine: line,
        endLine: line,
        beforeCode: snippet,
        afterCode: `const ALLOWED_ORIGIN = process.env.APP_URL || "https://myapp.com";\nres.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);`,
        diffHunk: `@@ -${line},1 +${line},2 @@\n- ${snippet}\n+ const ALLOWED_ORIGIN = process.env.APP_URL || "https://myapp.com";\n+ res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);`,
      };

      return {
        ruleId: "SEC_PERMISSIVE_CORS",
        whyItMatters:
          "Setting `Access-Control-Allow-Origin: *` on authenticated endpoints allows third-party malicious websites to read sensitive API responses on behalf of authenticated users.",
        exploitScenario:
          "A malicious page uses JavaScript to fetch the user's private profile or credentials because the browser allows wildcard cross-origin access.",
        steps: [
          "Replace wildcard `*` with an explicit trusted domain origin.",
          "Validate incoming `Origin` headers against an approved whitelist in production.",
          "Ensure `Access-Control-Allow-Credentials: true` is only sent to specific, trusted origins.",
        ],
        suggestedPatch,
        tradeoffs: [
          "Local development requires configuring `http://localhost:3000` in the origin whitelist.",
        ],
        confidence: 0.9,
        autoFixable: true,
      };
    },
  },

  // 5. Missing Test Coverage / Missing Tests
  {
    ruleId: "TEST_MISSING_COVERAGE",
    match: (issue) => /test/i.test(issue.category) || /test/i.test(issue.title),
    generate: (issue) => {
      const fileName = issue.file || "module.ts";
      const testFileName = fileName.replace(/\.([jt]sx?)$/, ".test.$1");

      return {
        ruleId: "TEST_MISSING_COVERAGE",
        whyItMatters:
          "Lack of automated test suites increases regression risk, slows down feature deployment, and leaves edge-case bugs undetected until production.",
        exploitScenario:
          "A future refactoring modifies this function's return contract, silently breaking client authentication without failing any build step.",
        steps: [
          `Create a companion test file at \`${testFileName}\`.`,
          "Write positive test cases covering standard happy paths.",
          "Write boundary tests verifying null, undefined, and erroneous inputs.",
          "Add the test suite to your CI pipeline (`npm test`).",
        ],
        tradeoffs: [
          "Increases development time initially, but reduces long-term maintenance overhead.",
        ],
        confidence: 0.85,
        autoFixable: false,
      };
    },
  },
];

/**
 * Enriches an issue with remediation guidance (deterministic rule matching first, AI fallback second).
 */
export async function enrichIssueWithRemediation(
  issue: Issue
): Promise<RemediationGuidance> {
  // 1. Check deterministic rule catalog
  for (const template of DETERMINISTIC_TEMPLATES) {
    if (template.match(issue)) {
      return template.generate(issue);
    }
  }

  // 2. Fallback to Gemini AI structured generation
  try {
    const aiGuidance = await generateAIRemediation(issue);
    if (aiGuidance) {
      return aiGuidance;
    }
  } catch (err) {
    console.warn("AI remediation generation failed, using generic fallback:", err);
  }

  // 3. Generic baseline guidance
  return {
    ruleId: issue.ruleId || "GENERAL_CODE_QUALITY",
    whyItMatters:
      issue.impact ||
      "Code issues in this area can degrade maintainability, performance, or system reliability.",
    steps: [
      issue.recommendation || "Refactor code to adhere to best engineering practices.",
      "Inspect related modules to ensure consistency.",
      "Add automated unit tests verifying the expected behavior.",
    ],
    tradeoffs: [
      "Requires code review and testing across affected integration points.",
    ],
    confidence: 0.75,
    autoFixable: false,
  };
}

async function generateAIRemediation(
  issue: Issue
): Promise<RemediationGuidance | null> {
  const model = getGeminiModel();
  const prompt = `You are a principal software engineer. Generate a structured remediation plan for the following code finding:

File: ${issue.file || "unknown"}
Category: ${issue.category}
Severity: ${issue.severity}
Title: ${issue.title}
Description: ${issue.description}
Impact: ${issue.impact}
Evidence: ${(issue.evidence || []).join("\n")}

Respond ONLY with valid JSON in this exact structure:
{
  "whyItMatters": "Deep technical explanation of why this matters",
  "exploitScenario": "Real-world risk, outage or security scenario",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "tradeoffs": ["Potential side effect or trade-off"],
  "confidence": 0.85
}`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(clean);

  return {
    ruleId: issue.ruleId || "AI_GENERATED_REMEDIATION",
    whyItMatters: parsed.whyItMatters || issue.impact,
    exploitScenario: parsed.exploitScenario,
    steps: Array.isArray(parsed.steps) ? parsed.steps : [issue.recommendation],
    tradeoffs: Array.isArray(parsed.tradeoffs) ? parsed.tradeoffs : [],
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
    autoFixable: false,
  };
}

/**
 * Batch-enriches a list of classified findings with remediation guidance.
 */
export async function enrichFindingsList<T extends { issue: Issue; remediation?: RemediationGuidance }>(
  findings: T[]
): Promise<T[]> {
  const enriched = await Promise.all(
    findings.map(async (item) => {
      const guidance = await enrichIssueWithRemediation(item.issue);
      item.issue.remediation = guidance;
      item.remediation = guidance;
      return item;
    })
  );
  return enriched;
}
