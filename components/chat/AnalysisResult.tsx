// AnalysisResults.tsx - Main container with consistent dark theme
"use client";

import { motion } from "framer-motion";
import { Terminal, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { Analysis } from "@/types/analysis";
import HealthScoreCard from "./HealthScoreCard";
import PerformanceMetrics from "./PerformanceMetrics";
import IdentifiedGaps from "./IdentifiedGaps";
import PriorityOptimization from "./PriorityOptimization";

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
        className="flex items-start gap-4 p-6 rounded-3xl border border-white/10 bg-[#0a0a0a] backdrop-blur-xl"
      >
        <div className="flex-shrink-0 p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10">
          <Terminal className="w-6 h-6 text-purple-400" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
              isReady 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {isReady ? 'Ready' : 'Needs Work'}
            </span>
          </div>

          <p className="text-sm text-zinc-400 mt-1">
            {analysis.repoName} • <span className="text-zinc-500">{analysis.projectContext.intent}</span>
          </p>

          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Level: {analysis.level}
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Score: {analysis.maturityScore}/100
            </span>
          </div>
        </div>

        {/* Enhanced Refresh Button */}
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`
              relative flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-2xl
              transition-all duration-300 font-medium
              ${isRefreshing 
                ? "bg-purple-500/10 border-purple-500/30 text-purple-400 cursor-wait" 
                : "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/10 text-zinc-300 hover:text-white hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5"
              }
              border backdrop-blur-sm overflow-hidden group
            `}
          >
            {/* Animated gradient background on hover */}
            {!isRefreshing && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500" />
            )}
            
            {/* Glow effect */}
            {!isRefreshing && (
              <div className="absolute -inset-px bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            )}

            <div className="relative flex items-center gap-3">
              {/* Icon with rotating ring */}
              <div className="relative">
                <RefreshCw className={`
                  w-4 h-4 transition-all duration-500
                  ${isRefreshing ? "animate-spin text-purple-400" : "group-hover:rotate-180 group-hover:text-purple-400"}
                `} />
                
                {/* Pulsing ring around icon when refreshing */}
                {isRefreshing && (
                  <span className="absolute -inset-2 rounded-full border border-purple-400/30 animate-ping" />
                )}
              </div>

              <span className="text-sm tracking-wide">
                {isRefreshing ? "Refreshing..." : "Refresh Analysis"}
              </span>

              {/* Status indicator dot */}
              {!isRefreshing && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/50 group-hover:bg-purple-400 transition-colors duration-300" />
              )}
            </div>
          </motion.button>
        )}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-4">
        <HealthScoreCard score={analysis.maturityScore} level={analysis.level} />
        <PerformanceMetrics categoryScores={analysis.categoryScores} />
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
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-red-500/20 bg-[#0a0a0a] backdrop-blur-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider">Critical Blockers</h4>
              <div className="mt-3 space-y-2">
                {analysis.criticalBlockers.map((blocker, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-red-400 mt-1">•</span>
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