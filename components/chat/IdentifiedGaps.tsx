// IdentifiedGaps.tsx - Redesigned with minimal dark theme
"use client";

import { AlertTriangle, AlertCircle, AlertOctagon, ChevronDown, ExternalLink, CheckCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Issue } from "@/types/analysis";

interface IdentifiedGapsProps {
  dangerousIssues: Issue[];
  missingImprovements: Issue[];
  reportId?: string;
}

const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case "critical":
      return {
        icon: AlertOctagon,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        badge: "Critical",
        dot: "bg-red-400",
      };
    case "high":
      return {
        icon: AlertTriangle,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        badge: "High",
        dot: "bg-orange-400",
      };
    case "medium":
      return {
        icon: AlertCircle,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        badge: "Medium",
        dot: "bg-amber-400",
      };
    default:
      return {
        icon: AlertCircle,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        badge: "Low",
        dot: "bg-blue-400",
      };
  }
};

const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function dedupeGaps(issues: Issue[]) {
  const groups = new Map();

  for (const issue of issues) {
    const key = `${issue.category}::${issue.title}`.toLowerCase();
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        ...issue,
        occurrences: 1,
        files: issue.file ? [issue.file] : [],
      });
      continue;
    }

    existing.occurrences += 1;
    if (issue.file && !existing.files.includes(issue.file)) {
      existing.files.push(issue.file);
    }

    if (SEVERITY_RANK[issue.severity] < SEVERITY_RANK[existing.severity]) {
      existing.severity = issue.severity;
      existing.description = issue.description;
      existing.recommendation = issue.recommendation;
    }
  }

  return Array.from(groups.values());
}

export default function IdentifiedGaps({ dangerousIssues, missingImprovements, reportId }: IdentifiedGapsProps) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const allGaps = useMemo(
    () => dedupeGaps([...dangerousIssues, ...missingImprovements]),
    [dangerousIssues, missingImprovements]
  );

  const displayed = showAll ? allGaps : allGaps.slice(0, 5);
  const hasMore = allGaps.length > 5;

  const criticalCount = allGaps.filter((g) => g.severity === "critical").length;
  const highCount = allGaps.filter((g) => g.severity === "high").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="col-span-12 md:col-span-6 rounded-3xl border border-white/10 bg-[#0a0a0a] backdrop-blur-xl overflow-hidden group relative"
    >
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl group-hover:opacity-100 transition-opacity duration-700 opacity-0" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Identified Gaps</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{allGaps.length} issues found</p>
              </div>
            </div>
          </div>

          {/* Badge summary */}
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                {criticalCount} Critical
              </span>
            )}
            {highCount > 0 && (
              <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
                {highCount} High
              </span>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {allGaps.length === 0 ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-sm text-zinc-400">No significant gaps identified</p>
                <p className="text-xs text-zinc-500 mt-1">Your project is in excellent shape</p>
              </div>
            ) : (
              displayed.map((gap, idx) => {
                const config = getSeverityConfig(gap.severity);
                const Icon = config.icon;
                const isHovered = hoveredId === `${gap.category}-${gap.title}`;

                return (
                  <motion.div
                    key={`${gap.category}-${gap.title}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    onMouseEnter={() => setHoveredId(`${gap.category}-${gap.title}`)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`group/item relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${config.bg} ${config.border} ${isHovered ? 'translate-x-1' : ''}`}
                  >
                    <div className="relative flex items-start gap-4">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg} border ${config.border} transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-medium transition-colors duration-300 ${isHovered ? 'text-white' : 'text-zinc-300'}`}>
                              {gap.title}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{gap.description}</p>
                          </div>
                          <span className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${config.bg} border ${config.border} ${config.color}`}>
                            {config.badge}
                          </span>
                        </div>

                        {gap.files && gap.files.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500">
                              {gap.files.length === 1 ? gap.files[0] : `${gap.files[0]} +${gap.files.length - 1} more`}
                            </span>
                            {gap.occurrences > 1 && (
                              <span className="text-[10px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
                                ×{gap.occurrences}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        {(hasMore || reportId) && (
          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
            {hasMore && !showAll && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAll(true)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-sm font-medium text-zinc-400">See all {allGaps.length} gaps</span>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </motion.button>
            )}

            {reportId && (
              <motion.a
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                href={`/report/${reportId}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-sm font-medium text-zinc-400">View detailed report</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </motion.a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}