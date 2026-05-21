import { Terminal } from "lucide-react";

import type { Analysis } from "@/types/analysis";

import HealthScoreCard from "./HealthScoreCard";
import PerformanceMetrics from "./PerformanceMetrics";
import IdentifiedGaps from "./IdentifiedGaps";
import PriorityOptimization from "./PriorityOptimization";

interface AnalysisResultsProps {
  analysis: Analysis;
}

export default function AnalysisResults({
  analysis,
}: AnalysisResultsProps) {
  return (
    <div className="flex flex-col gap-4 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
          <Terminal size={14} className="text-black" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-100">
            Analysis Complete 🎉
          </h2>

          <p className="text-xs text-zinc-500">
            {analysis.repoName} • {analysis.projectContext.intent}
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">
        <span className="font-medium text-white">
          {analysis.repoName}
        </span>{" "}
        is a{" "}
        <span className="font-medium text-white">
          {analysis.level}
        </span>{" "}
        project
        {analysis.isProductionReady
          ? " ready for production."
          : " not yet production-ready."}
      </p>

      {/* GRID */}
      <div className="grid w-full grid-cols-12 gap-4">

        <HealthScoreCard
          score={analysis.maturityScore}
          level={analysis.level}
        />

        <PerformanceMetrics
          categoryScores={analysis.categoryScores}
        />

        <IdentifiedGaps
          dangerousIssues={analysis.dangerousIssues}
          missingImprovements={analysis.missingImprovements}
        />

        <PriorityOptimization
          nextSteps={analysis.nextSteps}
        />

      </div>

      {/* CRITICAL BLOCKERS */}
      {analysis.criticalBlockers.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-400">
            Critical Blockers
          </h3>

          <div className="space-y-2">
            {analysis.criticalBlockers.map((blocker, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm text-zinc-300"
              >
                <span className="mt-1 text-red-400">•</span>
                <p>{blocker}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}