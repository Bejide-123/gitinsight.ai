"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { HistoryReport } from "@/services/history-service";
import { RepoCard } from "./RepoCard";
import { RepoSkeleton } from "./RepoSkeleton";

interface RepoListProps {
  reports: HistoryReport[];
  isLoading?: boolean;
  onOpenReport: (report: HistoryReport) => void;
  onNewAnalysis: () => void;
}

export function RepoList({
  reports,
  isLoading = false,
  onOpenReport,
  onNewAnalysis,
}: RepoListProps) {
  const [search, setSearch] = useState("");
  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return reports;
    return reports.filter((report) =>
      report.repoName.toLowerCase().includes(normalizedSearch)
    );
  }, [reports, search]);

  return (
    <section className="min-w-0">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Recent analyses</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {reports.length} {reports.length === 1 ? "analysis" : "analyses"} in your history
          </p>
        </div>
        <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-zinc-400 focus-within:border-white/20 sm:max-w-[240px]">
          <Search className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repositories"
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-600"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <>
            <RepoSkeleton />
            <RepoSkeleton />
            <RepoSkeleton />
          </>
        ) : reports.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 px-6 py-10 text-center">
            <p className="text-sm font-medium text-white">No analyses yet</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">
              Run your first repository review to see health scores and history here.
            </p>
            <button
              type="button"
              onClick={onNewAnalysis}
              className="mt-4 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
            >
              Start an analysis
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-xl border border-white/10 px-5 py-10 text-center text-xs text-zinc-500">
            No repository names match &ldquo;{search}&rdquo;.
          </div>
        ) : (
          filteredReports.map((report) => (
            <RepoCard
              key={report._id}
              report={report}
              onOpen={() => onOpenReport(report)}
            />
          ))
        )}
      </div>
    </section>
  );
}
