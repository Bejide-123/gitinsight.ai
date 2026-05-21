// services/analysis.service.ts

import type { AnalysisContext } from "@/types/analysis";
import type { GitHubRepoData } from "@/types/github";
import { selectFilesToAnalyze } from "./github-service";

export function buildAnalysisContext(
  repoData: GitHubRepoData
): AnalysisContext {

  return {
    repo: repoData,

    selectedFiles: selectFilesToAnalyze(repoData.fileTree),

    warnings: [],

    architecturePatterns: [],
  };
}