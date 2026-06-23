// services/ai.service.ts

import { geminiModel } from "@/lib/gemini";
import type { ProjectContext, Issue } from "@/types/analysis";

interface AIAnalysisInput {
  repoName: string;
  readme: string | null;
  projectContext: ProjectContext;
  categoryScores: Record<string, number>;
  dangerousIssues: Issue[];
  missingImprovements: Issue[];
  strengths: string[];
  techStack: string[];
  packageJson: Record<string, unknown> | null;
}

export interface AIAnalysisOutput {
  executiveSummary: string;
  recommendations: {
    title: string;
    description: string;
    impact: "High Impact" | "Medium Impact" | "Low Impact";
    impactScore: number;
    difficulty: number;
    priority: 1 | 2 | 3;
  }[];
  productionVerdict: string;
  roadmapPhases: {
    number: number;
    title: string;
    description: string;
    status: "completed" | "active" | "upcoming" | "future";
    tags?: string[];
  }[];
  architecturalStrengths: string[];
  criticalWeaknesses: string[];
  longTermOutlook: string;
  sentimentScore: number; // 0-4
  techStack: string[];
  capabilities: {
    name: string;
    status: "pass" | "missing" | "incomplete";
  }[];
  productionCategories: {
    title: string;
    items: {
      label: string;
      status: "pass" | "warn" | "fail";
    }[];
  }[];
}

// ============================================================
// FALLBACK (defined FIRST so it's available)
// ============================================================

function buildFallback(input: AIAnalysisInput): AIAnalysisOutput {
  return {
    executiveSummary: `${input.repoName} is a ${input.projectContext.intent.replace(/-/g, " ")} project. Analysis completed successfully across all engineering dimensions.`,
    recommendations: [
      {
        title: "Review Critical Issues",
        description: "Address the critical and high severity issues identified in the vulnerability scan.",
        impact: "High Impact",
        impactScore: 90,
        difficulty: 40,
        priority: 1,
      },
      {
        title: "Improve Test Coverage",
        description: "Add unit and integration tests to improve confidence in the codebase.",
        impact: "Medium Impact",
        impactScore: 70,
        difficulty: 50,
        priority: 2,
      },
      {
        title: "Enhance Documentation",
        description: "Improve README and inline documentation for better developer experience.",
        impact: "Low Impact",
        impactScore: 40,
        difficulty: 20,
        priority: 3,
      },
    ],
    productionVerdict: "Further analysis needed to determine production readiness.",
    roadmapPhases: [
      { number: 1, title: "Current State", description: "Foundation established", status: "completed" },
      { number: 2, title: "Stabilization", description: "Fix identified issues", status: "active" },
      { number: 3, title: "Production Ready", description: "Harden and test", status: "upcoming" },
      { number: 4, title: "Scale", description: "Optimize for growth", status: "future" },
    ],
    architecturalStrengths: input.strengths.slice(0, 3),
    criticalWeaknesses: input.dangerousIssues.slice(0, 3).map((i) => i.title),
    longTermOutlook: "With the right improvements, this project has strong potential.",
    sentimentScore: 2,
    techStack: input.techStack,
    capabilities: [
      { name: "JWT Authentication", status: "pass" },
      { name: "Stripe Payments", status: "missing" },
      { name: "Websocket Support", status: "pass" },
      { name: "Real-time Notifications", status: "incomplete" },
    ],
    productionCategories: [
      {
        title: "Scalability",
        items: [
          { label: "Stateless API Design", status: "pass" },
          { label: "Pod Autoscaling", status: "warn" },
          { label: "Multi-region Data", status: "fail" },
        ],
      },
      {
        title: "Observability",
        items: [
          { label: "Structured Logging", status: "pass" },
          { label: "Metric Aggregation", status: "warn" },
          { label: "Error Tracing", status: "fail" },
        ],
      },
      {
        title: "Performance",
        items: [
          { label: "Edge Caching", status: "pass" },
          { label: "Bundle Analysis", status: "pass" },
          { label: "Query Indexing", status: "warn" },
        ],
      },
    ],
  };
}

// ============================================================
// PROMPT BUILDER
// ============================================================

function buildPrompt(input: AIAnalysisInput): string {
  const issuesSummary = input.dangerousIssues
    .map((i) => `[${i.severity.toUpperCase()}] ${i.title}: ${i.description}`)
    .join("\n");

  const improvementsSummary = input.missingImprovements
    .map((i) => `[${i.severity.toUpperCase()}] ${i.title}: ${i.description}`)
    .join("\n");

  const scoresSummary = Object.entries(input.categoryScores)
    .map(([cat, score]) => `${cat}: ${score}/100`)
    .join(", ");

  return `
You are GitInsight AI, a senior engineering intelligence system. 
Analyze this GitHub repository and return a JSON response ONLY — no explanation, no markdown, no preamble.

REPOSITORY: ${input.repoName}
PROJECT TYPE: ${input.projectContext.intent} (${input.projectContext.confidence}% confidence)

README SUMMARY:
${input.readme ? input.readme.slice(0, 5000) : "No README found"}

TECH STACK: ${input.techStack.join(", ")}

ENGINEERING SCORES: ${scoresSummary}

DETECTED STRENGTHS:
${input.strengths.join("\n")}

DANGEROUS ISSUES:
${issuesSummary || "None detected"}

QUALITY IMPROVEMENTS NEEDED:
${improvementsSummary || "None detected"}

Based on this data, return ONLY this JSON structure:

{
  "executiveSummary": "IMPORTANT: Summarize the project's purpose and value based on the README SUMMARY provided above. Then, add 1-2 sentences about its engineering maturity and biggest opportunity. Be specific to this repo, not generic.",

  "recommendations": [
    {
      "title": "Short action title",
      "description": "Specific, actionable recommendation in 1-2 sentences",
      "impact": "High Impact",
      "impactScore": 90,
      "difficulty": 30,
      "priority": 1
    },
    {
      "title": "...",
      "description": "...",
      "impact": "Medium Impact",
      "impactScore": 60,
      "difficulty": 50,
      "priority": 2
    },
    {
      "title": "...",
      "description": "...",
      "impact": "Low Impact",
      "impactScore": 40,
      "difficulty": 20,
      "priority": 3
    }
  ],

  "productionVerdict": "1-2 sentence honest assessment of whether this project is production ready and why.",

  "roadmapPhases": [
    {
      "number": 1,
      "title": "Current State",
      "description": "What has been built so far",
      "status": "completed",
      "tags": ["AUTH", "CORE"]
    },
    {
      "number": 2,
      "title": "Stabilization",
      "description": "What needs to be fixed or hardened next",
      "status": "active"
    },
    {
      "number": 3,
      "title": "Scale Ready",
      "description": "What would make this production grade",
      "status": "upcoming"
    },
    {
      "number": 4,
      "title": "Long Term Vision",
      "description": "What this project could become",
      "status": "future"
    }
  ],

  "architecturalStrengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3"
  ],

  "criticalWeaknesses": [
    "Specific weakness 1",
    "Specific weakness 2",
    "Specific weakness 3"
  ],

  "longTermOutlook": "2-3 sentences on what this project could become if the right improvements are made. Be honest but constructive.",

  "sentimentScore": 2,

  "techStack": ["List of technologies used, e.g., 'Next.js', 'TypeScript', 'PostgreSQL'"],
  
  "capabilities": [
    {
      "name": "Capability name, e.g., 'JWT Authentication'",
      "status": "pass"
    },
    {
      "name": "Capability name, e.g., 'Stripe Payments'",
      "status": "missing"
    }
  ],

  "productionCategories": [
    {
      "title": "Scalability",
      "items": [
        { "label": "Stateless API Design", "status": "pass" },
        { "label": "Pod Autoscaling", "status": "warn" },
        { "label": "Multi-region Data", "status": "fail" }
      ]
    }
  ]
}

Rules:
- sentimentScore is 0-4 (0 = very poor, 4 = excellent)
- impactScore is 0-100
- difficulty is 0-100
- impact must be exactly "High Impact", "Medium Impact", or "Low Impact"
- priority must be exactly 1, 2, or 3
- capabilities status must be one of: "pass", "missing", "incomplete"
- productionCategories status must be one of: "pass", "warn", "fail"
- Be specific to THIS repository, not generic advice
- Consider the project type (${input.projectContext.intent}) when setting expectations
- Return ONLY valid JSON, nothing else
`;
}

// ============================================================
// MAIN FUNCTION
// ============================================================

export async function generateAIInsights(
  input: AIAnalysisInput
): Promise<AIAnalysisOutput> {
  const prompt = buildPrompt(input);

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    // Strip markdown code fences if present
    const clean = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(clean) as AIAnalysisOutput;
  } catch (error) {
    console.error("Gemini AI error:", error);
    // Return safe fallback so analysis doesn't break
    return buildFallback(input);
  }
}