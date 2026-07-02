import { fetchRepositoryWithCode } from "./github-service";
import { detectProjectIntent } from "./projectIntent-service";
import { analyzeSecurityIssues } from "./securityAnalyser-service";
import {
  analyzeArchitectureIssues,
  type ArchitectureAnalysisResult,
} from "./architecturalAnalyser-service";
import { analyzeCompleteness } from "./CompletenessAnalyser-service";
import { analyzeMaintainability } from "./MaintainabilityAnalyser-service";
import { analyzeReadiness } from "./ReadinessAnalyser-service";
import { analyzeTesting } from "./testingAnalyser-service";
import { generateAIInsights } from "./ai-service";
import type {
  Analysis,
  Issue,
  ProjectContext,
  IssueSeverity,
  AIInsightsData,
} from "@/types/analysis";
import type { GitHubRepo, FileTreeItem } from "@/types/github";

// ============================================================
// SCORING WEIGHTS
// ============================================================

const INTENT_WEIGHTS: Record<string, Record<string, number>> = {
  portfolio: {
    security: 0.2,
    architecture: 0.25,
    testing: 0.1,
    completeness: 0.15,
    maintainability: 0.2,
    readiness: 0.1,
  },
  learning: {
    security: 0.15,
    architecture: 0.3,
    testing: 0.15,
    completeness: 0.12,
    maintainability: 0.18,
    readiness: 0.1,
  },
  "open-source-library": {
    security: 0.2,
    architecture: 0.28,
    testing: 0.3,
    completeness: 0.12,
    maintainability: 0.05,
    readiness: 0.05,
  },
  mvp: {
    security: 0.25,
    architecture: 0.25,
    testing: 0.2,
    completeness: 0.1,
    maintainability: 0.12,
    readiness: 0.08,
  },
  startup: {
    security: 0.3,
    architecture: 0.25,
    testing: 0.2,
    completeness: 0.08,
    maintainability: 0.1,
    readiness: 0.07,
  },
  "production-saas": {
    security: 0.35,
    architecture: 0.25,
    testing: 0.2,
    completeness: 0.05,
    maintainability: 0.08,
    readiness: 0.07,
  },
  enterprise: {
    security: 0.35,
    architecture: 0.25,
    testing: 0.18,
    completeness: 0.08,
    maintainability: 0.07,
    readiness: 0.07,
  },
};

// ============================================================
// MATURITY LEVELS
// ============================================================

const MATURITY_LEVELS: Array<{
  min: number;
  max: number;
  level: string;
  production: boolean;
}> = [
  { min: 0, max: 25, level: "Prototype", production: false },
  { min: 26, max: 40, level: "Early Stage", production: false },
  { min: 41, max: 55, level: "Developing", production: false },
  { min: 56, max: 70, level: "Production Candidate", production: false },
  { min: 71, max: 85, level: "Production", production: true },
  { min: 86, max: 100, level: "Enterprise Ready", production: true },
];

// ============================================================
// TYPES
// ============================================================

interface CategoryScore {
  score: number;
  weight: number;
  issues: Issue[];
  metrics?: Record<string, unknown>;
}

interface AnalysisMetadata {
  analysisTime: Date;
  totalIssuesFound: number;
  issuesByCategory: Record<string, number>;
  issuesBySeverity: Record<IssueSeverity, number>;
  codeMetrics: {
    totalFiles: number;
    largeFiles: number;
    averageFileSize: number;
  };
}

interface RepositoryData {
  readme: string | null;
  packageJson: Record<string, unknown>;
  fileTree: FileTreeItem[];
  codeFiles: Record<string, string>;
  metadata: GitHubRepo;
}

// ============================================================
// TECH STACK EXTRACTION
// ============================================================

function extractTechStack(packageJson: Record<string, unknown> | null): string[] {
  if (!packageJson) return [];

  const deps = {
    ...((packageJson.dependencies as Record<string, string>) ?? {}),
    ...((packageJson.devDependencies as Record<string, string>) ?? {}),
  };

  const KNOWN_TECH: Record<string, string> = {
    next: "Next.js",
    react: "React",
    vue: "Vue",
    nuxt: "Nuxt",
    svelte: "Svelte",
    typescript: "TypeScript",
    tailwindcss: "Tailwind CSS",
    prisma: "Prisma",
    "@prisma/client": "Prisma",
    supabase: "Supabase",
    "@supabase/supabase-js": "Supabase",
    firebase: "Firebase",
    mongoose: "MongoDB",
    pg: "PostgreSQL",
    mysql2: "MySQL",
    redis: "Redis",
    stripe: "@stripe/stripe-js",
    "@stripe/stripe-js": "Stripe",
    clerk: "Clerk",
    "@clerk/nextjs": "Clerk",
    "next-auth": "NextAuth",
    zod: "Zod",
    axios: "Axios",
    "@tanstack/react-query": "TanStack Query",
    zustand: "Zustand",
    redux: "Redux",
    "@reduxjs/toolkit": "Redux Toolkit",
    jest: "Jest",
    vitest: "Vitest",
    playwright: "Playwright",
    cypress: "Cypress",
    docker: "Docker",
    express: "Express",
    fastify: "Fastify",
    hono: "Hono",
    drizzle: "Drizzle ORM",
    "drizzle-orm": "Drizzle ORM",
    "@google/generative-ai": "Gemini AI",
    "@anthropic-ai/sdk": "Claude AI",
    openai: "OpenAI",
  };

  const detected: string[] = [];

  Object.keys(deps).forEach((dep) => {
    const label = KNOWN_TECH[dep];
    if (label && !detected.includes(label)) {
      detected.push(label);
    }
  });

  return detected;
}

// ============================================================
// MAIN ANALYSIS ORCHESTRATOR
// ============================================================

export async function analyzeRepository(repoUrl: string): Promise<Analysis> {
  console.log("Starting analyzeRepository for URL:", repoUrl);

  try {
    // ── STEP 1: Fetch repository data ──────────────────────────
    console.log("📥 Fetching repository data...");
    const repoData = await fetchRepositoryWithCode(repoUrl);
    console.log("✅ Fetched:", repoData.metadata?.full_name);
    console.log("✅ Code files:", Object.keys(repoData.codeFiles).length);

    // ── STEP 2: Detect project intent ──────────────────────────
    console.log("🎯 Detecting project intent...");
    const projectContext = detectProjectIntent({
      readme: repoData.readme,
      packageJson: repoData.packageJson,
      fileTree: repoData.fileTree,
      metadata: repoData.metadata,
    });
    console.log(`   ✓ Intent: ${projectContext.intent} (${projectContext.confidence}% confidence)`);

    // ── STEP 3: Run all analyzers in parallel ──────────────────
    console.log("🔍 Running comprehensive analysis...");
    const [
      securityResult,
      architectureResult,
      testingResult,
      completenessResult,
      maintainabilityResult,
      readinessResult,
    ] = await Promise.all([
      Promise.resolve(analyzeSecurityIssues(repoData.codeFiles, repoData.packageJson)),
      Promise.resolve(analyzeArchitectureIssues(repoData.codeFiles, repoData.fileTree)),
      Promise.resolve(analyzeTesting(repoData.fileTree)),
      Promise.resolve(analyzeCompleteness(repoData.codeFiles, repoData.fileTree, repoData.packageJson)),
      Promise.resolve(analyzeMaintainability(repoData.codeFiles, repoData.fileTree, repoData.packageJson)),
      Promise.resolve(analyzeReadiness(repoData.codeFiles, repoData.fileTree, repoData.packageJson, repoData.metadata)),
    ]);

    console.log(`   ✓ Security: ${securityResult.score}/100 (${securityResult.criticalCount} critical)`);
    console.log(`   ✓ Architecture: ${architectureResult.score}/100`);
    console.log(`   ✓ Testing: ${testingResult.score}/100`);

    // ── STEP 4: Aggregate all issues ───────────────────────────
    const allIssues: Issue[] = [
      ...securityResult.issues,
      ...architectureResult.issues,
      ...testingResult.issues,
      ...completenessResult.issues,
      ...maintainabilityResult.issues,
      ...readinessResult.issues,
    ];

    const dangerousIssues = allIssues.filter((i) => i.isDangerous);
    const missingImprovements = allIssues.filter((i) => !i.isDangerous);

    console.log(`   ✓ Found ${dangerousIssues.length} dangerous issues`);
    console.log(`   ✓ Found ${missingImprovements.length} quality improvements`);

    // ── STEP 5: Build category scores ──────────────────────────
    const weights = getWeightsForIntent(projectContext.intent);

    const categoryScores: Record<string, CategoryScore> = {
      security: {
        score: securityResult.score,
        weight: weights.security,
        issues: securityResult.issues,
        metrics: {
          critical: securityResult.criticalCount,
          high: securityResult.highCount,
          medium: securityResult.mediumCount,
          low: securityResult.lowCount,
        },
      },
      architecture: {
        score: architectureResult.score,
        weight: weights.architecture,
        issues: architectureResult.issues,
        metrics: {
          largeFiles: architectureResult.codeMetrics.largeFiles,
          averageFileSize: architectureResult.codeMetrics.averageFileSize,
          fileCount: architectureResult.codeMetrics.fileCount,
          folderStructure: architectureResult.folderStructure,
          hasProperLayering: architectureResult.hasProperLayering,
          circularDependencies: architectureResult.circularDependencies.length,
        },
      },
      testing: {
        score: testingResult.score,
        weight: weights.testing,
        issues: testingResult.issues,
        metrics: {
          hasTestFiles: testingResult.hasTestFiles,
          testFrameworks: testingResult.testFrameworks,
          testingTypes: testingResult.testingTypes,
          hasCoverageConfig: testingResult.hasCoverageConfig,
          hasCIIntegration: testingResult.hasCIIntegration,
          testFileDensity: testingResult.testFileDensity,
        },
      },
      completeness: {
        score: completenessResult.score,
        weight: weights.completeness || 0.12,
        issues: completenessResult.issues,
        metrics: completenessResult.completenessMetrics,
      },
      readiness: {
        score: readinessResult.score,
        weight: weights.readiness || 0.15,
        issues: readinessResult.issues,
        metrics: readinessResult.readinessMetrics,
      },
      maintainability: {
        score: maintainabilityResult.score,
        weight: weights.maintainability || 0.12,
        issues: maintainabilityResult.issues,
        metrics: maintainabilityResult.maintainabilityMetrics,
      },
    };

    // ── STEP 6: Calculate maturity score ───────────────────────
    const maturityScore = calculateWeightedScore(
      {
        security: categoryScores.security.score,
        architecture: categoryScores.architecture.score,
        testing: categoryScores.testing.score,
        completeness: categoryScores.completeness.score,
        readiness: categoryScores.readiness.score,
        maintainability: categoryScores.maintainability.score,
      },
      weights,
    );

    const { level, production } = getMaturityLevel(maturityScore);
    console.log(`✅ Overall Score: ${Math.round(maturityScore)}/100 - ${level}`);

    // ── STEP 7: Identify strengths ─────────────────────────────
    const strengths = identifyStrengths(repoData, categoryScores, projectContext);

    // ── STEP 8: Generate recommendations ───────────────────────
    const criticalBlockers = generateCriticalBlockers(dangerousIssues);
    const nextSteps = generateNextSteps(missingImprovements, projectContext, categoryScores);

    // ── STEP 9: Extract tech stack ─────────────────────────────
    const techStack = extractTechStack(repoData.packageJson);

    // ── STEP 10: Generate AI insights ─────────────────────────
    // NOTE: This runs AFTER all scores and strengths are ready
    console.log("🤖 Generating AI insights...");

    let aiInsights: AIInsightsData | null = null;

    try {
      const aiOutput = await generateAIInsights({
        repoName: repoData.metadata.full_name,
        readme: repoData.readme,
        projectContext,
        categoryScores: {
          security: categoryScores.security.score,
          architecture: categoryScores.architecture.score,
          testing: categoryScores.testing.score,
          completeness: categoryScores.completeness.score,
          maintainability: categoryScores.maintainability.score,
          readiness: categoryScores.readiness.score,
        },
        dangerousIssues,
        missingImprovements,
        strengths,
        techStack,
        packageJson: repoData.packageJson,
      });

      aiInsights = {
        ...aiOutput,
        executiveSummary: aiOutput.executiveSummary,
        recommendations: aiOutput.recommendations,
        productionVerdict: aiOutput.productionVerdict,
        roadmapPhases: aiOutput.roadmapPhases,
        architecturalStrengths: aiOutput.architecturalStrengths,
        criticalWeaknesses: aiOutput.criticalWeaknesses,
        longTermOutlook: aiOutput.longTermOutlook,
        sentimentScore: aiOutput.sentimentScore,
      };

      console.log("✅ AI insights generated successfully");
    } catch (aiError) {
      // AI failure should NOT break the whole analysis
      console.warn("⚠️ AI insights failed, continuing without:", aiError);
      aiInsights = null;
    }

    // ── STEP 11: Build metadata ────────────────────────────────
    buildAnalysisMetadata(allIssues, repoData, architectureResult);

    // ── STEP 12: Build final analysis object ───────────────────
    const analysis: Analysis = {
      repoUrl,
      repoName: repoData.metadata.full_name,
      maturityScore: Math.round(maturityScore),
      level,
      isProductionReady: production && dangerousIssues.length === 0,
      projectContext,
      categoryScores,
      dangerousIssues: sortIssuesByPriority(dangerousIssues),
      missingImprovements: sortIssuesByPriority(missingImprovements),
      strengths,
      criticalBlockers,
      nextSteps,
      analyzedAt: new Date(),
      aiInsights, // null if Gemini failed — UI handles this gracefully
      techStack,
      fileTreeStructure: repoData.fileTree,
      selectedFilesCount: Object.keys(repoData.codeFiles).length,
    };

    console.log(`\n${generateAnalysisSummary(analysis)}`);

    return analysis;
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    throw new Error(
      `Repository analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// ============================================================
// HELPERS
// ============================================================

function getWeightsForIntent(intent: string): Record<string, number> {
  return INTENT_WEIGHTS[intent] ?? INTENT_WEIGHTS["startup"];
}

function calculateWeightedScore(
  scores: Record<string, number>,
  weights: Record<string, number>,
): number {
  let totalScore = 0;
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  if (totalWeight === 0) {
    // Avoid division by zero if no weights are provided.
    // Fallback to a simple average.
    const scoreValues = Object.values(scores);
    return scoreValues.length > 0
      ? scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length
      : 0;
  }
  
  Object.entries(scores).forEach(([category, score]) => {
    const weight = weights[category] ?? 0;
    // Normalize the weight against the total sum of weights for the intent
    const normalizedWeight = weight / totalWeight;
    totalScore += score * normalizedWeight;
  });

  return totalScore;
}

function getMaturityLevel(score: number): { level: string; production: boolean } {
  return (
    MATURITY_LEVELS.find((m) => score >= m.min && score <= m.max) ?? {
      level: "Unknown",
      production: false,
    }
  );
}

function buildAnalysisMetadata(
  issues: Issue[],
  repoData: RepositoryData,
  architectureResult: ArchitectureAnalysisResult,
): AnalysisMetadata {
  const issuesBySeverity: Record<IssueSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const issuesByCategory: Record<string, number> = {};

  issues.forEach((issue) => {
    issuesBySeverity[issue.severity]++;
    issuesByCategory[issue.category] = (issuesByCategory[issue.category] ?? 0) + 1;
  });

  return {
    analysisTime: new Date(),
    totalIssuesFound: issues.length,
    issuesByCategory,
    issuesBySeverity,
    codeMetrics: {
      totalFiles: architectureResult.codeMetrics.fileCount,
      largeFiles: architectureResult.codeMetrics.largeFiles,
      averageFileSize: architectureResult.codeMetrics.averageFileSize,
    },
  };
}

function identifyStrengths(
  repoData: RepositoryData,
  categoryScores: Record<string, CategoryScore>,
  projectContext: ProjectContext,
): string[] {
  const strengths: string[] = [];

  Object.entries(categoryScores).forEach(([category, data]) => {
    if (data.score >= 85) {
      strengths.push(`Excellent ${category} practices (${data.score}/100)`);
    } else if (data.score >= 75) {
      strengths.push(`Strong ${category} implementation (${data.score}/100)`);
    }
  });

  if (categoryScores.architecture.metrics?.hasProperLayering) {
    strengths.push("Well-structured codebase with proper separation of concerns");
  }

  if (categoryScores.architecture.metrics?.circularDependencies === 0) {
    strengths.push("Clean module structure with zero circular dependencies");
  }

  if (categoryScores.testing.metrics?.hasTestFiles) {
    const frameworks = categoryScores.testing.metrics?.testFrameworks;
    if (Array.isArray(frameworks) && frameworks.length > 1) {
      strengths.push(`Multiple testing frameworks (${(frameworks as string[]).join(", ")})`);
    }

    const testingTypes = categoryScores.testing.metrics?.testingTypes as Record<string, boolean>;
    if (testingTypes?.unit && testingTypes?.e2e) {
      strengths.push("Comprehensive multi-type testing (unit, integration, E2E)");
    }
  }

  if (categoryScores.testing.metrics?.hasCIIntegration) {
    strengths.push("Automated testing integrated in CI/CD pipeline");
  }

  if (repoData.metadata.homepage) {
    strengths.push("Active deployment and live service");
  }

  const meta = repoData.metadata as unknown as Record<string, unknown>;
  if ((meta.watchers_count as number) > 50 || (meta.stargazers_count as number) > 50) {
    strengths.push("Strong community engagement and reputation");
  }

  if (repoData.readme && repoData.readme.length > 1000) {
    strengths.push("Comprehensive and detailed documentation");
  }

  const devDeps = (repoData.packageJson as Record<string, unknown>).devDependencies as Record<string, unknown>;
  if (devDeps?.typescript) {
    strengths.push("Type-safe with TypeScript throughout the codebase");
  }

  if (projectContext.intent === "production-saas" && categoryScores.security.score >= 80) {
    strengths.push("Production-grade security practices in place");
  }

  if (projectContext.intent === "enterprise" && categoryScores.security.score >= 85) {
    strengths.push("Enterprise-level security and compliance standards");
  }

  return strengths.slice(0, 10);
}

function generateCriticalBlockers(dangerousIssues: Issue[]): string[] {
  return dangerousIssues
    .filter((i) => i.severity === "critical")
    .slice(0, 5)
    .map((i) => `${i.title} - ${i.impact}`);
}

function generateNextSteps(
  issues: Issue[],
  projectContext: ProjectContext,
  categoryScores: Record<string, CategoryScore>,
): string[] {
  const steps: string[] = [];

  const criticalSecurity = issues.filter(
    (i) => i.category === "Security" && i.severity === "critical",
  );
  if (criticalSecurity.length > 0) {
    steps.push(`🔒 Fix ${criticalSecurity.length} critical security issue(s)`);
    criticalSecurity.slice(0, 1).forEach((i) => steps.push(`   → ${i.recommendation}`));
  }

  const highArchitecture = issues.filter(
    (i) => i.category === "Architecture" && i.severity === "high",
  );
  if (highArchitecture.length > 0) {
    steps.push(`🏗️  Resolve ${highArchitecture.length} architecture issue(s)`);
    highArchitecture.slice(0, 1).forEach((i) => steps.push(`   → ${i.recommendation}`));
  }

  if (categoryScores.testing.score < 70) {
    const testingIssue = categoryScores.testing.issues[0];
    if (testingIssue) {
      steps.push(`🧪 Improve testing coverage`);
      steps.push(`   → ${testingIssue.recommendation}`);
    }
  }

  if (projectContext.intent === "production-saas") {
    const circularDeps = (categoryScores.architecture.metrics?.circularDependencies ?? 0) as number;
    if (circularDeps > 0) {
      steps.push(`⚠️  Remove ${circularDeps} circular dependencies`);
    }
    if (!categoryScores.testing.metrics?.hasCIIntegration) {
      steps.push(`✅ Integrate tests into CI/CD pipeline`);
    }
  }

  if (projectContext.intent === "enterprise") {
    steps.push(`📋 Implement comprehensive audit logging`);
    steps.push(`🔐 Configure enterprise-grade security hardening`);
  }

  issues
    .filter((i) => i.severity === "medium")
    .slice(0, 2)
    .forEach((i) => steps.push(`   → ${i.recommendation}`));

  return steps.slice(0, 12);
}

function sortIssuesByPriority(issues: Issue[]): Issue[] {
  const order: Record<IssueSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  return [...issues].sort((a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4));
}

export async function getAnalysisById(
  id: string,
  repoUrl: string,
): Promise<Analysis> {
  // TODO: Replace this with actual database fetch logic.
  // This is a placeholder to simulate fetching an analysis by ID.
  console.log(`Fetching analysis for ID: ${id} and URL: ${repoUrl}`);

  // For now, we'll just call the analyzeRepository function
  return analyzeRepository(repoUrl);
}

export function generateAnalysisSummary(analysis: Analysis): string {
  const divider = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";

  return `
📊 REPOSITORY ANALYSIS SUMMARY
${divider}
📍 Repository: ${analysis.repoName}
🎯 Project Type: ${analysis.projectContext.intent} (${analysis.projectContext.confidence}% confidence)
📈 Maturity Score: ${analysis.maturityScore}/100 - ${analysis.level}
✅ Production Ready: ${analysis.isProductionReady ? "✓ Yes" : "✗ No"}
🤖 AI Insights: ${analysis.aiInsights ? "✓ Generated" : "✗ Unavailable"}

📋 CATEGORY SCORES:
   🔒 Security: ${analysis.categoryScores.security?.score}/100
   🏗️  Architecture: ${analysis.categoryScores.architecture?.score}/100
   🧪 Testing: ${analysis.categoryScores.testing?.score}/100

⚠️  ISSUES FOUND:
   Dangerous: ${analysis.dangerousIssues?.length ?? 0}
   Improvements: ${analysis.missingImprovements?.length ?? 0}

🌟 TOP STRENGTHS:
${analysis.strengths.slice(0, 3).map((s) => `   ✓ ${s}`).join("\n")}

🚨 CRITICAL BLOCKERS:
${analysis.criticalBlockers.length > 0
  ? analysis.criticalBlockers.slice(0, 3).map((b) => `   ⚠️  ${b}`).join("\n")
  : "   None"}

${divider}
`;
}

export type { CategoryScore, AnalysisMetadata, RepositoryData };