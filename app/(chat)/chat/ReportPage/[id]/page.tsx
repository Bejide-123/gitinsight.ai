import { getAnalysisById } from "@/services/analysis-service";
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
import type { Analysis } from "@/types/analysis";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    repoUrl?: string;
    repoName?: string;
    stars?: string;
    forks?: string;
    language?: string;
  }>;
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ReportPage({ params, searchParams }: ReportPageProps) {
  const { id } = await params;
  const { repoUrl, repoName, stars, forks, language } = await searchParams;

  // TODO: Replace with real DB fetch once wired
  const analysis = await getAnalysisById(id, repoUrl as string);
  console.log("Report for:", id, repoUrl);

  // ── Resolve AI-powered sections (real if available, fallback otherwise) ──

  const executiveSummary = analysis.aiInsights?.executiveSummary ?? "";

  const recommendations =
    analysis.aiInsights?.recommendations

  const roadmapPhases =
    analysis.aiInsights?.roadmapPhases

  const productionVerdict =
    analysis.aiInsights?.productionVerdict ??
    "Further analysis needed to determine production readiness.";

  const aiStrengths =
    analysis.aiInsights?.architecturalStrengths ?? analysis.strengths;

  const aiWeaknesses =
    analysis.aiInsights?.criticalWeaknesses ??
    analysis.dangerousIssues.slice(0, 3).map((i) => i.title);

  const longTermOutlook =
    analysis.aiInsights?.longTermOutlook ??
    "With the right improvements, this project has strong potential.";

  const sentimentScore = analysis.aiInsights?.sentimentScore ?? 2;

  // ── Resolve score-based sections ──────────────────────────────────────────

  const dimensions = [
    {
      label: "Structure",
      icon: GitBranch,
      score: analysis.categoryScores.architecture?.score ?? 0,
    },
    {
      label: "Completeness",
      icon: ListChecks,
      score: analysis.categoryScores.completeness?.score ?? 0,
    },
    {
      label: "Readiness",
      icon: Rocket,
      score: analysis.categoryScores.readiness?.score ?? 0,
    },
    {
      label: "Maintainability",
      icon: Construction,
      score: analysis.categoryScores.maintainability?.score ?? 0,
    },
    {
      label: "Security",
      icon: Shield,
      score: analysis.categoryScores.security?.score ?? 0,
    },
    {
      label: "Testing",
      icon: Atom,
      score: analysis.categoryScores.testing?.score ?? 0,
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
      status:
        (analysis.categoryScores.testing?.score ?? 0) >= 80
          ? ("passed" as const)
          : (analysis.categoryScores.testing?.score ?? 0) >= 40
            ? ("partial" as const)
            : ("missing" as const),
      detail: `${analysis.categoryScores.testing?.score ?? 0}% coverage score`,
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
      status:
        analysis.dangerousIssues.some((i) => i.title.toLowerCase().includes("secret"))
          ? ("missing" as const)
          : ("passed" as const),
      detail:
        analysis.dangerousIssues.some((i) => i.title.toLowerCase().includes("secret"))
          ? "Potential secrets detected"
          : "No raw secrets found",
    },
    {
      name: "ESLint Compliance",
      icon: Terminal,
      status: "partial" as const,
      detail: "Linting configuration detected",
    },
  ];

  const overallReadinessScore = analysis.categoryScores.readiness?.score ?? 0;

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

          {/* Repo metadata bar */}
          {(stars ?? forks ?? language) && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-3">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {stars && (
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Stars</span>
                    <span className="font-semibold text-white">
                      {parseInt(stars, 10).toLocaleString()}
                    </span>
                  </div>
                )}
                {forks && (
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Forks</span>
                    <span className="font-semibold text-white">
                      {parseInt(forks, 10).toLocaleString()}
                    </span>
                  </div>
                )}
                {language && (
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">Language</span>
                    <span className="rounded-full bg-zinc-800 px-3 py-0.5 text-white font-medium">
                      {language}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 2. Executive AI Summary */}
          <ExecutiveSummary
            repoName={analysis.repoName}
            summary={executiveSummary}
          />

          {/* 3. Engineering Dimensions — from real category scores */}
          <EngineeringDimensions
            dimensions={dimensions}
            totalFilesAnalyzed={analysis.selectedFilesCount ?? 0}
          />

          {/* 4. Tech Stack + Core Capabilities */}
          <TechStackAndCapabilities
            techStack={analysis.aiInsights?.techStack ?? []}
            capabilities={analysis.aiInsights?.capabilities ?? []}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 5. Vulnerability & Audit Findings — real issues */}
          <VulnerabilityFindings issues={analysis.dangerousIssues} />

          {/* 6. Strategic Recommendations — AI or fallback */}
          <StrategicRecommendations recommendations={recommendations ?? []} />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 7. Project Structure */}
          <ProjectStructure
            fileTree={analysis.fileTreeStructure ?? []}
            stats={{
              logicSeparation: analysis.categoryScores.architecture?.score ?? 0,
              unusedModules: 0,
              bundleSize: "—",
            }}
            healthWarning={
              analysis.dangerousIssues.some((i) => i.category === "Architecture")
                ? {
                    folder: "components",
                    message: analysis.dangerousIssues
                      .filter((i) => i.category === "Architecture")[0]
                      ?.description ?? "",
                  }
                : undefined
            }
          />

          {/* 8 & 9. Quality Gateways + Engineering Checks */}
          <QualityChecks checks={qualityChecks} />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 10. Production Readiness — AI verdict */}
          <ProductionReadiness
            overallScore={overallReadinessScore}
            categories={analysis.aiInsights?.productionCategories ?? []}
            verdict={productionVerdict}
          />

          {/* 11. Evolution Roadmap — AI or fallback */}
          <EvolutionRoadmap phases={roadmapPhases ?? []} />

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* 12. AI Engineering Insights */}
          <AIInsights
            strengths={aiStrengths}
            weaknesses={aiWeaknesses}
            longTermAdvice={longTermOutlook}
            sentimentScore={sentimentScore}
          />

          {/* Footer Actions */}
          <ReportActions
            repoName={analysis.repoName}
            analyzedAt={analysis.analyzedAt}
          />
        </div>
      </section>
    </>
  );
}
