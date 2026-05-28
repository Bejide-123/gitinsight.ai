// services/testingAnalyser-service.ts

import type { Issue, IssueSeverity } from '@/types/analysis';
import type { FileTreeItem } from '@/types/github';

/**
 * Analyzes the file tree for testing-related issues.
 */
export function analyzeTesting(fileTree: FileTreeItem[]): Issue[] {
  const issues: Issue[] = [];

  const testFilePatterns = [
    '.test.ts', '.test.tsx', '.spec.ts', '.spec.tsx',
    '__tests__/', 'tests/', 'e2e/', 'cypress/', 'jest.config.', 'vitest.config.',
  ];

  const hasTestFiles = fileTree.some(file =>
    testFilePatterns.some(pattern => file.path.includes(pattern))
  );

  if (!hasTestFiles) {
    issues.push({
      category: 'Testing',
      severity: 'high',
      title: 'No Test Files Found',
      description: 'The repository appears to lack any dedicated test files. This significantly increases the risk of introducing bugs and makes refactoring difficult.',
      isDangerous: false,
      impact: 'High risk of regressions, difficult maintenance, unreliable codebase.',
      recommendation: 'Implement a testing strategy, starting with unit tests for critical components and integration tests for key functionalities. Consider popular frameworks like Jest, Vitest, React Testing Library, or Cypress.',
      evidence: ['No common test file patterns found in the repository.'],
    });
  } else {
    // TODO: More sophisticated checks could go here, e.g., test file density,
    // presence of CI/CD for tests (though CI/CD is also a complexity signal)
  }

  return issues;
}

/**
 * Calculates a testing score based on identified issues.
 * A higher score means better testing practices.
 */
export function calculateTestingScore(issues: Issue[]): number {
  if (issues.some(issue => issue.category === 'Testing' && issue.title === 'No Test Files Found')) {
    return 0; // If no test files, score is 0
  }

  let score = 100; // Start with a perfect score

  // Deduct points for other testing-related issues (if any were added)
  // Example: issues.forEach(issue => { if (issue.category === 'Testing') score -= 20; });

  return Math.max(0, score);
}
