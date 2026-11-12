// services/history-service.ts

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
  commitSha?: string;
  commitMessage?: string;
  branch?: string;
  commitAuthor?: string;
  commitDate?: string;
  runs?: any[];
  techStack?: string[];
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
 * Sends the HTTP-only auth cookie so the route can verify identity.
 */
export const getHistory = async (): Promise<HistoryResponse> => {
  const response = await fetch("/api/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.error || "Failed to fetch history");
  }

  return response.json();
};
