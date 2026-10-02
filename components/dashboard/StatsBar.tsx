import { Activity, Clock3, GitFork, Gauge } from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";

interface StatsBarProps {
  stats: DashboardStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    {
      label: "Analyses completed",
      value: stats.totalAnalyses.toLocaleString(),
      detail: "All-time reviews",
      icon: Activity,
      color: "text-cyan-300",
    },
    {
      label: "Average maturity",
      value: stats.averageScore === null ? "—" : `${stats.averageScore.toFixed(1)}%`,
      detail: "Across your analyses",
      icon: Gauge,
      color: "text-emerald-300",
    },
    {
      label: "Latest score",
      value: stats.latestScore === null ? "—" : `${stats.latestScore}%`,
      detail: "Most recent analysis",
      icon: Clock3,
      color: "text-amber-200",
    },
    {
      label: "Repositories",
      value: stats.trackedRepositories.toLocaleString(),
      detail: "Analyzed repositories",
      icon: GitFork,
      color: "text-rose-200",
    },
  ];

  return (
    <section className="border-b border-white/[0.08] bg-[#0a0d10]">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-2 divide-x divide-y divide-white/[0.08] px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
        {items.map(({ label, value, detail, icon: Icon, color }) => (
          <div key={label} className="min-w-0 px-3 py-4 sm:px-5 sm:py-5">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="truncate">{label}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-white sm:text-3xl">
              {value}
            </p>
            <p className="mt-1 truncate text-xs text-zinc-500">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}