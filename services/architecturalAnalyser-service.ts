// src/services/architectureAnalyzer.service.ts

import type { Issue } from '@/types/analysis';
import type { FileTreeItem } from '@/types/github';

interface ArchitectureAnalysisResult {
  issues: Issue[];
  score: number;
  folderStructure: string;
  hasProperLayering: boolean;
  circularDependencies: string[];
  codeMetrics: {
    largeFiles: number;
    averageFileSize: number;
    fileCount: number;
  };
}

/**
 * Comprehensive architecture analysis
 */
export function analyzeArchitectureIssues(
  codeFiles: Record<string, string>,
  fileTree: FileTreeItem[]
): ArchitectureAnalysisResult {
  const issues: Issue[] = [];
  const circularDependencies: string[] = [];

  const codeMetrics = calculateCodeMetrics(codeFiles);

  // 1. Large file detection
  analyzeLargeFiles(codeFiles, issues);

  // 2. Folder structure analysis
  const folderStructure = analyzeFolderStructure(fileTree);
  analyzeLayering(fileTree, issues);

  // 3. Circular dependency detection
  detectCircularDependencies(codeFiles, circularDependencies);
  if (circularDependencies.length > 0) {
    issues.push({
      category: 'Architecture',
      severity: 'high',
      title: 'Circular Dependencies Detected',
      description: `Found ${circularDependencies.length} potential circular dependency patterns.`,
      isDangerous: false,
      impact: 'Difficult to refactor, tight coupling, harder to test',
      recommendation: 'Restructure code to eliminate cycles. Use dependency injection or extract shared code.',
      evidence: circularDependencies.slice(0, 3),
    });
  }

  // 4. Naming convention checks
  analyzeNamingConventions(fileTree, issues);

  // 5. Component organization
  analyzeComponentOrganization(fileTree, issues);

  // 6. Index file pattern
  analyzeIndexPatterns(fileTree, issues);

  // 7. Folder depth analysis
  analyzeFolderDepth(fileTree, issues);

  // 8. Mixed responsibility detection
  detectMixedResponsibilities(codeFiles, issues);

  // 9. Missing abstraction layers
  detectMissingAbstractions(codeFiles, fileTree, issues);

  // 10. Improper separation of concerns
  detectSeparationIssues(codeFiles, issues);

  // 11. Code duplication patterns
  detectCodeDuplication(codeFiles, issues);

  // 12. Configuration scattered
  detectScatteredConfig(fileTree, issues);

  const hasProperLayering = checkProperLayering(fileTree);
  const score = calculateArchitectureScore(issues, codeMetrics);

  return {
    issues,
    score,
    folderStructure,
    hasProperLayering,
    circularDependencies,
    codeMetrics,
  };
}

/**
 * Calculate code metrics
 */
function calculateCodeMetrics(codeFiles: Record<string, string>): ArchitectureAnalysisResult['codeMetrics'] {
  const sourceFiles = Object.entries(codeFiles).filter(([path]) => 
    path.match(/\.(ts|tsx|js|jsx)$/) && !path.includes('test')
  );

  const fileSizes = sourceFiles.map(([_, content]) => content.split('\n').length);
  const largeFiles = fileSizes.filter(size => size > 500).length;
  const averageFileSize = fileSizes.length > 0 
    ? Math.round(fileSizes.reduce((a, b) => a + b) / fileSizes.length)
    : 0;

  return {
    largeFiles,
    averageFileSize,
    fileCount: sourceFiles.length,
  };
}

/**
 * Analyze and return folder structure type
 */
function analyzeFolderStructure(fileTree: FileTreeItem[]): string {
  const paths = fileTree.map(f => f.path);

  if (paths.some(p => p.includes('src/features/') || p.includes('src/modules/'))) {
    return 'feature-based';
  } else if (paths.some(p => p.includes('src/pages/') && p.includes('src/components/'))) {
    return 'next-js-pages';
  } else if (paths.some(p => p.includes('app/') && p.includes('lib/'))) {
    return 'next-js-app-router';
  } else if (paths.some(p => p.includes('src/api/') && p.includes('src/services/'))) {
    return 'layered';
  } else if (paths.some(p => p.includes('src/'))) {
    return 'monolithic';
  }
  return 'unknown';
}

/**
 * Check if proper layering exists
 */
function checkProperLayering(fileTree: FileTreeItem[]): boolean {
  const paths = fileTree.map(f => f.path.toLowerCase());
  
  const hasServices = paths.some(p => p.includes('/services/') || p.includes('/service/'));
  const hasComponents = paths.some(p => p.includes('/components/') || p.includes('/component/'));
  const hasUtils = paths.some(p => p.includes('/utils/') || p.includes('/lib/') || p.includes('/helpers/'));
  const hasTypes = paths.some(p => p.includes('/types/') || p.includes('types.ts') || p.includes('interface'));

  return hasServices && hasComponents && hasUtils && hasTypes;
}

/**
 * Analyze layering in the project
 */
function analyzeLayering(fileTree: FileTreeItem[], issues: Issue[]): void {
  const hasLayering = checkProperLayering(fileTree);

  if (!hasLayering) {
    const paths = fileTree.map(f => f.path.toLowerCase());
    
    // Check what's missing
    if (!paths.some(p => p.includes('/services/'))) {
      issues.push({
        category: 'Architecture',
        severity: 'medium',
        title: 'Missing Services Layer',
        description: 'No services folder found. Business logic should be separated from UI.',
        isDangerous: false,
        impact: 'Business logic mixed with components, hard to test and reuse',
        recommendation: 'Create src/services/ folder and move API calls, data fetching, and business logic there.',
        evidence: [],
      });
    }

    if (!paths.some(p => p.includes('/utils/') || p.includes('/lib/'))) {
      issues.push({
        category: 'Architecture',
        severity: 'low',
        title: 'Missing Utilities/Helpers Layer',
        description: 'No utils or lib folder found.',
        isDangerous: false,
        impact: 'Repeated code, utility functions scattered',
        recommendation: 'Create src/utils/ or src/lib/ folder for shared utilities and helpers.',
        evidence: [],
      });
    }

    if (!paths.some(p => p.includes('/types/') || p.includes('types.ts'))) {
      issues.push({
        category: 'Architecture',
        severity: 'low',
        title: 'Missing Type Definitions Organization',
        description: 'Types are not centrally organized.',
        isDangerous: false,
        impact: 'Type definitions scattered, harder to maintain consistency',
        recommendation: 'Create src/types/ folder to centralize all TypeScript type definitions.',
        evidence: [],
      });
    }
  }
}

/**
 * Analyze large files
 */
function analyzeLargeFiles(codeFiles: Record<string, string>, issues: Issue[]): void {
  Object.entries(codeFiles).forEach(([filePath, content]) => {
    const lines = content.split('\n').length;

    if (lines > 2000) {
      issues.push({
        category: 'Architecture',
        severity: 'critical',
        title: 'Critically Large File',
        description: `${filePath} has ${lines} lines of code - exceeds safe limit.`,
        isDangerous: false,
        impact: 'Extremely difficult to maintain, debug, test, and understand',
        recommendation: 'Break into smaller files (< 500 lines each). Extract components, services, utils.',
        evidence: [],
        file: filePath,
      });
    } else if (lines > 1000) {
      issues.push({
        category: 'Architecture',
        severity: 'high',
        title: 'Large File',
        description: `${filePath} has ${lines} lines - difficult to maintain.`,
        isDangerous: false,
        impact: 'Hard to understand, maintain, and test',
        recommendation: 'Consider splitting into 2-3 smaller files with single responsibilities.',
        evidence: [],
        file: filePath,
      });
    } else if (lines > 500) {
      issues.push({
        category: 'Architecture',
        severity: 'medium',
        title: 'File Getting Large',
        description: `${filePath} has ${lines} lines - monitor for growth.`,
        isDangerous: false,
        impact: 'Approaching maintenance difficulty threshold',
        recommendation: 'Keep under control. Plan to split if it grows further.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

/**
 * Detect circular dependencies
 */
function detectCircularDependencies(codeFiles: Record<string, string>, found: string[]): void {
  const importMap: Record<string, Set<string>> = {};

  // Build import map
  Object.entries(codeFiles).forEach(([filePath, content]) => {
    const imports = new Set<string>();
    const importRegex = /(?:import|from)\s+['"]([@.\w/\-]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.add(match[1]);
    }

    importMap[filePath] = imports;
  });

  // Check for cycles
  Object.entries(importMap).forEach(([file, imports]) => {
    imports.forEach(imported => {
      const importedPath = Object.keys(codeFiles).find(f => 
        f.includes(imported.replace('@', '').replace(/\//g, ''))
      );

      if (importedPath && importMap[importedPath]?.has(file)) {
        const cycle = `${file.split('/').pop()} ↔ ${importedPath.split('/').pop()}`;
        if (!found.includes(cycle)) {
          found.push(cycle);
        }
      }
    });
  });
}

/**
 * Analyze naming conventions
 */
function analyzeNamingConventions(fileTree: FileTreeItem[], issues: Issue[]): void {
  const violations = fileTree.filter(f => {
    const fileName = f.path.split('/').pop() || '';
    
    // Check for inconsistent naming
    if (fileName.includes('_') && !fileName.includes('_test') && !fileName.includes('__')) {
      return true; // snake_case in JS/TS
    }
    
    return false;
  });

  if (violations.length > 5) {
    issues.push({
      category: 'Architecture',
      severity: 'low',
      title: 'Inconsistent Naming Conventions',
      description: `Found ${violations.length} files with inconsistent naming (snake_case in JS/TS).`,
      isDangerous: false,
      impact: 'Reduced code consistency and readability',
      recommendation: 'Use camelCase for JS/TS files, PascalCase for React components, kebab-case for folders.',
      evidence: violations.slice(0, 3).map(f => f.path),
    });
  }
}

/**
 * Analyze component organization
 */
function analyzeComponentOrganization(fileTree: FileTreeItem[], issues: Issue[]): void {
  const componentPaths = fileTree.filter(f => f.path.includes('component'));
  
  if (componentPaths.length > 0) {
    // Check if components have index.ts files
    const hasIndexFiles = componentPaths.some(f => f.path.endsWith('index.ts'));
    
    if (!hasIndexFiles && componentPaths.length > 10) {
      issues.push({
        category: 'Architecture',
        severity: 'low',
        title: 'Missing Index Files in Components',
        description: 'Component folders should export via index.ts files.',
        isDangerous: false,
        impact: 'Longer import paths, less clean imports',
        recommendation: 'Add index.ts files to component folders for cleaner imports.',
        evidence: [],
      });
    }
  }
}

/**
 * Analyze index file patterns
 */
function analyzeIndexPatterns(fileTree: FileTreeItem[], issues: Issue[]): void {
  const folders = new Set(
    fileTree
      .map(f => f.path.split('/').slice(0, -1).join('/'))
      .filter(p => p.length > 0)
  );

  let indexCount = 0;
  folders.forEach(folder => {
    if (fileTree.some(f => f.path === `${folder}/index.ts` || f.path === `${folder}/index.tsx`)) {
      indexCount++;
    }
  });

  const indexRatio = folders.size > 0 ? (indexCount / folders.size) * 100 : 0;

  if (indexRatio < 30 && folders.size > 10) {
    issues.push({
      category: 'Architecture',
      severity: 'low',
      title: 'Limited Use of Index Files',
      description: `Only ${indexRatio.toFixed(0)}% of folders have index.ts files.`,
      isDangerous: false,
      impact: 'Less clean module exports and imports',
      recommendation: 'Use index.ts files for cleaner imports. Import from folders rather than specific files.',
      evidence: [],
    });
  }
}

/**
 * Analyze folder depth
 */
function analyzeFolderDepth(fileTree: FileTreeItem[], issues: Issue[]): void {
  const maxDepth = Math.max(...fileTree.map(f => (f.path.match(/\//g) || []).length));

  if (maxDepth > 8) {
    issues.push({
      category: 'Architecture',
      severity: 'medium',
      title: 'Excessive Folder Nesting',
      description: `Maximum folder depth is ${maxDepth} levels - too deep.`,
      isDangerous: false,
      impact: 'Hard to navigate, long import paths, unclear structure',
      recommendation: 'Flatten folder structure. Keep max depth to 4-5 levels.',
      evidence: [],
    });
  }
}

/**
 * Detect mixed responsibilities
 */
function detectMixedResponsibilities(codeFiles: Record<string, string>, issues: Issue[]): void {
  Object.entries(codeFiles).forEach(([filePath, content]) => {
    const lines = content.split('\n').length;
    
    // Check for multiple exports
    const exportCount = (content.match(/^export\s+(?:function|const|class|interface|type)/gm) || []).length;
    const defaultExport = content.includes('export default');

    if (exportCount > 5 && lines > 300) {
      issues.push({
        category: 'Architecture',
        severity: 'medium',
        title: 'Multiple Responsibilities in Single File',
        description: `${filePath} exports ${exportCount} items - lacks single responsibility.`,
        isDangerous: false,
        impact: 'File does too many things, harder to maintain and test',
        recommendation: 'Split into separate files, one responsibility per file.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

/**
 * Detect missing abstractions
 */
function detectMissingAbstractions(codeFiles: Record<string, string>, fileTree: FileTreeItem[], issues: Issue[]): void {
  const apiFileCount = fileTree.filter(f => f.path.includes('/api/')).length;
  const hasAbstraction = fileTree.some(f => 
    f.path.includes('/services/') || f.path.includes('/api/client') || f.path.includes('/lib/api')
  );

  if (apiFileCount > 5 && !hasAbstraction) {
    issues.push({
      category: 'Architecture',
      severity: 'medium',
      title: 'Missing API Abstraction Layer',
      description: 'API calls appear to be directly in components without abstraction.',
      isDangerous: false,
      impact: 'API logic repeated in components, hard to change API',
      recommendation: 'Create API client/service layer to abstract HTTP calls.',
      evidence: [],
    });
  }
}

/**
 * Detect separation of concerns issues
 */
function detectSeparationIssues(codeFiles: Record<string, string>, issues: Issue[]): void {
  Object.entries(codeFiles).forEach(([filePath, content]) => {
    if (filePath.includes('component') && filePath.endsWith('.tsx')) {
      // Components should not have API calls directly
      if ((content.includes('fetch(') || content.includes('axios')) && !content.includes('useEffect')) {
        issues.push({
          category: 'Architecture',
          severity: 'medium',
          title: 'API Call Outside useEffect/Hook',
          description: `${filePath} has API calls outside of hooks.`,
          isDangerous: false,
          impact: 'Side effects on every render, potential memory leaks',
          recommendation: 'Wrap API calls in useEffect. Better: move to services/hooks.',
          evidence: [],
          file: filePath,
        });
      }

      // Components should not have business logic
      if (content.includes('const calculate') || content.includes('const transform')) {
        issues.push({
          category: 'Architecture',
          severity: 'low',
          title: 'Business Logic in Component',
          description: `${filePath} contains business logic.`,
          isDangerous: false,
          impact: 'Component file is doing too much',
          recommendation: 'Extract business logic to utils or services.',
          evidence: [],
          file: filePath,
        });
      }
    }
  });
}

/**
 * Detect code duplication
 */
function detectCodeDuplication(codeFiles: Record<string, string>, issues: Issue[]): void {
  const sourceFiles = Object.entries(codeFiles).filter(([path]) => 
    path.match(/\.(ts|tsx|js|jsx)$/)
  );

  // Look for repeated patterns (very basic)
  const patterns: Record<string, number> = {};

  sourceFiles.forEach(([_, content]) => {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (idx < lines.length - 1) {
        const twoLines = lines[idx] + '\n' + lines[idx + 1];
        patterns[twoLines] = (patterns[twoLines] || 0) + 1;
      }
    });
  });

  const duplicatePatterns = Object.values(patterns).filter(count => count > 5);

  if (duplicatePatterns.length > 10) {
    issues.push({
      category: 'Architecture',
      severity: 'low',
      title: 'Potential Code Duplication',
      description: 'Found multiple similar code patterns across files.',
      isDangerous: false,
      impact: 'Maintenance burden, harder to update code',
      recommendation: 'Extract common patterns into utilities or shared components.',
      evidence: [],
    });
  }
}

/**
 * Detect scattered configuration
 */
function detectScatteredConfig(fileTree: FileTreeItem[], issues: Issue[]): void {
  const configFiles = fileTree.filter(f => 
    f.path.match(/\.config\.(ts|js|json|yaml)$/) || 
    f.path.includes('config/')
  );

  const scatteredConfigs = fileTree.filter(f =>
    (f.path.includes('settings') || f.path.includes('constants')) && !f.path.includes('config')
  ).length;

  if (scatteredConfigs > 3) {
    issues.push({
      category: 'Architecture',
      severity: 'low',
      title: 'Scattered Configuration Files',
      description: 'Configuration and constants scattered across multiple files.',
      isDangerous: false,
      impact: 'Hard to find and update configuration',
      recommendation: 'Centralize configuration in src/config/ or use environment variables.',
      evidence: [],
    });
  }
}

/**
 * Calculate architecture score
 */
export function calculateArchitectureScore(
  issues: Issue[],
  metrics: ArchitectureAnalysisResult['codeMetrics']
): number {
  let score = 100;

  // Deduct for issues
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 25;
    else if (issue.severity === 'high') score -= 15;
    else if (issue.severity === 'medium') score -= 8;
    else if (issue.severity === 'low') score -= 3;
  });

  // Adjust for large files
  if (metrics.largeFiles > 0) {
    score -= Math.min(20, metrics.largeFiles * 5);
  }

  // Bonus for good average file size
  if (metrics.averageFileSize < 300) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

export { type ArchitectureAnalysisResult };