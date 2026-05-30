// lib/scoringWeights.ts

import type { ProjectIntent, ScoringWeights } from '@/types/analysis';

/**
 * Context-aware scoring weights
 * Different project types care about different things
 */
export const SCORING_WEIGHTS: Record<ProjectIntent, ScoringWeights> = {
  // ========================================
  // PORTFOLIO PROJECT
  // ========================================
  portfolio: {
    security: 0.15,        // Still important
    architecture: 0.15,
    errorHandling: 0.05,   // Not critical
    performance: 0.15,
    testing: 0.05,         // Not expected
    documentation: 0.10,
    devops: 0.05,          // Just needs deployment
    codeQuality: 0.20,     // Clean code matters
    functionality: 0.10,
  },

  // ========================================
  // LEARNING PROJECT
  // ========================================
  learning: {
    security: 0.05,        // Not priority
    architecture: 0.25,    // Learning structure
    errorHandling: 0.05,
    performance: 0.05,
    testing: 0.05,         // Not expected
    documentation: 0.20,   // Comments matter
    devops: 0.05,
    codeQuality: 0.25,     // Learning best practices
    functionality: 0.05,
  },

  // ========================================
  // MVP / STARTUP
  // ========================================
  mvp: {
    security: 0.20,        // Important
    architecture: 0.15,
    errorHandling: 0.15,
    performance: 0.10,
    testing: 0.10,         // Some testing
    documentation: 0.05,
    devops: 0.05,
    codeQuality: 0.10,
    functionality: 0.10,   // Features matter
  },

  // ========================================
  // STARTUP (Post-MVP)
  // ========================================
  startup: {
    security: 0.20,
    architecture: 0.15,
    errorHandling: 0.15,
    performance: 0.10,
    testing: 0.15,         // More important now
    documentation: 0.05,
    devops: 0.10,
    codeQuality: 0.05,
    functionality: 0.05,
  },

  // ========================================
  // PRODUCTION SAAS
  // ========================================
  'production-saas': {
    security: 0.25,        // CRITICAL
    architecture: 0.15,
    errorHandling: 0.15,
    performance: 0.10,
    testing: 0.20,         // CRITICAL
    documentation: 0.05,
    devops: 0.05,
    codeQuality: 0.05,
    functionality: 0.00,   // Assumed complete
  },

  // ========================================
  // ENTERPRISE
  // ========================================
  enterprise: {
    security: 0.30,        // TOP PRIORITY
    architecture: 0.15,
    errorHandling: 0.10,
    performance: 0.10,
    testing: 0.20,         // CRITICAL
    documentation: 0.10,
    devops: 0.05,
    codeQuality: 0.00,
    functionality: 0.00,
  },

  // ========================================
  // OPEN SOURCE LIBRARY
  // ========================================
  'open-source-library': {
    security: 0.10,
    architecture: 0.15,
    errorHandling: 0.10,
    performance: 0.10,
    testing: 0.25,         // CRITICAL for libraries
    documentation: 0.25,   // CRITICAL
    devops: 0.05,
    codeQuality: 0.00,
    functionality: 0.00,
  },
};

/**
 * Get scoring weights for a project type
 */
export function getScoringWeights(intent: ProjectIntent): ScoringWeights {
  return SCORING_WEIGHTS[intent];
}

/**
 * Calculate weighted maturity score
 */
export function calculateMaturityScore(
  categoryScores: Record<string, number>,
  weights: ScoringWeights
): number {
  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(weights).forEach(([category, weight]) => {
    if (categoryScores[category] !== undefined) {
      totalScore += categoryScores[category] * weight;
      totalWeight += weight;
    }
  });

  // Normalize to 0-100
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}