// hooks/useHistory.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getHistory, type HistoryReport } from "@/services/history-service";

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
    staleTime: 1000 * 60 * 2, // treat as fresh for 2 minutes
    retry: 1,
  });
}

/**
 * Pull just the recent repos from history for the sidebar display.
 * Returns the 5 most recent reports sorted by date.
 */
export function useRecentRepos() {
  const { data, isLoading, error } = useHistory();

  const recentRepos: HistoryReport[] = (data?.reports ?? [])
    .slice()
    .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
    .slice(0, 5);

  return { recentRepos, isLoading, error };
}