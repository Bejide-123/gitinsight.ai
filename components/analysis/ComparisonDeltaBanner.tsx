"use client";

import { useState } from "react";
import {
  GitCommit,
  GitBranch,
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
  CheckCircle2,
  AlertOctagon,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useComparison } from "@/hooks/useComparison";
import AnalysisComparisonModal from "./AnalysisComparisonModal";

interface ComparisonDeltaBannerProps {
  reportId: string;
  commitSha?: string;
  commitMessage?: string;
  branch?: string;
  analyzedAt?: Date | string;
  maturityScore?: number;
}

function truncateSha(sha?: string): string {
  if (!sha) return "HEAD";
  return sha.slice(0, 7);
}

function formatTimestamp(dateVal?: Date | string): string {
  if (!dateVal) return "Recently";
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return "Recently";
  return formatDistanceToNow(d, { addSuffix: true });
}

export default function ComparisonDeltaBanner({
  reportId,
  commitSha,
  commitMessage,
  branch,
  analyzedAt,
  maturityScore,
}: ComparisonDeltaBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    comparison,
    availableRuns,
    hasMultipleRuns,
    baseRunId,
    targetRunId,
    isLoading,
    error,
    selectRuns,
  } = useComparison({ reportId });

  const delta = comparison?.overallDelta ?? 0;
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  const resolvedCount = comparison?.findings.counts.resolved ?? 0;
  const newCount = comparison?.findings.counts.new ?? 0;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0c1015] px-4 py-3 text-xs text-zinc-300 shadow-sm">
        {/* Left: Commit and Timestamp info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Commit SHA badge */}
          <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-zinc-200">
            <GitCommit className="h-3.5 w-3.5 text-zinc-400" />
            <span>{truncateSha(commitSha)}</span>
            {branch && (
              <>
                <span className="text-zinc-600">/</span>
                <span className="inline-flex items-center gap-1 text-zinc-400">
                  <GitBranch className="h-3 w-3" />
                  {branch}
                </span>
              </>
            )}
          </div>
          {maturityScore !== undefined && (
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300">
              Score {maturityScore}/100
            </span>
          )}

          {/* Timestamp */}
          <div className="inline-flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span>Analyzed {formatTimestamp(analyzedAt)}</span>
          </div>

          {/* Commit Message if available */}
          {commitMessage && (
            <span className="hidden md:inline text-zinc-400 truncate max-w-[260px] italic">
              &quot;{commitMessage}&quot;
            </span>
          )}
        </div>

        {/* Right: Trend info & Compare button */}
        <div className="flex items-center gap-3">
          {hasMultipleRuns && comparison ? (
            <div className="flex items-center gap-2.5">
              {/* Score delta indicator */}
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${
                  isPositive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                    : isNegative
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                    : "bg-white/5 text-zinc-400 border border-white/10"
                }`}
              >
                {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : isNegative ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                {isPositive ? `+${delta}` : delta} pts
              </span>

              {/* Finding deltas */}
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-400">
                {resolvedCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {resolvedCount} fixed
                  </span>
                )}
                {newCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-rose-400">
                    <AlertOctagon className="h-3 w-3" />
                    {newCount} new
                  </span>
                )}
              </div>

              {/* Compare Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10 hover:border-white/20"
              >
                <Scale className="h-3.5 w-3.5 text-zinc-300" />
                <span>Compare Analyses</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                Initial baseline run
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <Scale className="h-3.5 w-3.5" />
                <span>Run History</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      <AnalysisComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        comparison={comparison}
        availableRuns={availableRuns}
        selectedBaseRunId={baseRunId}
        selectedTargetRunId={targetRunId}
        onSelectRuns={selectRuns}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
