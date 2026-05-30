// services/testingAnalyser-service.ts

import type { Issue } from '@/types/analysis';
import type { FileTreeItem } from '@/types/github';

interface TestingAnalysisResult {
  issues: Issue[];
  score: number;
  hasTestFiles: boolean;
  testFrameworks: string[];
  testingTypes: {
    unit: boolean;
    integration: boolean;
    e2e: boolean;
    performance: boolean;
    accessibility: boolean;
  };
  hasCoverageConfig: boolean;
  hasCIIntegration: boolean;
  testFileDensity: number;
}

/**
 * Detects testing frameworks used in the project
 */
function detectTestFrameworks(fileTree: FileTreeItem[]): string[] {
  const frameworks: Set<string> = new Set();
  
  const frameworkPatterns: Record<string, string[]> = {
    Jest: ['jest.config.', '__tests__/', '.jest.'],
    Vitest: ['vitest.config.', '.vitest.'],
    'React Testing Library': ['.test.tsx', '.test.jsx', '@testing-library/react'],
    Mocha: ['mocha.opts', '.mocharc.', 'test/'],
    Jasmine: ['jasmine.json', 'spec.ts', 'spec.js'],
    Cypress: ['cypress.config.', 'cypress/e2e/', 'cypress/specs/'],
    Playwright: ['playwright.config.', 'tests/e2e/'],
    'Testing Library': ['@testing-library'],
    Chai: ['chai', 'expect('],
    Sinon: ['sinon', 'stub(', 'mock('],
  };

  fileTree.forEach(file => {
    Object.entries(frameworkPatterns).forEach(([framework, patterns]) => {
      if (patterns.some(pattern => file.path.toLowerCase().includes(pattern.toLowerCase()))) {
        frameworks.add(framework);
      }
    });
  });

  return Array.from(frameworks);
}

/**
 * Detects types of tests present in the project
 */
function detectTestingTypes(fileTree: FileTreeItem[]): TestingAnalysisResult['testingTypes'] {
  return {
    unit: fileTree.some(file => 
      file.path.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/) && 
      !file.path.includes('e2e') && 
      !file.path.includes('integration')
    ),
    integration: fileTree.some(file => 
      file.path.includes('integration') && 
      file.path.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)
    ),
    e2e: fileTree.some(file => 
      (file.path.includes('e2e') || file.path.includes('cypress') || file.path.includes('playwright')) &&
      file.path.match(/\.(test|spec|cy)\.(ts|tsx|js|jsx)$/)
    ),
    performance: fileTree.some(file => 
      file.path.includes('performance') || 
      file.path.includes('benchmark') ||
      file.path.includes('perf.')
    ),
    accessibility: fileTree.some(file => 
      file.path.includes('a11y') || 
      file.path.includes('accessibility') ||
      file.path.includes('axe')
    ),
  };
}

/**
 * Checks for test coverage configuration
 */
function detectCoverageConfig(fileTree: FileTreeItem[]): boolean {
  const coveragePatterns = [
    'coverage/',
    '.nyc_output',
    'coveragerc',
    'jest.config.',
    'c8.config.',
    'vitest.config.',
    'codecov.yml',
  ];

  return fileTree.some(file =>
    coveragePatterns.some(pattern => file.path.toLowerCase().includes(pattern.toLowerCase()))
  );
}

/**
 * Checks for CI/CD integration with testing
 */
function detectCIIntegration(fileTree: FileTreeItem[]): boolean {
  const ciPatterns = [
    '.github/workflows/',
    '.gitlab-ci.yml',
    '.circleci/',
    'azure-pipelines.yml',
    'travis.yml',
    'bitbucket-pipelines.yml',
    'Jenkinsfile',
  ];

  return fileTree.some(file =>
    ciPatterns.some(pattern => file.path.includes(pattern))
  );
}

/**
 * Calculates test file density (ratio of test files to source files)
 */
function calculateTestFileDensity(fileTree: FileTreeItem[]): number {
  const testFiles = fileTree.filter(file =>
    file.path.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)
  ).length;

  const sourceFiles = fileTree.filter(file =>
    file.path.match(/\.(ts|tsx|js|jsx)$/) &&
    !file.path.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/)
  ).length;

  if (sourceFiles === 0) return 0;
  
  // Ideal ratio is about 1:1 or higher (more tests is better)
  // Return as percentage of ideal
  const ratio = testFiles / sourceFiles;
  return Math.min(100, (ratio / 1) * 100);
}

/**
 * Analyzes the file tree for testing-related issues and practices
 */
export function analyzeTesting(fileTree: FileTreeItem[]): TestingAnalysisResult {
  const issues: Issue[] = [];

  const testFilePatterns = [
    '.test.ts', '.test.tsx', '.test.js', '.test.jsx',
    '.spec.ts', '.spec.tsx', '.spec.js', '.spec.jsx',
    '__tests__/', 'tests/', 'e2e/', 'cypress/', 'playwright/',
    'jest.config.', 'vitest.config.', 'mocha.',
  ];

  const hasTestFiles = fileTree.some(file =>
    testFilePatterns.some(pattern => file.path.includes(pattern))
  );

  const testFrameworks = detectTestFrameworks(fileTree);
  const testingTypes = detectTestingTypes(fileTree);
  const hasCoverageConfig = detectCoverageConfig(fileTree);
  const hasCIIntegration = detectCIIntegration(fileTree);
  const testFileDensity = calculateTestFileDensity(fileTree);

  // Issue 1: No Test Files
  if (!hasTestFiles) {
    issues.push({
      category: 'Testing',
      severity: 'critical',
      title: 'No Test Files Found',
      description: 'The repository appears to lack any dedicated test files. This significantly increases the risk of introducing bugs and makes refactoring difficult.',
      isDangerous: true,
      impact: 'High risk of regressions, difficult maintenance, unreliable codebase.',
      recommendation: 'Implement a testing strategy, starting with unit tests for critical components and integration tests for key functionalities. Consider popular frameworks like Jest, Vitest, or Vitest + React Testing Library.',
      evidence: ['No common test file patterns found in the repository.'],
    });
  }

  // Issue 2: No Coverage Configuration
  if (hasTestFiles && !hasCoverageConfig) {
    issues.push({
      category: 'Testing',
      severity: 'medium',
      title: 'No Test Coverage Configuration',
      description: 'While test files exist, there is no test coverage configuration found. This makes it difficult to track code quality and identify untested code paths.',
      isDangerous: false,
      impact: 'Inability to measure test coverage, potential blind spots in testing.',
      recommendation: 'Configure test coverage tracking using tools like Jest, Vitest, or c8. Set minimum coverage thresholds (e.g., 80%) and integrate with CI/CD.',
      evidence: ['No coverage configuration files found (jest.config, nyc, c8, etc).'],
    });
  }

  // Issue 3: No CI/CD Integration
  if (hasTestFiles && !hasCIIntegration) {
    issues.push({
      category: 'Testing',
      severity: 'high',
      title: 'Tests Not Integrated in CI/CD Pipeline',
      description: 'Tests exist but are not integrated into the CI/CD pipeline. This means tests may not run automatically on every commit.',
      isDangerous: false,
      impact: 'Reduced test reliability, developers may forget to run tests before pushing.',
      recommendation: 'Set up CI/CD pipelines (GitHub Actions, GitLab CI, CircleCI, etc.) to automatically run tests on every push and pull request.',
      evidence: ['No CI/CD configuration files found in the repository.'],
    });
  }

  // Issue 4: Low Test File Density
  if (hasTestFiles && testFileDensity < 30) {
    issues.push({
      category: 'Testing',
      severity: 'medium',
      title: 'Low Test File Density',
      description: `The ratio of test files to source files is very low (${testFileDensity.toFixed(0)}%). This suggests inadequate test coverage.`,
      isDangerous: false,
      impact: 'Large portions of code may be untested, increasing bug risk.',
      recommendation: 'Increase test coverage by writing more unit and integration tests. Aim for at least a 1:1 ratio of test files to source files.',
      evidence: [`Test file density: ${testFileDensity.toFixed(2)}%`],
    });
  }

  // Issue 5: Only Unit Tests (No E2E)
  if (testingTypes.unit && !testingTypes.e2e && !testingTypes.integration) {
    issues.push({
      category: 'Testing',
      severity: 'low',
      title: 'Limited Test Types (Unit Tests Only)',
      description: 'The project appears to have only unit tests. Integration and E2E tests provide valuable coverage of real-world scenarios.',
      isDangerous: false,
      impact: 'Potential issues in integration points and user workflows may be missed.',
      recommendation: 'Consider adding integration tests (testing multiple components together) and E2E tests (testing full user workflows) using tools like Cypress or Playwright.',
      evidence: ['Unit tests detected, but no integration or E2E tests found.'],
    });
  }

  // Issue 6: No Unit Tests but E2E Only
  if (!testingTypes.unit && testingTypes.e2e) {
    issues.push({
      category: 'Testing',
      severity: 'medium',
      title: 'Missing Unit Tests (E2E Only)',
      description: 'The project relies only on E2E tests. Unit tests are faster and provide better isolation for debugging.',
      isDangerous: false,
      impact: 'Slower test execution, harder to isolate and debug failures.',
      recommendation: 'Add unit tests for business logic, utility functions, and components using Jest or Vitest to complement E2E tests.',
      evidence: ['E2E tests detected, but no unit tests found.'],
    });
  }

  return {
    issues,
    score: calculateTestingScore(issues, hasTestFiles, testFileDensity, testingTypes),
    hasTestFiles,
    testFrameworks,
    testingTypes,
    hasCoverageConfig,
    hasCIIntegration,
    testFileDensity: Math.round(testFileDensity),
  };
}

/**
 * Calculates a comprehensive testing score based on identified issues and practices.
 * A higher score means better testing practices (0-100).
 */
export function calculateTestingScore(
  issues: Issue[],
  hasTestFiles: boolean,
  testFileDensity: number,
  testingTypes: TestingAnalysisResult['testingTypes']
): number {
  if (!hasTestFiles) {
    return 0; // No tests = 0 score
  }

  let score = 70; // Base score for having tests

  // Add points for different test types
  if (testingTypes.unit) score += 10;
  if (testingTypes.integration) score += 8;
  if (testingTypes.e2e) score += 7;
  if (testingTypes.performance) score += 3;
  if (testingTypes.accessibility) score += 2;

  // Add points based on test file density
  if (testFileDensity >= 80) score += 5; // Excellent coverage
  else if (testFileDensity >= 50) score += 3; // Good coverage
  else if (testFileDensity >= 30) score += 1; // Decent coverage

  // Deduct points for issues
  issues.forEach(issue => {
    if (issue.category === 'Testing') {
      if (issue.severity === 'critical') score -= 15;
      else if (issue.severity === 'high') score -= 10;
      else if (issue.severity === 'medium') score -= 5;
      else if (issue.severity === 'low') score -= 2;
    }
  });

  return Math.max(0, Math.min(100, score)); // Keep score between 0-100
}

/**
 * Gets a detailed testing report
 */
export function getTestingReport(fileTree: FileTreeItem[]): TestingAnalysisResult {
  return analyzeTesting(fileTree);
}