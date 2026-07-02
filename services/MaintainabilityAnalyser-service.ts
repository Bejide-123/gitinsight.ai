// src/services/maintainabilityAnalyzer.service.ts

import type { Issue } from '@/types/analysis';
import type { FileTreeItem } from '@/types/github';

interface MaintainabilityAnalysisResult {
  issues: Issue[];
  score: number;
  maintainabilityMetrics: {
    hasCodeComments: boolean;
    hasFunctionDocumentation: boolean;
    hasConsistentNaming: boolean;
    hasPropTypes: boolean;
    hasErrorHandling: boolean;
    hasLogging: boolean;
    hasDependencyHealth: boolean;
    hasTypeScriptStrict: boolean;
    hasDocumentation: boolean;
    hasVersionManagement: boolean;
    isModular: boolean;
    hasCodeReviewProcess: boolean;
    maintainableItems: number;
    totalItems: number;
  };
}

/**
 * Analyze project maintainability - code quality, sustainability, and long-term health
 */
export function analyzeMaintainability(
  codeFiles: Record<string, string>,
  fileTree: FileTreeItem[],
  packageJson: any
): MaintainabilityAnalysisResult {
  const issues: Issue[] = [];
  const maintainabilityMetrics = {
    hasCodeComments: false,
    hasFunctionDocumentation: false,
    hasConsistentNaming: false,
    hasPropTypes: false,
    hasErrorHandling: false,
    hasLogging: false,
    hasDependencyHealth: false,
    hasTypeScriptStrict: false,
    hasDocumentation: false,
    hasVersionManagement: false,
    isModular: false,
    hasCodeReviewProcess: false,
    maintainableItems: 0,
    totalItems: 12,
  };

  const filePaths = Object.keys(codeFiles);
  const treePathsLower = fileTree.map(f => f.path.toLowerCase());

  // 1. Check for Code Comments
  const commentedLines = Object.values(codeFiles).reduce((count, content) => {
    const comments = content.match(/\/\/|\/\*|\*\//g) || [];
    return count + comments.length;
  }, 0);

  if (commentedLines > 50) {
    maintainabilityMetrics.hasCodeComments = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'low',
      title: 'Insufficient Code Comments',
      description: 'Limited inline comments explaining complex logic.',
      isDangerous: false,
      impact: 'Future maintainers struggle to understand complex code',
      recommendation: 'Add comments explaining "why" not "what". Document complex algorithms and business logic.',
      evidence: [],
    });
  }

  // 2. Check for Function/Type Documentation
  const hasJSDoc = Object.values(codeFiles).some(content =>
    content.includes('/**') || content.includes('@param') || content.includes('@returns')
  );

  const hasTypeScriptDocs = filePaths.some(f => f.endsWith('.ts') || f.endsWith('.tsx')) &&
    hasJSDoc;

  if (hasTypeScriptDocs) {
    maintainabilityMetrics.hasFunctionDocumentation = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'medium',
      title: 'Missing Function Documentation',
      description: 'Functions and types lack JSDoc or inline documentation.',
      isDangerous: false,
      impact: 'IDE autocomplete limited, unclear API contracts',
      recommendation: 'Add JSDoc comments to all public functions: @param, @returns, @example',
      evidence: [],
    });
  }

  // 3. Check for Consistent Naming Conventions
  const tsFiles = filePaths.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  const componentFiles = tsFiles.filter(f => f.includes('Component') || f.includes('component'));
  const serviceFiles = tsFiles.filter(f => f.includes('service') || f.includes('Service'));

  if (componentFiles.length > 0 && serviceFiles.length > 0) {
    maintainabilityMetrics.hasConsistentNaming = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'low',
      title: 'Inconsistent Naming Conventions',
      description: 'Files and components lack consistent naming patterns.',
      isDangerous: false,
      impact: 'Confusing structure, hard to find files',
      recommendation: 'Use consistent patterns: PascalCase for components, camelCase for functions, snake_case for constants.',
      evidence: [],
    });
  }

  // 4. Check for Type Safety (PropTypes/TypeScript)
  const hasTypeScript = filePaths.some(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  const hasPropTypes = Object.values(codeFiles).some(content => content.includes('PropTypes'));
  const tsConfig = filePaths.find(f => f.includes('tsconfig.json'));

  if (hasTypeScript && tsConfig) {
    maintainabilityMetrics.hasPropTypes = true;

    // Check for strict mode
    if (codeFiles[tsConfig] && codeFiles[tsConfig].includes('"strict": true')) {
      maintainabilityMetrics.hasTypeScriptStrict = true;
    } else {
      issues.push({
        category: 'Maintainability',
        severity: 'medium',
        title: 'TypeScript Not in Strict Mode',
        description: 'tsconfig.json has "strict": false or undefined.',
        isDangerous: false,
        impact: 'Many type errors go undetected, unsafe code patterns allowed',
        recommendation: 'Set "strict": true in tsconfig.json to enforce strict type checking.',
        evidence: [],
      });
    }
  } else if (!hasTypeScript) {
    issues.push({
      category: 'Maintainability',
      severity: 'medium',
      title: 'No Type Safety System',
      description: 'Project uses plain JavaScript without TypeScript or PropTypes.',
      isDangerous: false,
      impact: 'Type errors at runtime, harder to refactor safely',
      recommendation: 'Migrate to TypeScript or implement PropTypes for type safety.',
      evidence: [],
    });
  }

  // 5. Check for Error Handling
  const hasErrorHandling = Object.values(codeFiles).some(content =>
    content.includes('try {') || content.includes('catch (') ||
    content.includes('.catch(') || content.includes('throw new Error')
  );

  if (hasErrorHandling) {
    maintainabilityMetrics.hasErrorHandling = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'high',
      title: 'Missing Error Handling',
      description: 'No try-catch blocks or error handling patterns found.',
      isDangerous: true,
      impact: 'Unhandled exceptions crash application',
      recommendation: 'Implement comprehensive error handling: try-catch, error boundaries, promise.catch()',
      evidence: [],
    });
  }

  // 6. Check for Logging
  const hasLogging = Object.values(codeFiles).some(content =>
    content.includes('console.log') || content.includes('logger.') ||
    content.includes('winston') || content.includes('debug(')
  );

  if (hasLogging) {
    maintainabilityMetrics.hasLogging = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'medium',
      title: 'Missing Logging',
      description: 'No logging statements for debugging and monitoring.',
      isDangerous: false,
      impact: 'Difficult to trace execution and debug issues',
      recommendation: 'Add logging at key points: function entry/exit, errors, important state changes.',
      evidence: [],
    });
  }

  // 7. Check Dependency Health
  const outdatedDependencyPatterns = [
    /["'](react|vue|angular)["']:\s*["'][<~]1[0-6]\./i,
    /["'](lodash|moment)["']:\s*["'][<~]3\./i,
  ];

  const hasOutdatedDeps = outdatedDependencyPatterns.some(pattern =>
    JSON.stringify(packageJson).match(pattern)
  );

  if (!hasOutdatedDeps && packageJson?.dependencies) {
    maintainabilityMetrics.hasDependencyHealth = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'high',
      title: 'Outdated Dependencies',
      description: 'Project has outdated or deprecated dependency versions.',
      isDangerous: false,
      impact: 'Missing security updates, performance improvements, new features',
      recommendation: 'Update dependencies to latest stable versions. Review breaking changes.',
      evidence: [],
    });
  }

  // 8. Check for Documentation
  const hasProjectDocs = treePathsLower.some(p => 
    p.includes('/docs/') || p.includes('readme') || p.includes('guide')
  );

  if (hasProjectDocs) {
    maintainabilityMetrics.hasDocumentation = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'medium',
      title: 'Limited Project Documentation',
      description: 'No comprehensive documentation for maintainers.',
      isDangerous: false,
      impact: 'New developers struggle to understand codebase',
      recommendation: 'Create docs: architecture, development setup, coding standards, troubleshooting.',
      evidence: [],
    });
  }

  // 9. Check Version Management
  const hasVersionFile = filePaths.some(f => f.includes('version') || f.includes('.release'));
  const packageHasVersion = packageJson?.version !== undefined;

  if (packageHasVersion) {
    maintainabilityMetrics.hasVersionManagement = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'low',
      title: 'Missing Version Management',
      description: 'No version information in package.json.',
      isDangerous: false,
      impact: 'Unclear which release is deployed',
      recommendation: 'Add version field to package.json. Use semantic versioning.',
      evidence: [],
    });
  }

  // 10. Check Modularity
  const sourceFiles = filePaths.filter(f => 
    f.match(/\.(ts|tsx|js|jsx)$/) && !f.includes('test')
  );
  const averageFileSize = sourceFiles.length > 0
    ? sourceFiles.reduce((sum, f) => sum + (codeFiles[f]?.length || 0), 0) / sourceFiles.length
    : 0;

  const hasGoodModularity = sourceFiles.length > 10 && averageFileSize < 500;

  if (hasGoodModularity) {
    maintainabilityMetrics.isModular = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'medium',
      title: 'Poor Modularity',
      description: 'Code is not well modularized (few large files instead of many small focused ones).',
      isDangerous: false,
      impact: 'Hard to test, reuse, and maintain code',
      recommendation: 'Refactor large files into smaller, focused modules with single responsibility.',
      evidence: [],
    });
  }

  // 11. Check for Code Review Process
  const hasPRTemplate = treePathsLower.some(p => p.includes('.github/pull_request'));
  const hasBranchProtection = treePathsLower.some(p => p.includes('branch_protection') || p.includes('ruleset'));

  if (hasPRTemplate) {
    maintainabilityMetrics.hasCodeReviewProcess = true;
  } else {
    issues.push({
      category: 'Maintainability',
      severity: 'low',
      title: 'No Code Review Process',
      description: 'No PR template or branch protection configured.',
      isDangerous: false,
      impact: 'Code changes not reviewed before merge',
      recommendation: 'Set up PR template, require code reviews, enable branch protection.',
      evidence: [],
    });
  }

  maintainabilityMetrics.maintainableItems = Object.values(maintainabilityMetrics)
    .filter((v, i) => typeof v === 'boolean' && v).length;

  const score = calculateMaintainabilityScore(maintainabilityMetrics, issues);

  return {
    issues,
    score,
    maintainabilityMetrics,
  };
}

/**
 * Calculate maintainability score
 */
export function calculateMaintainabilityScore(
  metrics: MaintainabilityAnalysisResult['maintainabilityMetrics'],
  issues: Issue[]
): number {
  // Base score from maintainable items
  const maintainScore = (metrics.maintainableItems / metrics.totalItems) * 100;

  // Deduct for critical issues
  let deductions = 0;

  if (!metrics.hasErrorHandling) deductions += 15;
  if (!metrics.hasPropTypes && !metrics.hasTypeScriptStrict) deductions += 12;
  if (!metrics.hasFunctionDocumentation) deductions += 8;
  if (!metrics.hasLogging) deductions += 6;
  if (!metrics.hasDependencyHealth) deductions += 10;
  if (!metrics.isModular) deductions += 8;
  if (!metrics.hasDocumentation) deductions += 6;
  if (!metrics.hasConsistentNaming) deductions += 4;

  // Additional deductions for issues
  issues.forEach(issue => {
    if (issue.severity === 'high') deductions += 3;
    else if (issue.severity === 'medium') deductions += 2;
    else if (issue.severity === 'low') deductions += 1;
  });

  return Math.max(0, Math.min(100, maintainScore - deductions));
}

export type { MaintainabilityAnalysisResult };