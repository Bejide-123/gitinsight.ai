import type { Issue, IssueSeverity } from "./analysis";

export interface PullRequestItem {
  number: number;
  title: string;
  author: string;
  authorAvatar?: string;
  state: "open" | "closed" | "merged";
  htmlUrl: string;
  baseBranch: string;
  headBranch: string;
  createdAt: string;
  updatedAt: string;
  isDraft?: boolean;
}

export interface PullRequestDetails extends PullRequestItem {
  baseSha: string;
  headSha: string;
  additions: number;
  deletions: number;
  changedFilesCount: number;
  body?: string;
}

export type PRFileStatus =
  | "added"
  | "modified"
  | "removed"
  | "renamed"
  | "copied"
  | "changed"
  | "unchanged";

export interface PullRequestFile {
  filename: string;
  status: PRFileStatus;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previousFilename?: string;
}

export interface ParsedDiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  header: string;
  lines: string[];
}

export interface ParsedFileDiff {
  filename: string;
  status: PRFileStatus;
  previousFilename?: string;
  addedLines: number[];
  deletedLines: number[];
  hunks: ParsedDiffHunk[];
}

export type PRFindingState =
  | "introduced"
  | "resolved"
  | "persistent"
  | "worsened"
  | "improved"
  | "collateral_introduced"
  | "collateral_resolved";

export interface SuggestedPatch {
  diffHunk: string;
  beforeCode: string;
  afterCode: string;
  fileName: string;
  startLine: number;
  endLine: number;
}

export interface RemediationGuidance {
  whyItMatters: string;
  exploitScenario?: string;
  steps: string[];
  suggestedPatch?: SuggestedPatch;
  tradeoffs: string[];
  confidence: number;
  ruleId: string;
  autoFixable: boolean;
}

export interface ClassifiedPRFinding {
  state: PRFindingState;
  issue: Issue;
  previousIssue?: Issue;
  fingerprint: string;
  changeSummary: string;
  remediation?: RemediationGuidance;
  introducedInLineRange?: boolean;
  fileStatus?: PRFileStatus;
}

export type PRVerdict = "approved" | "needs_work" | "blocked";

export interface PullRequestAnalysisResult {
  reportId?: string;
  repoUrl: string;
  repoName: string;
  prNumber: number;
  prTitle: string;
  prAuthor: string;
  prAuthorAvatar?: string;
  baseSha: string;
  headSha: string;
  baseBranch: string;
  headBranch: string;
  status: "open" | "closed" | "merged";
  verdict: PRVerdict;
  verdictReason: string;
  scoreDelta: number;
  baseScore: number;
  headScore: number;
  changedFilesCount: number;
  additions: number;
  deletions: number;
  counts: {
    introduced: number;
    resolved: number;
    persistent: number;
    worsened: number;
    improved: number;
  };
  introducedIssues: ClassifiedPRFinding[];
  resolvedIssues: ClassifiedPRFinding[];
  persistentIssues: ClassifiedPRFinding[];
  worsenedIssues: ClassifiedPRFinding[];
  improvedIssues: ClassifiedPRFinding[];
  summary: string;
  analyzedAt: string;
}
