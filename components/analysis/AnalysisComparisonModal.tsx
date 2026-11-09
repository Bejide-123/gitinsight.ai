"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GitCommit,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  FileCode,
  Scale,
  Sparkles,
  ArrowRight,
  X,
  Clock,
  Layers,
  Shield,
  TestTube2,
  Rocket,
  Activity,
  Check,
  Copy,
  Info,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type {
  AnalysisComparisonResult,
  AnalysisRunMetadata,
  ComparedFinding,
  FindingLifecycleState,
} from "@/types/comparison";

interface AnalysisComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison: AnalysisComparisonResult | null;
  availableRuns: AnalysisRunMetadata[];
  selectedBaseRunId?: string;
  selectedTargetRunId?: string;
  onSelectRuns: (baseRunId: string, targetRunId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  security: Shield,
  architecture: Layers,
  testing: TestTube2,
  completeness: CheckCircle2,
  readiness: Rocket,
  maintainability: Activity,
};

function formatTimestamp(dateVal?: Date | string): string {
  if (!dateVal) return "Unknown date";
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return formatDistanceToNow(d, { addSuffix: true });
}

function truncateSha(sha?: string): string {
  if (!sha) return "HEAD";
  return sha.slice(0, 7);
}

export default function AnalysisComparisonModal({
  isOpen,
  onClose,
  comparison,
  availableRuns,
  selectedBaseRunId,
  selectedTargetRunId,
  onSelectRuns,
  isLoading = false,
  error,
}: AnalysisComparisonModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | FindingLifecycleState>("all");
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(text);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  const findingsList = comparison?.findings;
  const filteredFindings: ComparedFinding[] = findingsList
    ? activeTab === "all"
      ? findingsList.all
      : findingsList[activeTab] || []
    : [];

  const baseRun = comparison?.baseRun;
  const targetRun = comparison?.targetRun;
  const delta = comparison?.overallDelta ?? 0;
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-white/10 bg-[#0c1015] shadow-2xl overflow-hidden"
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#090c0f] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200">
              <Scale className="h-5 w-5 text-zinc-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Compare Analyses Over Time</h3>
                <span className="rounded border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                  Trend & Regression Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Track commit diffs, score progression, and finding lifecycles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* RUN SELECTOR BAR */}
        {availableRuns.length > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-[#10141a] px-5 py-3 text-xs sm:px-7">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Base Run (Earlier):</span>
                <select
                  value={selectedBaseRunId || baseRun?.id || availableRuns[0]?.runId}
                  onChange={(e) =>
                    onSelectRuns(
                      e.target.value,
                      selectedTargetRunId || targetRun?.id || availableRuns[availableRuns.length - 1]?.runId || ""
                    )
                  }
                  className="rounded-md border border-white/10 bg-[#090c0f] px-2.5 py-1 text-xs text-zinc-200 outline-none hover:border-white/20"
                >
                  {availableRuns.map((r, idx) => (
                    <option key={r.runId || idx} value={r.runId}>
                      Run #{idx + 1} ({truncateSha(r.commitSha)}) - {r.maturityScore} pts ({formatTimestamp(r.analyzedAt)})
                    </option>
                  ))}
                </select>
              </div>

              <ArrowRight className="h-3.5 w-3.5 text-zinc-600 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Target Run (Current):</span>
                <select
                  value={selectedTargetRunId || targetRun?.id || availableRuns[availableRuns.length - 1]?.runId}
                  onChange={(e) =>
                    onSelectRuns(
                      selectedBaseRunId || baseRun?.id || availableRuns[0]?.runId || "",
                      e.target.value
                    )
                  }
                  className="rounded-md border border-white/10 bg-[#090c0f] px-2.5 py-1 text-xs text-zinc-200 outline-none hover:border-white/20"
                >
                  {availableRuns.map((r, idx) => (
                    <option key={r.runId || idx} value={r.runId}>
                      Run #{idx + 1} ({truncateSha(r.commitSha)}) - {r.maturityScore} pts ({formatTimestamp(r.analyzedAt)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-[11px] text-zinc-500">
              Comparing 2 of {availableRuns.length} recorded runs
            </span>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="mt-4 text-xs text-zinc-400">Computing diff across analysis runs...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Info className="h-10 w-10 text-rose-400 mb-3" />
              <h4 className="text-base font-semibold text-white">Unable to Load Comparison</h4>
              <p className="text-xs text-zinc-400 max-w-sm mt-1">{error}</p>
            </div>
          ) : !comparison ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Info className="h-10 w-10 text-zinc-500 mb-3" />
              <h4 className="text-base font-semibold text-white">No Comparison Available Yet</h4>
              <p className="text-xs text-zinc-400 max-w-sm mt-1">
                Run another analysis on this repository to begin generating automated delta comparisons and tracking improvements over time.
              </p>
            </div>
          ) : (
            <>
              {/* 1. SCORE DELTA & COMMIT SUMMARY BANNER */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Overall Score Delta Card */}
                <div className="md:col-span-7 rounded-xl border border-white/10 bg-[#11161d] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                      Maturity Score Delta
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : isNegative
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-white/5 text-zinc-400 border border-white/10"
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : isNegative ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                      {isPositive ? `+${delta}` : delta} pts
                    </span>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-zinc-400">
                        {baseRun?.maturityScore}
                      </span>
                      <span className="text-xs text-zinc-500">/100</span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-zinc-500 self-center" />

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-white">
                        {targetRun?.maturityScore}
                      </span>
                      <span className="text-xs text-zinc-400">/100</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400 border-t border-white/[0.06] pt-3">
                    <div>
                      <span className="text-zinc-500">Level: </span>
                      <span className="text-zinc-200 font-medium">
                        {baseRun?.level} → {targetRun?.level}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Production Status: </span>
                      <span className={targetRun?.isProductionReady ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                        {targetRun?.isProductionReady ? "Production Ready" : "Pre-production"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Commit & Run Metadata Card */}
                <div className="md:col-span-5 rounded-xl border border-white/10 bg-[#11161d] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                      Commit & Revision Info
                    </span>
                    <div className="mt-3 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Base Commit:</span>
                        <div className="flex items-center gap-1.5 font-mono text-zinc-300">
                          <GitCommit className="h-3 w-3 text-zinc-500" />
                          <span>{truncateSha(baseRun?.commitSha)}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(baseRun?.commitSha || "")}
                            className="text-zinc-500 hover:text-white"
                          >
                            {copiedSha === baseRun?.commitSha ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Target Commit:</span>
                        <div className="flex items-center gap-1.5 font-mono text-zinc-100">
                          <GitCommit className="h-3 w-3 text-zinc-400" />
                          <span>{truncateSha(targetRun?.commitSha)}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(targetRun?.commitSha || "")}
                            className="text-zinc-500 hover:text-white"
                          >
                            {copiedSha === targetRun?.commitSha ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Time Interval:</span>
                        <span className="text-zinc-300 inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-zinc-500" />
                          {formatTimestamp(baseRun?.analyzedAt)} → {formatTimestamp(targetRun?.analyzedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {targetRun?.commitMessage && (
                    <p className="mt-3 text-[11px] text-zinc-400 truncate bg-white/[0.03] rounded px-2 py-1 font-mono">
                      &quot;{targetRun.commitMessage}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* 2. FAIRNESS & NORMALIZATION CARD (If intent or files changed) */}
              {comparison.fairness.notices.length > 0 && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs text-zinc-300">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2">
                    <Scale className="h-4 w-4" />
                    <span>Fairness & Context Normalization</span>
                  </div>
                  <ul className="space-y-1.5 pl-6 list-disc text-zinc-300">
                    {comparison.fairness.notices.map((notice, idx) => (
                      <li key={idx}>{notice}</li>
                    ))}
                  </ul>
                  {(comparison.fairness.intentChanged || comparison.fairness.categoryWeightsChanged) && (
                    <p className="mt-2 text-amber-200/90 font-medium">
                      Holding evaluation standard constant: Normalized score change is{" "}
                      <span className="font-mono font-bold">
                        {comparison.fairness.normalizedScoreDelta > 0 ? "+" : ""}
                        {comparison.fairness.normalizedScoreDelta} points
                      </span>
                      .
                    </p>
                  )}
                </div>
              )}

              {/* 3. KEY DRIVERS / ATTRIBUTION EXPLANATION */}
              {comparison.attributions.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-[#11161d] p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-zinc-300" />
                    <h4 className="text-sm font-semibold text-white">Score Change Attribution</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {comparison.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {comparison.attributions.slice(0, 4).map((attr, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs flex items-start justify-between gap-3"
                      >
                        <div>
                          <span className="font-semibold text-zinc-200 capitalize">
                            {attr.category}
                          </span>
                          <p className="text-zinc-400 text-[11px] mt-0.5">{attr.explanation}</p>
                        </div>
                        <span
                          className={`shrink-0 font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                            attr.pointContribution > 0
                              ? "bg-emerald-500/10 text-emerald-400"
                              : attr.pointContribution < 0
                              ? "bg-rose-500/10 text-rose-400"
                              : "bg-white/5 text-zinc-400"
                          }`}
                        >
                          {attr.pointContribution > 0 ? `+${attr.pointContribution}` : attr.pointContribution} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. CATEGORY SCORE COMPARISON GRID */}
              <div className="rounded-xl border border-white/10 bg-[#11161d] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">Individual Category Score Deltas</h4>
                  <span className="text-xs text-zinc-500">Target vs Base</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(comparison.categoryComparisons).map(([catKey, cat]) => {
                    const Icon = CATEGORY_ICONS[catKey.toLowerCase()] || Layers;
                    const catDelta = cat.delta;

                    return (
                      <div
                        key={catKey}
                        className="rounded-lg border border-white/[0.06] bg-[#090c0f] p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-zinc-400" />
                            <span className="text-xs font-semibold text-zinc-200">{cat.category}</span>
                          </div>
                          <span
                            className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                              !cat.available
                                ? "bg-white/5 text-zinc-500"
                                : catDelta > 0
                                ? "bg-emerald-500/10 text-emerald-400"
                                : catDelta < 0
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-white/5 text-zinc-400"
                            }`}
                          >
                            {cat.available ? (catDelta > 0 ? `+${catDelta}%` : `${catDelta}%`) : "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-500">{cat.available ? `${cat.baseScore}%` : "N/A"}</span>
                          <ArrowRight className="h-3 w-3 text-zinc-600" />
                          <span className="text-zinc-200 font-semibold">{cat.available ? `${cat.targetScore}%` : "N/A"}</span>
                        </div>

                        {/* Mini progress bar */}
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cat.targetScore >= 80
                                ? "bg-emerald-400"
                                : cat.targetScore >= 60
                                ? "bg-cyan-400"
                                : cat.targetScore >= 40
                                ? "bg-amber-400"
                                : "bg-rose-400"
                            }`}
                            style={{ width: `${cat.available ? Math.min(100, Math.max(0, cat.targetScore)) : 0}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
                          <span>
                            {cat.issuesSummary.resolved > 0 && (
                              <span className="text-emerald-400 font-medium">
                                -{cat.issuesSummary.resolved} fixed{" "}
                              </span>
                            )}
                            {cat.issuesSummary.new > 0 && (
                              <span className="text-rose-400 font-medium">
                                +{cat.issuesSummary.new} new
                              </span>
                            )}
                            {cat.issuesSummary.resolved === 0 && cat.issuesSummary.new === 0 && (
                              <span>0 issue changes</span>
                            )}
                          </span>
                          <span className="text-right">
                            {cat.available && (
                              <span className="mr-2">
                                Weight: {Math.round(cat.baseWeight * 100)}% → {Math.round(cat.targetWeight * 100)}%
                              </span>
                            )}
                            Impact: {cat.available ? `${cat.pointContribution > 0 ? "+" : ""}${cat.pointContribution} pts` : "N/A"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. FINDINGS LIFECYCLE (NEW, RESOLVED, PERSISTENT, CHANGED) */}
              <div className="rounded-xl border border-white/10 bg-[#11161d] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Findings Lifecycle</h4>
                    <p className="text-xs text-zinc-400">
                      Track newly introduced, resolved, changed, and persistent findings
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1.5 bg-[#090c0f] p-1 rounded-lg border border-white/[0.08] text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("all")}
                      className={`px-2.5 py-1 rounded font-medium transition ${
                        activeTab === "all" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      All ({findingsList?.counts.total || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("resolved")}
                      className={`px-2.5 py-1 rounded font-medium transition inline-flex items-center gap-1 ${
                        activeTab === "resolved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-emerald-400/80 hover:text-emerald-300"
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Resolved ({findingsList?.counts.resolved || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("new")}
                      className={`px-2.5 py-1 rounded font-medium transition inline-flex items-center gap-1 ${
                        activeTab === "new"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "text-rose-400/80 hover:text-rose-300"
                      }`}
                    >
                      <AlertOctagon className="h-3 w-3" />
                      New ({findingsList?.counts.new || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("changed")}
                      className={`px-2.5 py-1 rounded font-medium transition inline-flex items-center gap-1 ${
                        activeTab === "changed"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "text-amber-400/80 hover:text-amber-300"
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Changed ({findingsList?.counts.changed || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("persistent")}
                      className={`px-2.5 py-1 rounded font-medium transition ${
                        activeTab === "persistent" ? "bg-white/15 text-white" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Persistent ({findingsList?.counts.persistent || 0})
                    </button>
                  </div>
                </div>

                {/* Findings List */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {filteredFindings.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-500">
                      No findings in the &quot;{activeTab}&quot; lifecycle category.
                    </div>
                  ) : (
                    filteredFindings.map((finding, idx) => {
                      const state = finding.state;
                      const issue = finding.issue;
                      const sev = issue.severity?.toLowerCase();

                      return (
                        <div
                          key={idx}
                          className="rounded-lg border border-white/[0.08] bg-[#090c0f] p-4 text-xs space-y-2 transition hover:border-white/15"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {/* Lifecycle badge */}
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  state === "resolved"
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : state === "new"
                                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                    : state === "changed"
                                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                    : "bg-white/5 text-zinc-400 border border-white/10"
                                }`}
                              >
                                {state === "resolved" && <CheckCircle2 className="h-3 w-3" />}
                                {state === "new" && <AlertOctagon className="h-3 w-3" />}
                                {state === "changed" && <AlertTriangle className="h-3 w-3" />}
                                {state}
                              </span>

                              {/* Severity badge */}
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  sev === "critical"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : sev === "high"
                                    ? "bg-amber-500/20 text-amber-300"
                                    : sev === "medium"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-blue-500/20 text-blue-300"
                                }`}
                              >
                                {issue.severity}
                              </span>

                              <span className="text-zinc-400 font-medium">{issue.category}</span>
                            </div>

                            {/* File path */}
                            {issue.file && (
                              <div className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-300 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                                <FileCode className="h-3 w-3 text-zinc-400" />
                                <span>
                                  {issue.file}
                                  {issue.lineNumber ? `:${issue.lineNumber}` : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          <h5 className="font-semibold text-white text-sm">{issue.title}</h5>

                          {finding.changeSummary && (
                            <p className="text-[11px] text-zinc-400 italic">
                              Notice: {finding.changeSummary}
                            </p>
                          )}

                          {issue.description && (
                            <p className="text-zinc-300 text-xs leading-relaxed">
                              {issue.description}
                            </p>
                          )}

                          {issue.recommendation && (
                            <div className="flex items-start gap-1.5 text-zinc-300 bg-white/[0.02] p-2 rounded border border-white/[0.05]">
                              <span className="font-semibold text-emerald-400 shrink-0">Fix:</span>
                              <span>{issue.recommendation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#090c0f] px-5 py-3 sm:px-7 text-xs">
          <span className="text-zinc-500">
            GitInsight automated diff analysis across commits
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
