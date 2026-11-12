import { useQuery } from "@tanstack/react-query";
import type { Analysis } from "@/types/analysis";
import { getCsrfToken } from "@/services/auth-service";

interface AnalyzeRepoResponse {
  success: boolean;
  data?: Analysis;
  reportId?: string;
  chatId?: string;
  suggestedQuestions?: string[];
  error?: string;
}

export function useRepositoryAnalysis(repoUrl: string | null) {
  return useQuery({
    queryKey: ["repoAnalysis", repoUrl],
    queryFn: async (): Promise<AnalyzeRepoResponse> => {
      if (!repoUrl) {
        throw new Error("Repository URL is required");
      }
      
      console.log(`[ANALYSE HOOK] Starting analysis for: ${repoUrl}`);
      const csrfToken = getCsrfToken();
      
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || '',
        },
        body: JSON.stringify({ repoUrl }),
      });
      
      console.log(`[ANALYSE HOOK] Response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 401) {
          console.error(`[ANALYSE HOOK] Received 401 Unauthorized`);
          // Redirect to login page
          window.location.href = "/login";
          throw new Error("Unauthorized");
        }
        if (response.status === 403) {
          console.error(`[ANALYSE HOOK] Received 403 Forbidden (likely CSRF token issue)`);
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze repository");
      }

      console.log(`[ANALYSE HOOK] Analysis completed successfully`);
      const data = await response.json();

      return data;
    },
    enabled: !!repoUrl, // The query will not run until the repoUrl is available
  });
}
