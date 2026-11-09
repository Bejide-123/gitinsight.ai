import type { Issue, IssueSeverity, CategoryScore, ProjectContext } from "./analysis";

export type FindingLifecycleState = "new" | "resolved" | "persistent" | "changed";

export interface FindingChangeDetail {
  previousSeverity?: IssueSeverity;
  newSeverity?: IssueSeverity;
  previousLineNumber?: number;
  newLineNumber?: number;
  previousFile?: string;
  newFile?: string;
}

export interface ComparedFinding {
  state: FindingLifecycleState;
  issue: Issue;
  previousIssue?: Issue;
  changeSummary?: string;
  details?: FindingChangeDetail;
  fingerprint: string;
}

export interface CategoryComparison {
  category: string;
  available: boolean;
  baseScore: number;
  targetScore: number;
  delta: number;
  weight: number;
  baseWeight: number;
  targetWeight: number;
  pointContribution: number;
  status: "improved" | "degraded" | "unchanged";
  issuesSummary: {
    new: number;
    resolved: number;
    persistent: number;
    changed: number;
    totalTarget: number;
  };
}

export interface ScoreAttribution {
  category: string;
  pointContribution: number;
  delta: number;
  explanation: string;
  type: "positive" | "negative" | "neutral";
}

export interface FairnessAssessment {
  intentChanged: boolean;
  categoryWeightsChanged: boolean;
  baseIntent: string;
  targetIntent: string;
  fileScopeChanged: boolean;
  fileDelta: number;
  sameCommit: boolean;
  normalizedScoreDelta: number;
  notices: string[];
}

export interface AnalysisRunMetadata {
  id?: string;
  runId?: string;
  commitSha?: string;
  commitMessage?: string;
  branch?: string;
  commitAuthor?: string;
  analyzedAt: Date | string;
  maturityScore: number;
  level: string;
  isProductionReady: boolean;
  intent?: string;
  selectedFilesCount?: number;
}

export interface AnalysisRunData extends AnalysisRunMetadata {
  categoryScores?: Record<string, CategoryScore | undefined>;
  dangerousIssues?: Issue[];
  missingImprovements?: Issue[];
  criticalBlockers?: string[];
  nextSteps?: string[];
  strengths?: string[];
  projectContext?: ProjectContext;
  techStack?: string[];
}

export interface AnalysisComparisonResult {
  baseRun: AnalysisRunMetadata;
  targetRun: AnalysisRunMetadata;
  overallDelta: number;
  levelChanged: boolean;
  readinessChanged: boolean;
  categoryComparisons: Record<string, CategoryComparison>;
  findings: {
    all: ComparedFinding[];
    new: ComparedFinding[];
    resolved: ComparedFinding[];
    persistent: ComparedFinding[];
    changed: ComparedFinding[];
    counts: {
      total: number;
      new: number;
      resolved: number;
      persistent: number;
      changed: number;
    };
  };
  attributions: ScoreAttribution[];
  summary: string;
  fairness: FairnessAssessment;
}
