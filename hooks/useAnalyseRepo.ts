import { useQuery } from "@tanstack/react-query";
import type { Analysis } from "@/types/analysis";

interface AnalyzeRepoResponse {
  success: boolean;
  data?: Analysis;
  reportId?: string;
  chatId?: string;
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
      console.log(`[ANALYSE HOOK] Checking for auth token in cookies`);
      const authCookies = document.cookie.split(';').map(c => c.trim());
      const hasTokenCookie = authCookies.some(c => c.startsWith('token=') || c.startsWith('auth_token='));
      console.log(`[ANALYSE HOOK] Auth cookie found: ${hasTokenCookie}`);
      
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        const error = await response.json();
        throw new Error(error.error || "Failed to analyze repository");
      }

      console.log(`[ANALYSE HOOK] Analysis completed successfully`);
      return response.json();
    },
    enabled: !!repoUrl, // The query will not run until the repoUrl is available
  });
}

