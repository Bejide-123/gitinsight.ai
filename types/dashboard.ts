export interface DashboardUser {
  username: string;
  email: string;
  githubConnected: boolean;
  githubUsername?: string | null;
}

export interface DashboardStats {
  totalAnalyses: number;
  averageScore: number | null;
  latestScore: number | null;
  trackedRepositories: number;
}

export type RepoVisibility = "PRIVATE" | "PUBLIC" | "EXPERIMENTAL";

export interface Repo {
  id: string;
  name: string;
  visibility: RepoVisibility;
  language: string;
  languageColor: string;
  languageGlow: string;
  updatedAt: string;
  commits: number;
  tier: Array<"recent" | "popular">;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  accent: "purple" | "cyan" | "white";
}

export interface StackChip {
  label: string;
  accent: string;
}