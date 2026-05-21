// src/services/architectureAnalyzer.service.ts

import type { Issue } from '@/types/analysis';
import type { FileTreeItem } from '@/types/github';

/**
 * Analyze code architecture issues
 */
export function analyzeArchitectureIssues(
  codeFiles: Record<string, string>,
  fileTree: FileTreeItem[]
): Issue[] {
  const issues: Issue[] = [];

  // 1. Large file detection
  Object.entries(codeFiles).forEach(([filePath, content]) => {
    const lines = content.split('\n').length;

    if (lines > 2000) {
      issues.push({
        category: 'Architecture',
        severity: 'critical',
        title: 'Critically Large File',
        description: `${filePath} has ${lines} lines`,
        isDangerous: false,
        impact: 'Extremely hard to maintain, debug, and test',
        recommendation: 'Break into multiple smaller files (< 500 lines each)',
        evidence: [],
        file: filePath,
      });
    } else if (lines > 1000) {
      issues.push({
        category: 'Architecture',
        severity: 'high',
        title: 'Large File',
        description: `${filePath} has ${lines} lines`,
        isDangerous: false,
        impact: 'Hard to maintain and understand',
        recommendation: 'Consider splitting into smaller components',
        evidence: [],
        file: filePath,
      });
    } else if (lines > 500) {
      issues.push({
        category: 'Architecture',
        severity: 'medium',
        title: 'File Getting Large',
        description: `${filePath} has ${lines} lines`,
        isDangerous: false,
        impact: 'May become hard to maintain',
        recommendation: 'Monitor and consider splitting if it grows',
        evidence: [],
        file: filePath,
      });
    }
  });

  // 2. No services folder (for projects with API calls)
  const hasApiCalls = Object.values(codeFiles).some(content => 
    content.includes('fetch(') || content.includes('axios')
  );
  const hasServicesFolder = fileTree.some(f => f.path.includes('/services/'));

  if (hasApiCalls && !hasServicesFolder) {
    issues.push({
      category: 'Architecture',
      severity: 'medium',
      title: 'No Services Layer',
      description: 'API calls found but no services folder detected',
      isDangerous: false,
      impact: 'Business logic mixed with UI components',
      recommendation: 'Create a services/ folder and move API calls there',
      evidence: [],
    });
  }

  return issues;
}

export function calculateArchitectureScore(issues: Issue[]): number {
  let score = 100;

  issues.forEach((issue) => {
    if (issue.severity === 'critical') score -= 30;
    else if (issue.severity === 'high') score -= 20;
    else if (issue.severity === 'medium') score -= 10;
  });

  return Math.max(0, score);
}