import type { Analysis } from "@/types/analysis";

interface AnalysisResponse {
  success: boolean;
  report: Analysis;
  chat: {
    _id: string;
    messages: { role: string; content: string }[];
  } | null;
}


export const getRepoAnalysis = async (reportId: string): Promise<AnalysisResponse> => {
  const response = await fetch(`/api/analysis/${reportId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to fetch analysis");
  }

  return response.json();
};