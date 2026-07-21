// services/history-service.ts

import { getAuthToken } from "@/services/auth-service";

export interface HistoryChat {
  _id: string;
  userId: string;
  createdAt: string;
  messages: {
    role: string;
    content: string;
  }[];
  report: HistoryReport | null;
}

export interface HistoryReport {
  _id: string;
  userId: string;
  repoName: string;
  repoUrl: string;
  maturityScore: number;
  level: string;
  analyzedAt: string;
  projectContext: {
    intent: string;
    confidence: number;
  };
}

export interface HistoryResponse {
  success: boolean;
  reports: HistoryReport[];
  chats: HistoryChat[];
}

/**
 * Fetch the current user's analysis history.
 * Sends the JWT from the auth cookie in the Authorization header
 * so the /api/history route can verify identity.
 */
export const getHistory = async (): Promise<HistoryResponse> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("/api/history", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to fetch history");
  }

  return response.json();
};