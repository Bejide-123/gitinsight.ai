import { getAuthToken } from "./auth-service";
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
  const token = getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`/api/analysis/${reportId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to fetch analysis");
  }

  return response.json();
};