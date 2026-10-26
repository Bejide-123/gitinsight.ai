// services/chat-service.ts

import { getGeminiModel } from "@/config/gemini";
import { fetchFileContent, parseGitHubUrl } from "./github-service";
import { createGitHubClient } from "@/lib/github";
import { chatResponseSchema, type ChatResponsePayload, type ChatSource, type ChatMessage } from "@/types/chat";
import type { Analysis, Issue } from "@/types/analysis";

// ============================================================
// GEMINI RETRY CONFIGURATION
// ============================================================

const MAX_GEMINI_ATTEMPTS = 3;
const RETRYABLE_GEMINI_STATUSES = new Set([429, 500, 502, 503, 504]);

function isRetryableGeminiError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = "status" in error ? Number(error.status) : undefined;
  if (status !== undefined && RETRYABLE_GEMINI_STATUSES.has(status)) return true;
  return "name" in error && error.name === "TypeError";
}

async function generateWithRetry<T>(generate: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < MAX_GEMINI_ATTEMPTS; attempt++) {
    try {
      return await generate();
    } catch (error) {
      const isLastAttempt = attempt === MAX_GEMINI_ATTEMPTS - 1;
      if (isLastAttempt || !isRetryableGeminiError(error)) throw error;

      const delayMs = 500 * 2 ** attempt + Math.floor(Math.random() * 250);
      console.warn(
        `[CHAT SERVICE] Gemini request failed; retrying (${attempt + 2}/${MAX_GEMINI_ATTEMPTS}) in ${delayMs}ms.`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Gemini request did not complete.");
}

// ============================================================
// DETERMINISTIC INITIAL QUESTIONS GENERATOR
// ============================================================

export function generateInitialRecommendedQuestions(report: Partial<Analysis> | any): string[] {
  const questions: string[] = [];
  const dangerousIssues: Issue[] = report?.dangerousIssues || [];
  const criticalBlockers: string[] = report?.criticalBlockers || [];
  const missingImprovements: Issue[] = report?.missingImprovements || [];

  // 1. Critical / high dangerous issues
  const topSecurityIssue = dangerousIssues.find(
    (i) => i.severity === "critical" || i.severity === "high" || i.category?.toLowerCase().includes("security")
  ) || dangerousIssues[0];

  if (topSecurityIssue) {
    questions.push(`Why did you flag "${topSecurityIssue.title}" as a risk?`);
    if (topSecurityIssue.file) {
      questions.push(`Which files would I need to change to fix "${topSecurityIssue.title}"?`);
    }
  }

  // 2. Critical blockers
  if (criticalBlockers.length > 0) {
    questions.push("What should I prioritise fixing first to reach production readiness?");
  }

  // 3. Residual risk / architecture
  if (dangerousIssues.length > 0) {
    questions.push("If I fix the top security issues, what risks will remain?");
  } else if (missingImprovements.length > 0) {
    const topImprovement = missingImprovements[0];
    questions.push(`How can I resolve "${topImprovement.title}" efficiently?`);
  }

  // 4. General fallback if questions are still sparse
  if (questions.length < 3) {
    questions.push("What are the biggest architectural weaknesses in this codebase?");
  }
  if (questions.length < 3) {
    questions.push("How can I improve the test coverage and reliability?");
  }

  return questions.slice(0, 4);
}

// ============================================================
// CONTEXT ASSEMBLY
// ============================================================

interface AssembleContextParams {
  report: Partial<Analysis> | any;
  history: ChatMessage[];
  userQuestion: string;
  githubAccessToken?: string;
}

interface AssembledContext {
  promptText: string;
  retrievedSources: ChatSource[];
}

export async function assembleChatContext({
  report,
  history,
  userQuestion,
  githubAccessToken,
}: AssembleContextParams): Promise<AssembledContext> {
  const sources: ChatSource[] = [];
  const lowerQuestion = userQuestion.toLowerCase();

  const dangerousIssues: Issue[] = report?.dangerousIssues || [];
  const missingImprovements: Issue[] = report?.missingImprovements || [];
  const allIssues = [...dangerousIssues, ...missingImprovements];

  // 1. Filter issues by keyword relevance or take the most severe
  const matchedIssues = allIssues.filter((issue) => {
    const titleMatch = issue.title && lowerQuestion.includes(issue.title.toLowerCase());
    const categoryMatch = issue.category && lowerQuestion.includes(issue.category.toLowerCase());
    const fileMatch = issue.file && lowerQuestion.includes(issue.file.toLowerCase());
    const descMatch = issue.description && issue.description.toLowerCase().split(" ").some(word => word.length > 4 && lowerQuestion.includes(word));
    return titleMatch || categoryMatch || fileMatch || descMatch;
  });

  const prioritizedIssues = matchedIssues.length > 0
    ? matchedIssues.slice(0, 5)
    : dangerousIssues.slice(0, 4);

  // Record identified findings as sources
  for (const issue of prioritizedIssues) {
    sources.push({
      type: "finding",
      findingId: issue.title,
      title: issue.title,
      path: issue.file,
      startLine: issue.lineNumber,
    });
  }

  // 2. Fetch code snippet if an issue file is specifically mentioned or prioritized
  let codeSnippetsText = "";
  if (report?.repoUrl && prioritizedIssues.length > 0) {
    try {
      const { owner, repo } = parseGitHubUrl(report.repoUrl);
      const client = createGitHubClient(githubAccessToken);

      // Find top file to inspect
      const targetIssueWithFile = prioritizedIssues.find((i) => i.file);
      if (targetIssueWithFile?.file) {
        const filePath = targetIssueWithFile.file;
        const fileContent = await fetchFileContent(owner, repo, filePath, client);

        if (fileContent) {
          // If we have a line number, extract surrounding context (30 lines before & after)
          const lines = fileContent.split("\n");
          const targetLine = targetIssueWithFile.lineNumber || 1;
          const start = Math.max(0, targetLine - 25);
          const end = Math.min(lines.length, targetLine + 35);
          const snippet = lines.slice(start, end).join("\n");

          codeSnippetsText = `\n--- SOURCE FILE: ${filePath} (lines ${start + 1}-${end}) ---\n${snippet}\n`;

          sources.push({
            type: "file",
            path: filePath,
            startLine: start + 1,
            endLine: end,
          });
        }
      }
    } catch (err) {
      console.warn("[CHAT SERVICE] Optional code snippet fetch failed, continuing without code:", err);
    }
  }

  // 3. Assemble findings summary
  const issuesSummary = prioritizedIssues
    .map(
      (i, idx) =>
        `${idx + 1}. [${i.severity?.toUpperCase() || "ISSUE"}] ${i.title} (${i.category || "General"})
   File: ${i.file || "N/A"}${i.lineNumber ? `:${i.lineNumber}` : ""}
   Impact: ${i.impact || "N/A"}
   Recommendation: ${i.recommendation || "N/A"}
   ${i.evidence && i.evidence.length > 0 ? `Evidence: ${i.evidence.join(" | ")}` : ""}`
    )
    .join("\n\n");

  // 4. Assemble recent conversation history (last 6-8 messages)
  const recentHistory = (history || []).slice(-8);
  const historyText = recentHistory
    .map((msg) => `${msg.role === "user" ? "USER" : "ASSISTANT"}: ${msg.content}`)
    .join("\n\n");

  const promptText = `
REPOSITORY INFORMATION:
- Repository: ${report?.repoName || "Unknown"}
- URL: ${report?.repoUrl || "Unknown"}
- Maturity Score: ${report?.maturityScore ?? "N/A"}/100 (Level: ${report?.level || "N/A"})
- Production Ready: ${report?.isProductionReady ? "Yes" : "No"}
- Project Intent: ${report?.projectContext?.intent || "Unknown"} (Confidence: ${report?.projectContext?.confidence ?? "N/A"}%)
- Tech Stack: ${Array.isArray(report?.techStack) ? report.techStack.join(", ") : "Not specified"}
- Critical Blockers: ${Array.isArray(report?.criticalBlockers) && report.criticalBlockers.length > 0 ? report.criticalBlockers.join("; ") : "None reported"}

RELEVANT REPORT FINDINGS:
${issuesSummary || "No specific critical issues found in the selected context."}
${codeSnippetsText}

CONVERSATION HISTORY:
${historyText || "No previous conversation."}

CURRENT USER QUESTION:
${userQuestion}
`;

  return { promptText, retrievedSources: sources };
}

// ============================================================
// SYSTEM INSTRUCTIONS
// ============================================================

const CHAT_SYSTEM_INSTRUCTION = `
You are GitInsight AI, an expert code security and architectural analyst embedded in GitInsight.
You help software engineers understand, interrogate, and remediate findings in their repository.

CRITICAL INSTRUCTIONS & GROUNDING RULES:
1. Grounding: Answer using the provided repository findings, project context, and source code. Do NOT give generic programming advice without connecting it directly to this repository.
2. Evidence vs. Assumptions:
   - If the provided analysis establishes an issue, explain WHY it was flagged and WHICH files/lines are affected.
   - If the available evidence does NOT confirm exploitability or whether it affects other unseen files, say so clearly. Explain what is known, what remains unverified, and what tests or code inspection the developer should perform.
   - NEVER hallucinate files, functions, or test results not present in the context.
3. Multi-turn Cohesion: Refer back to previous discussion when the user asks follow-up questions (e.g. "it", "this issue", "those three").
4. Response Format: Return a STRICT JSON object ONLY matching this schema:
{
  "answer": "Your detailed, clear answer in markdown. Format code snippets with language fences. Be direct, authoritative, and helpful.",
  "sources": [
    {
      "type": "finding",
      "title": "Title of the finding referenced",
      "path": "optional/path/to/file.ts"
    },
    {
      "type": "file",
      "path": "path/to/file.ts",
      "startLine": 10,
      "endLine": 35
    }
  ],
  "suggestedFollowUps": [
    "Contextual follow-up question 1 directly relevant to the answer",
    "Contextual follow-up question 2 to help investigate or fix",
    "Contextual follow-up question 3"
  ]
}

SUGGESTED FOLLOW-UPS GUIDELINES:
- Provide exactly 2 or 3 follow-up questions.
- Must be specific to this repository and the answer just generated.
- Help the developer resolve, verify, or prioritize the issue.
- Do NOT repeat questions already asked in the conversation history.
- Return ONLY the raw JSON object, without any markdown fences, explanation, or preamble.
`;

// ============================================================
// GENERATE CHAT RESPONSE
// ============================================================

interface GenerateChatResponseInput {
  report: Partial<Analysis> | any;
  history: ChatMessage[];
  userQuestion: string;
  githubAccessToken?: string;
}

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<ChatResponsePayload> {
  const { promptText, retrievedSources } = await assembleChatContext(input);

  const fullPrompt = `${CHAT_SYSTEM_INSTRUCTION}\n\n${promptText}`;

  try {
    const geminiModel = getGeminiModel();
    const result = await generateWithRetry(() => geminiModel.generateContent(fullPrompt));
    const text = result.response.text();

    // Strip potential markdown code fences
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(clean);
      const validated = chatResponseSchema.safeParse(parsed);

      if (validated.success) {
        // Merge retrieved sources with model-identified sources
        const sourceMap = new Map<string, ChatSource>();
        for (const s of [...retrievedSources, ...validated.data.sources]) {
          const key = `${s.type}:${s.path || ""}:${s.title || ""}:${s.startLine || ""}`;
          if (!sourceMap.has(key)) {
            sourceMap.set(key, s);
          }
        }

        const followUps = validated.data.suggestedFollowUps.length > 0
          ? validated.data.suggestedFollowUps.slice(0, 3)
          : generateInitialRecommendedQuestions(input.report).slice(0, 3);

        return {
          answer: validated.data.answer,
          sources: Array.from(sourceMap.values()).slice(0, 4),
          suggestedFollowUps: followUps,
        };
      } else {
        console.warn("[CHAT SERVICE] Zod validation failed for Gemini response, falling back:", validated.error);
      }
    } catch (parseError) {
      console.warn("[CHAT SERVICE] JSON parsing failed, attempting text extraction:", parseError);
    }

    // Fallback if parsing failed but text is present
    return {
      answer: text.replace(/```json/g, "").replace(/```/g, "").trim(),
      sources: retrievedSources.slice(0, 3),
      suggestedFollowUps: generateInitialRecommendedQuestions(input.report).slice(0, 3),
    };
  } catch (error) {
    console.error("[CHAT SERVICE] Error generating chat response with Gemini:", error);

    // Graceful fallback response
    const fallbackFollowUps = generateInitialRecommendedQuestions(input.report).slice(0, 3);
    const topIssue = input.report?.dangerousIssues?.[0];

    return {
      answer: `I am currently unable to reach the AI analysis service to generate a live response.

Based on the saved analysis report for **${input.report?.repoName || "this repository"}**:
- Maturity Score: **${input.report?.maturityScore ?? "N/A"}/100**
${topIssue ? `- Top identified issue: **${topIssue.title}** (${topIssue.severity}) in \`${topIssue.file || "codebase"}\`\n  Recommendation: ${topIssue.recommendation}` : ""}

Please try asking again shortly.`,
      sources: retrievedSources.slice(0, 3),
      suggestedFollowUps: fallbackFollowUps,
    };
  }
}
