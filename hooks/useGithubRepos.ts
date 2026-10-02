import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DashboardGitHubRepository } from "@/types/github";

interface GitHubRepositoriesPage {
  repositories: DashboardGitHubRepository[];
  page: number;
  perPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

async function getGitHubRepositoriesPage(
  page: number,
  perPage: number,
): Promise<GitHubRepositoriesPage> {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  const response = await fetch(`/api/github/repos?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load GitHub repositories.");
  }

  return data;
}

export function useGitHubRepos(enabled: boolean, page: number, perPage: number) {
  return useQuery({
    queryKey: ["github-repositories", page, perPage],
    queryFn: () => getGitHubRepositoriesPage(page, perPage),
    enabled,
    staleTime: 1000 * 60,
    retry: false,
    placeholderData: keepPreviousData,
  });
}