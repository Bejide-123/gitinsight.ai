// types/analysis.ts

import type { GitHubRepoData } from "./github";

// ============================================================================
// PROJECT INTENT & CONTEXT
// ============================================================================

export type ProjectIntent = 
  | 'portfolio'
  | 'learning'
  | 'mvp'
  | 'startup'
  | 'production-saas'
  | 'enterprise'
  | 'open-source-library';

export interface ProjectContext {
  intent: ProjectIntent;
  confidence: number; // 0-100
  signals: string[];
  expectedFeatures: string[];
  notRequiredFeatures: string[];
}

// ============================================================================
// ISSUES & SEVERITY
// ============================================================================

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Issue {
  category: string; // 'Security', 'Architecture', 'Performance', etc.
  severity: IssueSeverity;
  title: string;
  description: string;
  isDangerous: boolean; // true = security/safety, false = quality
  impact: string;
  recommendation: string;
  evidence: string[]; // Code snippets or examples
  file?: string; // File where issue was found
  lineNumber?: number; // Optional line number
}

// ============================================================================
// CATEGORY SCORING
// ============================================================================

export interface CategoryScore {
  score: number; // 0-100
  weight: number; // 0-1 (how important this category is)
  issues: Issue[];
  strengths?: string[]; // What's good in this category
}

// ============================================================================
// COMPLETE ANALYSIS RESULT
// ============================================================================

export interface AIInsightsData {
  executiveSummary: string;
  recommendations: {
    title: string;
    description: string;
    impact: "High Impact" | "Medium Impact" | "Low Impact";
    impactScore: number;
    difficulty: number;
    priority: 1 | 2 | 3;
  }[];
  productionVerdict: string;
  roadmapPhases: {
    number: number;
    title: string;
    description: string;
    status: "completed" | "active" | "upcoming" | "future";
    tags?: string[];
  }[];
  architecturalStrengths: string[];
  criticalWeaknesses: string[];
  longTermOutlook: string;
  sentimentScore: number;
  techStack?: string[];
  capabilities?: {
    name: string;
    status: "pass" | "missing" | "incomplete";
  }[];
  productionCategories?: {
    title: string;
    items: {
      label: string;
      status: "pass" | "warn" | "fail";
    }[];
  }[];
}
export interface Analysis {
  // ===== Identification =====
  repoUrl: string;
  repoName: string;
  analyzedAt: Date;

  // ===== Project Context =====
  projectContext: ProjectContext;

  // ===== Overall Score =====
  maturityScore: number; // 0-100 (weighted average)
  level: string; // "Portfolio Project", "MVP - Feature Complete", etc.
  isProductionReady: boolean;

  // ===== Tech Stack =====
  techStack: string[];

  // ===== Category Scores =====
  categoryScores: {
    security?: CategoryScore;
    architecture?: CategoryScore;
    errorHandling?: CategoryScore;
    performance?: CategoryScore;
    testing?: CategoryScore;
    documentation?: CategoryScore;
    devops?: CategoryScore;
    codeQuality?: CategoryScore;
    functionality?: CategoryScore;
    completeness?: CategoryScore;
    readiness?: CategoryScore;
    maintainability?: CategoryScore;
  };

  // ===== Issues (Separated by Type) =====
  dangerousIssues: Issue[]; // Security/safety problems (production blockers)
  missingImprovements: Issue[]; // Quality issues (not dangerous)

  // ===== Strengths =====
  strengths: string[];
  fileTreeStructure?: any[];
  selectedFilesCount?: number;

  // ===== Recommendations =====
  criticalBlockers: string[]; // Must fix before production
  nextSteps: string[]; // Suggested improvements
  aiInsights?: AIInsightsData | null // AI-generated recommendations (from Claude API)
}

// ============================================================================
// ANALYSIS CONTEXT (Internal Use)
// ============================================================================

export interface AnalysisContext {
  repo: GitHubRepoData;
  codeFiles: Record<string, string>; // path -> content
  selectedFiles: string[];
  projectContext: ProjectContext;
  warnings: string[]; // Any issues encountered during analysis (e.g. missing README)
}

// ============================================================================
// SCORING WEIGHTS (Context-Aware)
// ============================================================================

export type ScoringWeights = {
  security: number;
  architecture: number;
  errorHandling: number;
  performance: number;
  testing: number;
  documentation: number;
  devops: number;
  codeQuality: number;
  functionality: number;
};