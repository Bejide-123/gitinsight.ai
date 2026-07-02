'use client';

import { AlertTriangle, AlertCircle, AlertOctagon, ChevronDown } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { Issue } from '@/types/analysis';
import Link from 'next/link';

interface IdentifiedGapsProps {
  dangerousIssues: Issue[];
  missingImprovements: Issue[];
  reportId?: string;
}

const getSeverityStyles = (
  severity: string
): { icon: React.ReactNode; bg: string; border: string; text: string; dot: string } => {
  switch (severity) {
    case 'critical':
      return {
        icon: <AlertOctagon size={18} />,
        bg: 'bg-red-500/10 hover:bg-red-500/15',
        border: 'border-red-500/30 hover:border-red-500/50',
        text: 'text-red-300',
        dot: 'bg-red-500',
      };
    case 'high':
      return {
        icon: <AlertTriangle size={18} />,
        bg: 'bg-orange-500/10 hover:bg-orange-500/15',
        border: 'border-orange-500/30 hover:border-orange-500/50',
        text: 'text-orange-300',
        dot: 'bg-orange-500',
      };
    case 'medium':
      return {
        icon: <AlertCircle size={18} />,
        bg: 'bg-amber-500/10 hover:bg-amber-500/15',
        border: 'border-amber-500/30 hover:border-amber-500/50',
        text: 'text-amber-300',
        dot: 'bg-amber-500',
      };
    default:
      return {
        icon: <AlertCircle size={18} />,
        bg: 'bg-blue-500/10 hover:bg-blue-500/15',
        border: 'border-blue-500/30 hover:border-blue-500/50',
        text: 'text-blue-300',
        dot: 'bg-blue-500',
      };
  }
};

/**
 * Severity rank used to keep the "worst" version of a duplicate group
 * (e.g. if the same issue title shows up as both "high" and "medium"
 * across different files, keep the higher severity card).
 */
const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

/**
 * Collapses duplicate gaps that share the same title + category into
 * a single card, merging their affected files so nothing is lost —
 * just no longer repeated as separate cards.
 */
function dedupeGaps(issues: Issue[]): (Issue & { occurrences: number; files: string[] })[] {
  const groups = new Map<string, Issue & { occurrences: number; files: string[] }>();

  for (const issue of issues) {
    // Group key: same title + category = same underlying gap
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

    // Keep the higher-severity version as the "representative" card
    if (SEVERITY_RANK[issue.severity] < SEVERITY_RANK[existing.severity]) {
      existing.severity = issue.severity;
      existing.description = issue.description;
      existing.recommendation = issue.recommendation;
      existing.impact = issue.impact;
    }
  }

  return Array.from(groups.values());
}

export default function IdentifiedGaps({ dangerousIssues, missingImprovements, reportId }: IdentifiedGapsProps) {
  const [showAllGaps, setShowAllGaps] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dedupe across BOTH lists combined, so a gap flagged as both
  // "dangerous" and "missing" elsewhere still only shows once.
  const allGaps = useMemo(
    () => dedupeGaps([...dangerousIssues, ...missingImprovements]),
    [dangerousIssues, missingImprovements]
  );

  const PREVIEW_COUNT = 5;
  const displayedGaps = showAllGaps ? allGaps : allGaps.slice(0, PREVIEW_COUNT);
  const hasMoreGaps = allGaps.length > PREVIEW_COUNT;

  const criticalCount = allGaps.filter((g) => g.severity === 'critical').length;
  const highCount = allGaps.filter((g) => g.severity === 'high').length;

  return (
    <div className="relative col-span-12 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent backdrop-blur-xl md:col-span-6 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>

      <div className="relative p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30">
              <AlertTriangle size={20} className="text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-300 via-orange-200 to-red-200 bg-clip-text text-transparent">
              Identified Gaps
            </h3>
          </div>

          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-transparent rounded-full"></div>
        </div>

        {/* Summary badges */}
        {allGaps.length > 0 && (
          <div className="mb-6 flex gap-3">
            {criticalCount > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-xs font-semibold text-red-300">
                  {criticalCount} Critical
                </span>
              </div>
            )}
            {highCount > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-xs font-semibold text-orange-300">
                  {highCount} High
                </span>
              </div>
            )}
          </div>
        )}

        {/* Gaps List */}
        <div className="space-y-3">
          {allGaps.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-zinc-400">
                No significant gaps identified. Excellent work! 🎉
              </p>
            </div>
          ) : (
            <>
              {displayedGaps.map((gap, index) => {
                const styles = getSeverityStyles(gap.severity);
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={`${gap.category}-${gap.title}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`group/item relative flex gap-3 p-4 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer
                      ${styles.bg} ${styles.border}
                      ${isHovered ? 'translate-x-1 scale-[1.02]' : 'translate-x-0 scale-100'}
                    `}
                    style={{
                      animation: mounted
                        ? `slideInRight 0.5s ease-out ${index * 100}ms forwards`
                        : 'none',
                      opacity: mounted ? 1 : 0,
                    }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300`}
                    ></div>

                    <div className={`flex-shrink-0 mt-0.5 ${styles.text} transition-all duration-300 ${isHovered ? 'scale-110 -translate-y-0.5' : 'scale-100'}`}>
                      {styles.icon}
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium transition-colors duration-300 ${isHovered ? 'text-white' : 'text-zinc-300'}`}>
                          {gap.title}
                        </p>
                        {gap.occurrences > 1 && (
                          <span className="flex-shrink-0 text-[10px] font-bold text-zinc-500 bg-zinc-500/10 px-1.5 py-0.5 rounded-full">
                            ×{gap.occurrences}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                        {gap.description}
                      </p>
                      {gap.files.length > 0 && (
                        <p className="text-[11px] text-zinc-600 mt-1.5 truncate">
                          {gap.files.length === 1
                            ? gap.files[0]
                            : `${gap.files[0]} +${gap.files.length - 1} more file${gap.files.length - 1 > 1 ? 's' : ''}`}
                        </p>
                      )}
                    </div>

                    <div className="relative flex-shrink-0">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.bg} border ${styles.border} ${styles.text} transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                        {gap.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Show more / Details button */}
        {(hasMoreGaps || reportId) && (
          <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-orange-500/10">
            {hasMoreGaps && !showAllGaps && (
              <button
                onClick={() => setShowAllGaps(true)}
                className="group/btn flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-orange-500/20 hover:border-orange-500/40 bg-orange-500/5 hover:bg-orange-500/10 transition-all duration-300"
              >
                <span className="text-sm font-semibold text-orange-400 group-hover/btn:text-orange-300">
                  See all {allGaps.length} gaps
                </span>
                <ChevronDown size={16} className="text-orange-400 group-hover/btn:translate-y-1 transition-transform" />
              </button>
            )}

            {reportId && (
              <Link
                href={`/report/${reportId}`}
                className="group/link flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border border-orange-500/30 hover:border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 transition-all duration-300"
              >
                <span className="text-sm font-semibold text-orange-300 group-hover/link:text-orange-200">
                  View detailed report
                </span>
                <ChevronDown size={16} className="text-orange-300 group-hover/link:translate-y-1 transition-transform" />
              </Link>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}