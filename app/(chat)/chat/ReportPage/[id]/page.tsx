import {
  Code2,
  TestTube2,
  RefreshCw,
  Shield,
  Terminal,
  GitBranch,
  ListChecks,
  Rocket,
  Construction,
  Atom,
} from "lucide-react";

import ProjectHeader from "@/components/report/Projectheader";
import ExecutiveSummary from "@/components/report/Executivesummary";
import EngineeringDimensions from "@/components/report/Engineeringdimensions";
import TechStackAndCapabilities from "@/components/report/TechStackAndCapabilities";
import VulnerabilityFindings from "@/components/report/VulnerabilityFindings";
import StrategicRecommendations from "@/components/report/StrategicRecommendations";
import ProjectStructure from "@/components/report/ProjectStructure";
import QualityChecks from "@/components/report/QualityChecks";
import ProductionReadiness from "@/components/report/ProductionReadiness";
import EvolutionRoadmap from "@/components/report/EvolutionRoadmap";
import AIInsights from "@/components/report/AiInsights";
import ReportActions from "@/components/report/Reportactions";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ repoUrl?: string; repoName?: string; stars?: string; forks?: string; language?: string }>;
};

// ---------------------------------------------------------------------------
// Mock data — replace with real API call using id/repoUrl
// ---------------------------------------------------------------------------

const MOCK_ANALYSIS = {
  repoUrl: "https://github.com/acme/core-engine",
  repoName: "acme/core-engine",
  maturityScore: 78,
  level: "Production Candidate",
  isProductionReady: true,
  analyzedAt: new Date("2026-05-30T09:00:00Z"),
  projectContext: {
    intent: "production-saas" as const,
    confidence: 87,
    signals: ["Dependency: sentry", "File: .github/workflows"],
    expectedFeatures: ["Testing", "Security", "CI/CD"],
    notRequiredFeatures: ["Kubernetes"],
  },
  dangerousIssues: [
    {
      category: "Security",
      severity: "critical" as const,
      title: "Redis Over-exposure",
      description:
        "Connection pooling is unbounded in the cluster-sync module, leading to potential OOM on spikes.",
      isDangerous: true,
      impact: "Out of memory on load spikes",
      recommendation: "Add maxConnections limit to Redis pool config",
      evidence: [],
    },
    {
      category: "Security",
      severity: "medium" as const,
      title: "Zod Schema Tightening",
      description:
        "Input validation for task payloads lacks strict numeric range checks for concurrency fields.",
      isDangerous: false,
      impact: "Invalid data can reach processing layer",
      recommendation: "Add .min() .max() constraints to concurrency fields",
      evidence: [],
    },
    {
      category: "Dependencies",
      severity: "low" as const,
      title: "Stale Dependencies",
      description:
        "Package `fast-deep-equal` is 2 major versions behind. Non-breaking for current logic.",
      isDangerous: false,
      impact: "Missing perf improvements",
      recommendation: "Run npm update fast-deep-equal",
      evidence: [],
    },
  ],
  missingImprovements: [],
  strengths: [
    "Exceptional domain isolation in the Lib layer",
    "Modern tech stack with zero legacy baggage",
    "Semantic Git commit history",
  ],
  criticalBlockers: ["Fix unbounded Redis connection pool"],
  nextSteps: [
    "Add OpenTelemetry instrumentation",
    "Wrap DB calls in circuit breakers",
    "Integrate k6 load tests into CI",
  ],
  categoryScores: {},
  aiInsights: "",
};

// ---------------------------------------------------------------------------
// Derived component data
// ---------------------------------------------------------------------------

const dimensions = [
  { label: "Structure", icon: GitBranch, score: 88 },
  { label: "Completeness", icon: ListChecks, score: 92 },
  { label: "Readiness", icon: Rocket, score: 65 },
  { label: "Maintainability", icon: Construction, score: 74 },
  { label: "Security", icon: Shield, score: 81 },
  { label: "Testing", icon: Atom, score: 58 },
];

const techStack = [
  "Next.js 14",
  "TypeScript 5.4",
  "PostgreSQL",
  "Tailwind CSS",
  "Redis",
  "Zod",
  "Prisma",
  "Docker",
  "K8s",
];

const capabilities = [
  { name: "JWT Authentication", status: "pass" as const },
  { name: "Stripe Payments", status: "missing" as const },
  { name: "Websocket Support", status: "pass" as const },
  { name: "Real-time Notifications", status: "incomplete" as const },
];

const recommendations = [
  {
    title: "Implement Telemetry",
    description:
      "Add OpenTelemetry instrumentation to track task latency across distributed nodes for real-time visibility.",
    impact: "High Impact" as const,
    impactScore: 90,
    difficulty: 40,
    priority: 1 as const,
  },
  {
    title: "Circuit Breakers",
    description:
      "Wrap database calls in circuit breakers to prevent cascading failures during DB locks and high-latency spikes.",
    impact: "High Impact" as const,
    impactScore: 80,
    difficulty: 60,
    priority: 2 as const,
  },
  {
    title: "Load Testing CI",
    description:
      "Integrate k6 performance tests into GitHub Actions to monitor potential regressions in system throughput.",
    impact: "Medium Impact" as const,
    impactScore: 60,
    difficulty: 35,
    priority: 3 as const,
  },
];

const fileTree = [
  {
    name: "src",
    path: "src",
    type: "folder" as const,
    children: [
      {
        name: "app",
        path: "src/app",
        type: "folder" as const,
        comment: "Route handlers",
        children: [
          {
            name: "layout.tsx",
            path: "src/app/layout.tsx",
            type: "file" as const,
            status: "clean" as const,
          },
          {
            name: "page.tsx",
            path: "src/app/page.tsx",
            type: "file" as const,
            status: "warning" as const,
          },
        ],
      },
      {
        name: "core",
        path: "src/core",
        type: "folder" as const,
        comment: "Engine logic",
        children: [
          {
            name: "scheduler.ts",
            path: "src/core/scheduler.ts",
            type: "file" as const,
            status: "none" as const,
          },
          {
            name: "executor.ts",
            path: "src/core/executor.ts",
            type: "file" as const,
            status: "warning" as const,
            annotation: "1,243 lines — too large",
          },
        ],
      },
      {
        name: "shared",
        path: "src/shared",
        type: "folder" as const,
        children: [],
      },
    ],
  },
  {
    name: "package.json",
    path: "package.json",
    type: "file" as const,
    status: "none" as const,
  },
  {
    name: "docker-compose.yml",
    path: "docker-compose.yml",
    type: "file" as const,
    status: "none" as const,
  },
];

const qualityChecks = [
  {
    name: "TypeScript Strict Mode",
    icon: Code2,
    status: "passed" as const,
    detail: "Enabled across entire codebase",
  },
  {
    name: "Unit Test Coverage",
    icon: TestTube2,
    status: "partial" as const,
    detail: "58% total coverage (Target: 80%)",
  },
  {
    name: "CI/CD Pipeline",
    icon: RefreshCw,
    status: "passed" as const,
    detail: "GitHub Actions configured",
  },
  {
    name: "Secrets Scan",
    icon: Shield,
    status: "passed" as const,
    detail: "No raw secrets found in commits",
  },
  {
    name: "ESLint Compliance",
    icon: Terminal,
    status: "missing" as const,
    detail: "12 warning(s) detected",
  },
];

const productionCategories = [
  {
    title: "Scalability",
    items: [
      { label: "Stateless API Design", status: "pass" as const },
      { label: "Pod Autoscaling", status: "pass" as const },
      { label: "Multi-region Data", status: "fail" as const },
    ],
  },
  {
    title: "Observability",
    items: [
      { label: "Structured Logging", status: "pass" as const },
      { label: "Metric Aggregation", status: "warn" as const },
      { label: "Error Tracing", status: "fail" as const },
    ],
  },
  {
    title: "Performance",
    items: [
      { label: "Edge Caching", status: "pass" as const },
      { label: "Bundle Analysis", status: "pass" as const },
      { label: "Query Indexing", status: "warn" as const },
    ],
  },
];

const roadmapPhases = [
  {
    number: 1,
    title: "Foundational MVP",
    description:
      "Core orchestration, basic task dispatch, and Redis transport implementation completed.",
    status: "completed" as const,
    tags: ["AUTH", "ENGINE"],
  },
  {
    number: 2,
    title: "Enterprise Scaling",
    description:
      "Telemetry, observability, and robust error handling patterns for multi-node deployments.",
    status: "active" as const,
  },
  {
    number: 3,
    title: "Global Resilience",
    description:
      "Multi-region deployment architecture and dynamic node discovery for global availability.",
    status: "upcoming" as const,
  },
  {
    number: 4,
    title: "AI Optimization",
    description:
      "Dynamic resource allocation based on predicted workload patterns using local inference models.",
    status: "future" as const,
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ReportPage({ params, searchParams }: ReportPageProps) {
  const { id } = await params;
  const { repoUrl, repoName, stars, forks, language } = await searchParams;

  // TODO: Replace with real data fetch once analysis service + DB is wired
  // const analysis = await getAnalysisById(id);
  // console.log("Report for:", id, repoUrl, repoName, stars, forks, language);

  const analysis = {
    ...MOCK_ANALYSIS,
    repoUrl: repoUrl || MOCK_ANALYSIS.repoUrl,
    repoName: repoName || MOCK_ANALYSIS.repoName,
    metadata: {
      stars: stars ? parseInt(stars, 10) : undefined,
      forks: forks ? parseInt(forks, 10) : undefined,
      language: language || undefined,
    },
  };

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <section className="hide-scrollbar flex-1 overflow-y-scroll bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-10 pb-8">

          {/* 1. Project Header */}
          <ProjectHeader analysis={analysis} />

          {/* Repo Metadata Display */}
          {(analysis.metadata?.stars !== undefined || analysis.metadata?.forks !== undefined || analysis.metadata?.language) && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {analysis.metadata?.stars !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-400">⭐ Stars:</span>
                      <span className="font-semibold text-white">{analysis.metadata.stars.toLocaleString()}</span>
                    </div>
                  )}
                  {analysis.metadata?.forks !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-400">🍴 Forks:</span>
                      <span className="font-semibold text-white">{analysis.metadata.forks.toLocaleString()}</span>
                    </div>
                  )}
                  {analysis.metadata?.language && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-zinc-400">Language:</span>
                      <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-white font-medium">{analysis.metadata.language}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 2. Executive AI Summary */}
          <ExecutiveSummary
            repoName={analysis.repoName}
            summary={analysis.aiInsights}
          />

          {/* 3. Engineering Dimensions */}
          <EngineeringDimensions
            dimensions={dimensions}
            totalFilesAnalyzed={42}
          />

          {/* 4. Tech Stack + Core Capabilities */}
          <TechStackAndCapabilities
            techStack={techStack}
            capabilities={capabilities}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 5. Vulnerability & Audit Findings */}
          <VulnerabilityFindings issues={analysis.dangerousIssues} />

          {/* 6. Strategic Recommendations */}
          <StrategicRecommendations recommendations={recommendations} />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 7. Project Structure */}
          <ProjectStructure
            fileTree={fileTree}
            stats={{
              logicSeparation: 84,
              unusedModules: 12,
              bundleSize: "4.2MB",
            }}
            healthWarning={{
              folder: "components",
              message:
                "42 files with avg 850 lines. High circular dependency between ChartCard.tsx and DataParser.ts.",
            }}
          />

          {/* 8 & 9. Quality Gateways + Engineering Checks */}
          <QualityChecks checks={qualityChecks} />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 10. Production Readiness */}
          <ProductionReadiness
            overallScore={68}
            categories={productionCategories}
            verdict="The architecture is solid for MVP, but lacks the necessary observability for a production environment."
          />

          {/* 11. Evolution Roadmap */}
          <EvolutionRoadmap phases={roadmapPhases} />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 12. AI Engineering Insights */}
          <AIInsights
            strengths={analysis.strengths}
            weaknesses={[
              "Large component files (executor.ts is becoming a monolith)",
              "Proprietary logic leaking into UI components",
              "High cyclomatic complexity in Parser module",
            ]}
            longTermAdvice="This codebase is built for longevity. If you fix the telemetry gap and split the executor service, it will easily support 100M+ tasks/day with minimal overhead."
            sentimentScore={2}
          />

          {/* Footer Actions — client component handles PDF + share */}
          <ReportActions
            repoName={analysis.repoName}
            analyzedAt={analysis.analyzedAt}
          />
        </div>
      </section>
    </>
  );
}