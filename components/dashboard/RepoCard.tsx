import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, GitBranch, GitCommit, Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { HistoryReport } from "@/services/history-service";

interface RepoCardProps {
  report: HistoryReport;
  onOpen: () => void;
}

function truncateSha(sha?: string): string {
  if (!sha) return "";
  return sha.slice(0, 7);
}

export function RepoCard({ report, onOpen }: RepoCardProps) {
  const score = Math.max(0, Math.min(100, report.maturityScore));
  const scoreColor =
    score >= 80
      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
      : score >= 60
        ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
        : "text-rose-400 border-rose-500/20 bg-rose-500/10";

  const analyzedAt = new Date(report.analyzedAt);
  const timeLabel = Number.isNaN(analyzedAt.getTime())
    ? "Date unavailable"
    : formatDistanceToNow(analyzedAt, { addSuffix: true });

  const shortSha = truncateSha(report.commitSha);
  const runCount = report.runs?.length ?? 1;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="group flex min-w-0 flex-col gap-4 rounded-xl border border-white/10 bg-[#0c1015] p-4 transition-colors hover:border-white/20 hover:bg-[#11161d] sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-sm"
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-zinc-100">
            {report.repoName}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-zinc-500" />
              {timeLabel}
            </span>

            {shortSha && (
              <span className="inline-flex items-center gap-1 rounded bg-white/[0.04] border border-white/10 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                <GitCommit className="h-3 w-3 text-zinc-400" />
                {shortSha}
              </span>
            )}

            {runCount > 1 && (
              <span className="inline-flex items-center gap-1 rounded bg-white/[0.04] border border-white/10 px-1.5 py-0.5 text-[11px] text-zinc-300">
                <Layers className="h-3 w-3 text-zinc-400" />
                {runCount} runs
              </span>
            )}

            {report.level && (
              <span className="capitalize text-zinc-500">• {report.level}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/[0.07] pt-3 sm:justify-end sm:border-0 sm:pt-0">
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Maturity score</p>
          <span
            className={`mt-1 inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${scoreColor}`}
          >
            {report.maturityScore}/100
          </span>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          Open report
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
