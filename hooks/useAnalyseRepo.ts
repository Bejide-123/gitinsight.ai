import { useQuery } from "@tanstack/react-query";
import type { Analysis } from "@/types/analysis";

interface AnalyzeRepoInput {
  repoUrl: string;
}

interface AnalyzeRepoResponse {
  success: boolean;
  data?: Analysis;
  error?: string;
}

export function useRepositoryAnalysis(repoUrl: AnalyzeRepoInput | null) {
  return useQuery({
    queryKey: ['repoAnalysis', repoUrl],
    queryFn: async (): Promise<AnalyzeRepoResponse> => {
      if (!repoUrl) {
        throw new Error("Repository URL is required");
      }
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze repository');
      }

      return response.json();
    },
    enabled: !!repoUrl, // The query will not run until the repoUrl is available
  });
}
