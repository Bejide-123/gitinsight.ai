import { useMutation } from "@tanstack/react-query";
import type { Analysis } from "@/types/analysis";

interface AnalyzeRepoInput {
  repoUrl: string;
}

interface AnalyzeRepoResponse {
  success: boolean;
  data?: Analysis;
  error?: string;
}

export function useRepositoryAnalysis() {
  return useMutation({
    mutationFn: async (input: AnalyzeRepoInput): Promise<AnalyzeRepoResponse> => {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze repository');
      }

      return response.json();
    },
  });
}