"use client";

import {
  Code2,
  TestTube2,
  RefreshCw,
  Shield,
  Terminal,
  Download,
  Share2,
  GitBranch,
  ListChecks,
  Rocket,
  Construction,
  Atom,
} from "lucide-react";
import html2pdf from 'html2pdf.js';
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

// ---------------------------------------------------------------------------
// Mock data — replace with real analysis data from your API
// ---------------------------------------------------------------------------

const MOCK_ANALYSIS = {
  repoUrl: "https://github.com/acme/core-engine",
  repoName: "acme/core-engine",
  maturityScore: 78,
  level: "Production Candidate",
  isProductionReady: true,
  analyzedAt: new Date('2026-05-30T09:00:00Z'),
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

export default function ReportPage() {
  const analysis = MOCK_ANALYSIS;

  // Derived data for components
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
      type: "folder" as const,
      children: [
        {
          name: "app",
          type: "folder" as const,
          comment: "Route handlers",
          children: [
            { name: "layout.tsx", type: "file" as const, status: "clean" as const },
            { name: "page.tsx", type: "file" as const, status: "messy" as const },
          ],
        },
        {
          name: "core",
          type: "folder" as const,
          comment: "Engine logic",
          children: [
            { name: "scheduler.ts", type: "file" as const, status: "none" as const },
            { name: "executor.ts", type: "file" as const, status: "warning" as const },
          ],
        },
        { name: "shared", type: "folder" as const, children: [] },
      ],
    },
    { name: "package.json", type: "file" as const, status: "none" as const },
    { name: "docker-compose.yml", type: "file" as const, status: "none" as const },
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

  const handleExportPDF = () => {
    const element = document.querySelector('section');
    if (element) {
      const options = {
        margin: 10,
        filename: `${analysis.repoName}-report.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' as const }
      };
      html2pdf().set(options).from(element).save();
    }
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar while maintaining scroll functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;      /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;              /* Chrome, Safari and Opera */
        }
      `}</style>

      <section className="hide-scrollbar flex-1 overflow-y-scroll bg-zinc-950">
        {/* Content wrapper with padding and spacing */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-10 pb-4">
          
          {/* 1. Project Header */}
          <div className="animate-in fade-in slide-in-from-top duration-500">
            <ProjectHeader analysis={analysis} />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 2. Executive AI Summary */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:100ms]">
            <ExecutiveSummary
              repoName={analysis.repoName}
              summary={analysis.aiInsights}
            />
          </div>

          {/* 3. Engineering Dimensions */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:200ms]">
            <EngineeringDimensions
              dimensions={dimensions}
              totalFilesAnalyzed={42}
            />
          </div>

          {/* 4. Tech Stack + Core Capabilities */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:300ms]">
            <TechStackAndCapabilities
              techStack={techStack}
              capabilities={capabilities}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 5. Vulnerability & Audit Findings */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:400ms]">
            <VulnerabilityFindings issues={analysis.dangerousIssues} />
          </div>

          {/* 6. Strategic Recommendations */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:500ms]">
            <StrategicRecommendations recommendations={recommendations} />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 7. Project Structure */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:600ms]">
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
                  "42 files with avg 850 lines. High circular dependency correlation between ChartCard.tsx and DataParser.ts.",
              }}
            />
          </div>

          {/* 8 & 9. Quality Gateways + Engineering Checks */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:700ms]">
            <QualityChecks checks={qualityChecks} />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 10. Production Readiness */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:800ms]">
            <ProductionReadiness
              overallScore={68}
              categories={productionCategories}
              verdict="The architecture is solid for MVP, but lacks the necessary observability for a production environment."
            />
          </div>

          {/* 11. Evolution Roadmap */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:900ms]">
            <EvolutionRoadmap phases={roadmapPhases} />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 12. AI Engineering Insights */}
          <div className="animate-in fade-in slide-in-from-top duration-500 [animation-delay:1000ms]">
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
          </div>

          {/* Footer with Action Buttons */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              {/* Share Report Button - White */}
              <button
                onClick={() => {
                  navigator.share?.({
                    title: `${analysis.repoName} - Analysis Report`,
                    text: "Check out this repository analysis report",
                  }).catch(() => {
                    alert("Share functionality would be implemented here");
                  });
                }}
                className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white text-zinc-950 font-semibold text-sm hover:bg-white hover:border-white hover:shadow-lg hover:shadow-white/10 transition-all duration-300 active:scale-95"
              >
                <Share2 size={16} />
                Share Report
              </button>

              {/* Export as PDF Button - Black */}
              <button
                onClick={handleExportPDF}
                className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-zinc-900 text-white font-semibold text-sm hover:bg-black hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 active:scale-95"
              >
                <Download size={16} />
                Export as PDF
              </button>
            </div>
            <p className="text-xs text-zinc-600 text-center mt-4">
              Last analyzed on {analysis.analyzedAt.toLocaleDateString()} at {analysis.analyzedAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}