import { useMemo, useState } from "react";
import type { Repo } from "@/types/dashboard";

const MOCK_REPOS: Repo[] = [
  {
    id: "1",
    name: "core-engine-v4",
    visibility: "PRIVATE",
    language: "TypeScript",
    languageColor: "bg-blue-400",
    languageGlow: "shadow-[0_0_6px_rgba(96,165,250,0.6)]",
    updatedAt: "4h ago",
    commits: 894,
    tier: ["recent", "popular"],
  },
  {
    id: "2",
    name: "gateway-service",
    visibility: "PUBLIC",
    language: "Go",
    languageColor: "bg-emerald-400",
    languageGlow: "shadow-[0_0_6px_rgba(52,211,153,0.6)]",
    updatedAt: "2d ago",
    commits: 1240,
    tier: ["recent", "popular"],
  },
  {
    id: "3",
    name: "auth-provider",
    visibility: "PRIVATE",
    language: "JavaScript",
    languageColor: "bg-yellow-400",
    languageGlow: "shadow-[0_0_6px_rgba(250,204,21,0.6)]",
    updatedAt: "1w ago",
    commits: 423,
    tier: ["recent"],
  },
  {
    id: "4",
    name: "data-pipeline",
    visibility: "EXPERIMENTAL",
    language: "Python",
    languageColor: "bg-blue-300",
    languageGlow: "shadow-[0_0_6px_rgba(147,197,253,0.6)]",
    updatedAt: "2w ago",
    commits: 312,
    tier: ["recent", "popular"],
  },
];

export type RepoFilter = "recent" | "popular";

export function useRepos() {
  const [filter, setFilter] = useState<RepoFilter>("recent");

  const filtered = useMemo(
    () => MOCK_REPOS.filter((r) => r.tier.includes(filter)),
    [filter]
  );

  return { repos: filtered, allRepos: MOCK_REPOS, filter, setFilter };
}