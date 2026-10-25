"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import type { CategoryScore, Issue } from "@/types/analysis";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  ShieldAlert,
  Zap,
  TestTube2,
  FileText,
  Layers,
  CheckCircle2,
  Rocket,
  AlertTriangle,
  FileCode,
  X,
  Pin,
  PinOff,
  Sparkles,
} from "lucide-react";

interface PerformanceMetricsProps {
  categoryScores: Record<string, CategoryScore>;
  dangerousIssues?: Issue[];
  missingImprovements?: Issue[];
}

interface CategoryMetaConfig {
  label: string;
  icon: any;
  color: string;
  badgeColor: string;
  bg: string;
  border: string;
}

const CATEGORY_META: Record<string, CategoryMetaConfig> = {
  security: {
    label: "Security",
    icon: Shield,
    color: "text-rose-400",
    badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  architecture: {
    label: "Architecture",
    icon: Layers,
    color: "text-purple-400",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  testing: {
    label: "Testing",
    icon: TestTube2,
    color: "text-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  completeness: {
    label: "Completeness",
    icon: CheckCircle2,
    color: "text-cyan-400",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  readiness: {
    label: "Readiness",
    icon: Rocket,
    color: "text-amber-400",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  maintainability: {
    label: "Maintainability",
    icon: Activity,
    color: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  codequality: {
    label: "Code Quality",
    icon: TrendingUp,
    color: "text-teal-400",
    badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
  },
  performance: {
    label: "Performance",
    icon: Zap,
    color: "text-yellow-400",
    badgeColor: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  documentation: {
    label: "Documentation",
    icon: FileText,
    color: "text-indigo-400",
    badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
};

function getCategoryMeta(key: string): CategoryMetaConfig {
  const normalized = key.toLowerCase().replace(/[\s-_]/g, "");
  return (
    CATEGORY_META[normalized] || {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: BarChart3,
      color: "text-purple-400",
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    }
  );
}

const SEVERITY_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  critical: {
    label: "Critical",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
  },
  high: {
    label: "High",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
  },
  medium: {
    label: "Medium",
    badge: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    dot: "bg-yellow-400",
  },
  low: {
    label: "Low",
    badge: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    dot: "bg-blue-400",
  },
};

export default function PerformanceMetrics({
  categoryScores,
  dangerousIssues = [],
  missingImprovements = [],
}: PerformanceMetricsProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCategory(null);
        setIsPinned(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter issues for active category
  const activeIssues = useMemo(() => {
    if (!activeCategory) return [];

    const categoryData = categoryScores[activeCategory];
    const directIssues = categoryData?.issues || [];

    // Fallback search across dangerousIssues and missingImprovements if direct is empty
    const normalizedKey = activeCategory.toLowerCase();
    const fallbackIssues = [...dangerousIssues, ...missingImprovements].filter((i) => {
      const cat = (i.category || "").toLowerCase();
      if (normalizedKey === "security") return cat.includes("security") || i.isDangerous;
      if (normalizedKey === "architecture") return cat.includes("architecture");
      if (normalizedKey === "testing") return cat.includes("test");
      if (normalizedKey === "completeness") return cat.includes("complete");
      if (normalizedKey === "readiness") return cat.includes("readiness") || cat.includes("devops");
      if (normalizedKey === "maintainability") return cat.includes("maintain") || cat.includes("code");
      return cat === normalizedKey;
    });

    // Merge and deduplicate by title
    const seenTitles = new Set<string>();
    const merged: Issue[] = [];

    for (const issue of [...directIssues, ...fallbackIssues]) {
      if (issue?.title && !seenTitles.has(issue.title)) {
        seenTitles.add(issue.title);
        merged.push(issue);
      }
    }

    return merged;
  }, [activeCategory, categoryScores, dangerousIssues, missingImprovements]);

  // Filter by selected severity
  const filteredIssues = useMemo(() => {
    if (selectedSeverity === "all") return activeIssues;
    return activeIssues.filter((i) => i.severity?.toLowerCase() === selectedSeverity.toLowerCase());
  }, [activeIssues, selectedSeverity]);

  // Counts by severity
  const severityCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const issue of activeIssues) {
      const sev = (issue.severity || "low").toLowerCase();
      if (sev in counts) {
        counts[sev as keyof typeof counts]++;
      }
    }
    return counts;
  }, [activeIssues]);

  // Hover handlers with debounce grace period
  const handleMouseEnterCard = (catKey: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!isPinned || activeCategory === catKey) {
      setActiveCategory(catKey);
    }
  };

  const handleMouseLeaveCard = () => {
    if (isPinned) return;
    closeTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 280);
  };

  const handleMouseEnterModal = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseLeaveModal = () => {
    if (isPinned) return;
    closeTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 240);
  };

  const handleCardClick = (catKey: string) => {
    if (activeCategory === catKey && isPinned) {
      setIsPinned(false);
      setActiveCategory(null);
    } else {
      setActiveCategory(catKey);
      setIsPinned(true);
      setSelectedSeverity("all");
    }
  };

  const handleCloseModal = () => {
    setActiveCategory(null);
    setIsPinned(false);
  };

  const categories = Object.entries(categoryScores);

  const activeCategoryMeta = activeCategory ? getCategoryMeta(activeCategory) : null;
  const activeScore = activeCategory ? Math.round(categoryScores[activeCategory]?.score || 0) : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="col-span-12 md:col-span-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] backdrop-blur-xl group relative"
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl group-hover:opacity-100 transition-opacity duration-700 opacity-0 pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Hover over any dimension to inspect flagged issues
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">Interactive inspection</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map(([categoryKey, data], idx) => {
              const meta = getCategoryMeta(categoryKey);
              const Icon = meta.icon;
              const score = Math.round(data?.score || 0);

              // Calculate issues count for this card
              const directCount = data?.issues?.length || 0;
              const fallbackCount = [...dangerousIssues, ...missingImprovements].filter((i) => {
                const cat = (i.category || "").toLowerCase();
                const norm = categoryKey.toLowerCase();
                if (norm === "security") return cat.includes("security") || i.isDangerous;
                if (norm === "architecture") return cat.includes("architecture");
                if (norm === "testing") return cat.includes("test");
                if (norm === "completeness") return cat.includes("complete");
                if (norm === "readiness") return cat.includes("readiness") || cat.includes("devops");
                if (norm === "maintainability") return cat.includes("maintain") || cat.includes("code");
                return cat === norm;
              }).length;

              const issuesCount = directCount > 0 ? directCount : fallbackCount;
              const isSelected = activeCategory === categoryKey;

              return (
                <motion.div
                  key={categoryKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  onMouseEnter={() => handleMouseEnterCard(categoryKey)}
                  onMouseLeave={handleMouseLeaveCard}
                  onClick={() => handleCardClick(categoryKey)}
                  className={`group/item relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-cyan-400/40 bg-white/[0.08] shadow-lg shadow-cyan-500/10"
                      : "border-white/5 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${meta.bg}`}>
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <span className="text-sm font-medium text-zinc-200 group-hover/item:text-white transition-colors">
                        {meta.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">{score}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                      className={`h-full rounded-full ${
                        score >= 80
                          ? "bg-emerald-400"
                          : score >= 60
                          ? "bg-cyan-400"
                          : score >= 40
                          ? "bg-amber-400"
                          : "bg-rose-400"
                      }`}
                    />
                  </div>

                  {/* Issues Count & Hover Indicator */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        issuesCount > 0 ? "text-zinc-300" : "text-emerald-400/90"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          issuesCount > 0 ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                      {issuesCount > 0
                        ? `${issuesCount} issue${issuesCount > 1 ? "s" : ""}`
                        : "0 issues detected"}
                    </span>

                    <span className="text-[10px] text-zinc-500 group-hover/item:text-cyan-300 transition-colors">
                      {isSelected && isPinned ? "Pinned 📌" : "Hover to view →"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* POP-UP MODAL (Portal directly onto document.body to avoid overflow-hidden clipping) */}
      {mounted &&
        activeCategory &&
        activeCategoryMeta &&
        createPortal(
          <AnimatePresence>
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
              onClick={handleCloseModal}
              onMouseEnter={handleMouseEnterModal}
              onMouseLeave={handleMouseLeaveModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={handleMouseEnterModal}
                onMouseLeave={handleMouseLeaveModal}
                className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-white/15 bg-[#0d1115] shadow-2xl shadow-black/90 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${activeCategoryMeta.bg}`}>
                      <activeCategoryMeta.icon className={`w-5 h-5 ${activeCategoryMeta.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white">
                          {activeCategoryMeta.label} Dimension
                        </h4>
                        <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs font-semibold text-zinc-200">
                          {activeScore}%
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {activeIssues.length} issue{activeIssues.length === 1 ? "" : "s"} identified
                        in this category
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Pin/Lock Button */}
                    <button
                      type="button"
                      onClick={() => setIsPinned(!isPinned)}
                      title={isPinned ? "Unpin modal" : "Pin modal open"}
                      className={`rounded-lg p-2 transition ${
                        isPinned
                          ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                          : "text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                    </button>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      title="Close pop-up"
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Severity Breakdown Filter Bar */}
                {activeIssues.length > 0 && (
                  <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#090c0f] px-6 py-2.5 overflow-x-auto text-xs">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mr-1">
                      Filter:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSeverity("all")}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                        selectedSeverity === "all"
                          ? "bg-white/15 text-white"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                      }`}
                    >
                      All ({activeIssues.length})
                    </button>

                    {severityCounts.critical > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSeverity("critical")}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                          selectedSeverity === "critical"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : "text-rose-400 hover:bg-rose-500/10"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        Critical ({severityCounts.critical})
                      </button>
                    )}

                    {severityCounts.high > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSeverity("high")}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                          selectedSeverity === "high"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "text-amber-400 hover:bg-amber-500/10"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        High ({severityCounts.high})
                      </button>
                    )}

                    {severityCounts.medium > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSeverity("medium")}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                          selectedSeverity === "medium"
                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                            : "text-yellow-400 hover:bg-yellow-500/10"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        Medium ({severityCounts.medium})
                      </button>
                    )}

                    {severityCounts.low > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSeverity("low")}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                          selectedSeverity === "low"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "text-blue-400 hover:bg-blue-500/10"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        Low ({severityCounts.low})
                      </button>
                    )}
                  </div>
                )}

                {/* Modal Body: Scrollable Issues List */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 max-h-[55vh]">
                  {filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h5 className="text-base font-semibold text-white">No Issues Found</h5>
                      <p className="text-xs text-zinc-400 max-w-sm mt-1">
                        {selectedSeverity === "all"
                          ? `All architectural and static checks for ${activeCategoryMeta.label} passed cleanly.`
                          : `No ${selectedSeverity} severity issues found in this category.`}
                      </p>
                    </div>
                  ) : (
                    filteredIssues.map((issue, idx) => {
                      const sev = (issue.severity || "low").toLowerCase();
                      const sevBadge =
                        SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.low;

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5 transition hover:border-white/20"
                        >
                          {/* Issue Top Row: Severity & Danger */}
                          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${sevBadge.badge}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${sevBadge.dot}`} />
                                {sevBadge.label}
                              </span>

                              {issue.isDangerous && (
                                <span className="inline-flex items-center gap-1 rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                                  Security Risk
                                </span>
                              )}
                            </div>

                            {/* File path if available */}
                            {issue.file && (
                              <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-[#090c0f] px-2 py-1 text-[11px] font-mono text-cyan-300">
                                <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                <span className="truncate max-w-[220px]">
                                  {issue.file}
                                  {issue.lineNumber ? `:${issue.lineNumber}` : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Issue Title */}
                          <h5 className="text-sm font-semibold text-white leading-snug mb-1.5">
                            {issue.title}
                          </h5>

                          {/* Issue Description */}
                          {issue.description && (
                            <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                              {issue.description}
                            </p>
                          )}

                          {/* Impact */}
                          {issue.impact && (
                            <div className="flex items-start gap-2 text-xs text-zinc-300 bg-amber-500/[0.04] border border-amber-500/10 rounded-xl p-2.5 mb-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-amber-300">Impact: </span>
                                <span>{issue.impact}</span>
                              </div>
                            </div>
                          )}

                          {/* Recommendation */}
                          {issue.recommendation && (
                            <div className="flex items-start gap-2 text-xs text-zinc-300 bg-emerald-500/[0.04] border border-emerald-500/10 rounded-xl p-2.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-emerald-300">Fix Recommendation: </span>
                                <span>{issue.recommendation}</span>
                              </div>
                            </div>
                          )}

                          {/* Code evidence snippets */}
                          {issue.evidence && issue.evidence.length > 0 && (
                            <div className="mt-3 rounded-xl border border-white/10 bg-[#07090c] p-2.5">
                              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-1">
                                Flagged Evidence
                              </p>
                              <pre className="text-[11px] font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                                {issue.evidence.join("\n")}
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer with AI prompt tip */}
                <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.02] px-6 py-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                    <span>
                      Tip: Ask GitInsight AI in chat below to get a step-by-step fix for these issues.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
