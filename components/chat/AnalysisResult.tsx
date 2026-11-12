// AnalysisResults.tsx - Main container with consistent dark theme
"use client";

import { motion } from "framer-motion";
import { Terminal, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { Analysis } from "@/types/analysis";
import HealthScoreCard from "./HealthScoreCard";
import PerformanceMetrics from "./PerformanceMetrics";
import IdentifiedGaps from "./IdentifiedGaps";
import PriorityOptimization from "./PriorityOptimization";
import ComparisonDeltaBanner from "@/components/analysis/ComparisonDeltaBanner";
import ReportActions from "@/components/report/Reportactions";

interface AnalysisResultsProps {
  analysis: Analysis;
  reportId?: string;
  onRefresh?: () => Promise<void>;
}

export default function AnalysisResults({ 
  analysis, 
  reportId, 
  onRefresh 
}: AnalysisResultsProps) {
  const isReady = analysis.isProductionReady;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-[#0c1015] backdrop-blur-xl"
      >
        <div className="flex-shrink-0 p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <Terminal className="w-6 h-6 text-zinc-300" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-white tracking-tight">Analysis Complete</h2>
            <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md ${
              isReady 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {isReady ? 'Ready' : 'Needs Work'}
            </span>
          </div>

          <p className="text-sm text-zinc-400 mt-1">
            {analysis.repoName} • <span className="text-zinc-500 capitalize">{analysis.projectContext?.intent?.replace(/-/g, " ") || "Repository audit"}</span>
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Level: <span className="text-zinc-300 capitalize">{analysis.level}</span>
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Score: <span className="text-zinc-300 font-mono">{analysis.maturityScore}/100</span>
            </span>
          </div>
        </div>

        <ReportActions analysis={analysis} compact />

        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
              relative flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl
              transition-all duration-200 font-medium text-xs
              ${isRefreshing 
                ? "bg-white/[0.04] border-white/10 text-zinc-400 cursor-wait" 
                : "bg-white/[0.05] hover:bg-white/[0.09] border-white/10 hover:border-white/20 text-zinc-200 hover:text-white"
              }
              border backdrop-blur-sm
            `}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-zinc-400" : "text-zinc-400"}`} />
            <span>
              {isRefreshing ? "Refreshing..." : "Refresh Analysis"}
            </span>
          </motion.button>
        )}
      </motion.div>

      {/* Historical Comparison & Commit Banner */}
      <ComparisonDeltaBanner
        reportId={reportId || ""}
        commitSha={analysis.commitSha}
        commitMessage={analysis.commitMessage}
        branch={analysis.branch}
        analyzedAt={analysis.analyzedAt}
        maturityScore={analysis.maturityScore}
      />

      {/* Grid */}
      <div className="grid grid-cols-12 gap-4">
        <HealthScoreCard score={analysis.maturityScore} level={analysis.level} />
        <PerformanceMetrics
          categoryScores={analysis.categoryScores}
          dangerousIssues={analysis.dangerousIssues}
          missingImprovements={analysis.missingImprovements}
        />
        <IdentifiedGaps
          dangerousIssues={analysis.dangerousIssues}
          missingImprovements={analysis.missingImprovements}
          reportId={reportId}
        />
        <PriorityOptimization nextSteps={analysis.nextSteps} />
      </div>

      {/* Critical Blockers */}
      {analysis.criticalBlockers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] backdrop-blur-xl p-5"
        >
          <div className="flex items-start gap-3.5">
            <div className="flex-shrink-0 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Critical Blockers</h4>
              <div className="mt-2.5 space-y-1.5">
                {analysis.criticalBlockers.map((blocker, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <p>{blocker}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
