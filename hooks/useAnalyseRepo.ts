import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/services/auth-service";
import type { Analysis } from "@/types/analysis";

interface AnalyzeRepoInput {
  repoUrl: string;
}

interface AnalyzeRepoResponse {
  success: boolean;
  data?: Analysis;
  reportId?: string;
  chatId?: string;
  error?: string;
}

export function useRepositoryAnalysis(repoUrl: AnalyzeRepoInput | null) {
  return useQuery({
    queryKey: ["repoAnalysis", repoUrl],
    queryFn: async (): Promise<AnalyzeRepoResponse> => {
      if (!repoUrl) {
        throw new Error("Repository URL is required");
      }
      const token = getAuthToken();
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to analyze repository";
        try {
          const error = await response.json();
          errorMessage = error?.error || error?.message || errorMessage;
        } catch (jsonError) {
          const text = await response.text();
          errorMessage = text?.trim().slice(0, 200) || errorMessage;
        }
        throw new Error(errorMessage);
        try {
          const error = await response.json();
          errorMessage = error?.error || error?.message || errorMessage;
        } catch (jsonError) {
          const text = await response.text();
          errorMessage = text?.trim().slice(0, 200) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch (jsonError) {
        const text = await response.text();
        throw new Error(
          text?.trim().slice(0, 200) || "Invalid JSON response from analysis API"
        );
      }
    },
    enabled: !!repoUrl, // The query will not run until the repoUrl is available
  });
}

