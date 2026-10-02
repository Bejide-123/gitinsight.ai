"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ChatAppShell } from "@/components/chat/ChatAppShell";
import { GitHubRepositories } from "./GitHubRepositories";
import type { HistoryReport } from "@/services/history-service";
import { DashboardHero } from "./DashboardHero";
import { StatsBar } from "./StatsBar";
import { RepoList } from "./RepoList";
import { AchievementsCard } from "./AchievementsCard";
import { EngineeringStack } from "./EngineeringStack";
import { QuickActionsCard } from "./QuickActionsCard";
import { DashboardFooter } from "./DashboardFooter";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export function DashboardLayout() {
  const router = useRouter();
  const { user, stats, reports, technologies, isLoading, error, refetch } =
    useDashboardStats();

  const openReport = (report: HistoryReport) => {
    router.push(
      `/chat/${encodeURIComponent(report._id)}?repoUrl=${encodeURIComponent(report.repoUrl)}`
    );
  };

  return (
    <ChatAppShell>
      <div className="min-h-full bg-[#07090c]">
        <DashboardHero user={user} />
        <StatsBar stats={stats} />

        {error && (
          <div className="mx-auto mb-6 flex w-[calc(100%-2rem)] max-w-[1440px] items-center justify-between gap-4 rounded-lg border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-100 sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)]">
            <span className="flex min-w-0 items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-300" />
              <span>Couldn’t load your analysis history.</span>
            </span>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex shrink-0 items-center gap-2 rounded border border-red-200/20 px-3 py-1.5 text-xs text-red-100 transition hover:bg-red-200/10"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)] lg:gap-8 lg:px-8 lg:py-9">
          <div className="flex min-w-0 flex-col gap-8">
            {!error && (
              <RepoList
                reports={reports}
                isLoading={isLoading}
                onOpenReport={openReport}
                onNewAnalysis={() => router.push("/chat")}
              />
            )}
            <GitHubRepositories connected={user.githubConnected} />
          </div>

          <aside className="flex min-w-0 flex-col gap-5">
            <AchievementsCard
              totalAnalyses={stats.totalAnalyses}
              averageScore={stats.averageScore}
              trackedRepositories={stats.trackedRepositories}
            />
            <EngineeringStack technologies={technologies} />
            <QuickActionsCard />
          </aside>
        </section>

        <DashboardFooter />
      </div>
    </ChatAppShell>
  );
}