import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, GitBranch } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { HistoryReport } from "@/services/history-service";

interface RepoCardProps {
  report: HistoryReport;
  onOpen: () => void;
}

export function RepoCard({ report, onOpen }: RepoCardProps) {
  const score = Math.max(0, Math.min(100, report.maturityScore));
  const scoreColor = score >= 80
    ? "text-emerald-300 border-emerald-300/20 bg-emerald-300/[0.08]"
    : score >= 60
      ? "text-cyan-200 border-cyan-200/20 bg-cyan-200/[0.08]"
      : "text-amber-200 border-amber-200/20 bg-amber-200/[0.08]";
  const analyzedAt = new Date(report.analyzedAt);
  const timeLabel = Number.isNaN(analyzedAt.getTime())
    ? "Date unavailable"
    : formatDistanceToNow(analyzedAt, { addSuffix: true });

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="group flex min-w-0 flex-col gap-4 rounded-lg border border-white/[0.09] bg-[#0d1115] p-4 transition-colors hover:border-white/20 hover:bg-[#10161a] sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.04] text-zinc-300">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-cyan-100">
            {report.repoName}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {timeLabel}
            </span>
            {report.level && <span className="capitalize">{report.level}</span>}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/[0.07] pt-3 sm:justify-end sm:border-0 sm:pt-0">
        <div className="text-left sm:text-right">
          <p className="text-[10px] text-zinc-500">Maturity score</p>
          <span className={`mt-1 inline-flex rounded border px-2 py-1 text-xs font-semibold tabular-nums ${scoreColor}`}>
            {report.maturityScore}/100
          </span>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-9 items-center gap-2 rounded border border-white/10 px-3 text-xs font-medium text-zinc-200 transition hover:border-cyan-200/30 hover:bg-cyan-200/[0.06] hover:text-white"
        >
          Open report
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}