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
          <h2 className="text-lg font-semibold text-white">Recent analyses</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {reports.length} {reports.length === 1 ? "analysis" : "analyses"} in your history
          </p>
        </div>
        <label className="flex h-10 w-full items-center gap-2 rounded border border-white/10 bg-white/[0.03] px-3 text-zinc-400 focus-within:border-cyan-300/40 sm:max-w-[260px]">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search repositories"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
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
          <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 px-6 py-10 text-center">
            <p className="text-base font-medium text-white">No analyses yet</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Run your first repository review to see health scores and history here.
            </p>
            <button
              type="button"
              onClick={onNewAnalysis}
              className="mt-5 rounded bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-cyan-200"
            >
              Start an analysis
            </button>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-lg border border-white/10 px-5 py-10 text-center text-sm text-zinc-500">
            No repository names match “{search}”.
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