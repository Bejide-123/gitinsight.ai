// IdentifiedGaps.tsx - Clean obsidian theme
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
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        badge: "Critical",
      };
    case "high":
      return {
        icon: AlertTriangle,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        badge: "High",
      };
    case "medium":
      return {
        icon: AlertCircle,
        color: "text-zinc-300",
        bg: "bg-white/[0.04]",
        border: "border-white/10",
        badge: "Medium",
      };
    default:
      return {
        icon: AlertCircle,
        color: "text-zinc-400",
        bg: "bg-white/[0.02]",
        border: "border-white/[0.08]",
        badge: "Low",
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-[#0c0f16] p-6 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
            <AlertTriangle className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">Identified Gaps</h3>
            <p className="text-xs text-zinc-500 mt-0.5">{allGaps.length} issues found</p>
          </div>
        </div>

        {/* Badge summary */}
        <div className="flex gap-1.5">
          {criticalCount > 0 && (
            <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
              {criticalCount} Critical
            </span>
          )}
          {highCount > 0 && (
            <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400">
              {highCount} High
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        <AnimatePresence mode="wait">
          {allGaps.length === 0 ? (
            <div className="py-10 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-xs font-medium text-zinc-300">No significant gaps identified</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Your project is in excellent shape</p>
            </div>
          ) : (
            displayed.map((gap, idx) => {
              const config = getSeverityConfig(gap.severity);
              const Icon = config.icon;
              const isHovered = hoveredId === `${gap.category}-${gap.title}`;

              return (
                <div
                  key={`${gap.category}-${gap.title}-${idx}`}
                  onMouseEnter={() => setHoveredId(`${gap.category}-${gap.title}`)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`p-3.5 rounded-xl border transition-colors ${config.border} bg-[#090b10] hover:border-white/20`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`shrink-0 p-1.5 rounded-lg ${config.bg} border ${config.border} mt-0.5`}>
                      <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-xs font-medium ${isHovered ? 'text-white' : 'text-zinc-200'}`}>
                            {gap.title}
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{gap.description}</p>
                        </div>
                        <span className={`shrink-0 px-2 py-0.5 text-[9px] font-semibold uppercase rounded font-mono ${config.bg} border ${config.border} ${config.color}`}>
                          {config.badge}
                        </span>
                      </div>

                      {gap.files && gap.files.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500">
                            {gap.files.length === 1 ? gap.files[0] : `${gap.files[0]} +${gap.files.length - 1} more`}
                          </span>
                          {gap.occurrences > 1 && (
                            <span className="text-[10px] text-zinc-400 bg-white/[0.04] border border-white/10 px-1.5 py-0.2 rounded font-mono">
                              ×{gap.occurrences}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer actions */}
      {(hasMore || reportId) && (
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col gap-2">
          {hasMore && !showAll && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-300 hover:border-white/20 hover:text-white transition"
            >
              <span>See all {allGaps.length} gaps</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          )}

          {reportId && (
            <a
              href={`/report/${reportId}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-300 hover:border-white/20 hover:text-white transition"
            >
              <span>View detailed report</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
