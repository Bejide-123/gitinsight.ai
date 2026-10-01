import { useMemo } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useHistory } from "@/hooks/useHistory";
import type { HistoryReport } from "@/services/history-service";
import type { DashboardStats, DashboardUser } from "@/types/dashboard";

const EMPTY_REPORTS: HistoryReport[] = [];

export function useDashboardStats() {
  const { user: authUser } = useAuth();
  const { data, isLoading, error, refetch } = useHistory();
  const reports = data?.reports ?? EMPTY_REPORTS;

  const user = useMemo<DashboardUser>(() => ({
    username: authUser?.name || authUser?.email?.split("@")[0] || "Your workspace",
    email: authUser?.email || "",
    githubConnected: Boolean(authUser?.githubConnected),
    githubUsername: authUser?.githubUsername,
  }), [authUser]);

  const stats = useMemo<DashboardStats>(() => {
    const scores = reports
      .map((report) => report.maturityScore)
      .filter((score) => Number.isFinite(score));
    const repositories = new Set(
      reports.map((report) => report.repoUrl || report.repoName)
    );

    return {
      totalAnalyses: reports.length,
      averageScore: scores.length
        ? scores.reduce((total, score) => total + score, 0) / scores.length
        : null,
      latestScore: scores[0] ?? null,
      trackedRepositories: repositories.size,
    };
  }, [reports]);

  const technologies = useMemo(
    () => [...new Set(reports.flatMap((report) => report.techStack ?? []))].slice(0, 12),
    [reports]
  );

  return { user, stats, reports, technologies, isLoading, error, refetch };
}