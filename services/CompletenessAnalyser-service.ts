// src/services/completenessAnalyzer.service.ts

import type { Issue } from '@/types/analysis';
import type { FileTreeItem } from '@/types/github';

interface CompletenessAnalysisResult {
  issues: Issue[];
  score: number;
  completenessMetrics: {
    hasReadme: boolean;
    hasChangelog: boolean;
    hasContributing: boolean;
    hasLicense: boolean;
    hasCodeOfConduct: boolean;
    hasIssueTemplates: boolean;
    hasPrTemplate: boolean;
    hasConfigFiles: boolean;
    hasTypeDefinitions: boolean;
    hasEnvExample: boolean;
    hasCICD: boolean;
    hasDocumentation: boolean;
    completedItems: number;
    totalItems: number;
  };
}

/**
 * Analyze project completeness - checks for all necessary files and configurations
 */
export function analyzeCompleteness(
  codeFiles: Record<string, string>,
  fileTree: FileTreeItem[],
  packageJson: any
): CompletenessAnalysisResult {
  const issues: Issue[] = [];
  const completenessMetrics = {
    hasReadme: false,
    hasChangelog: false,
    hasContributing: false,
    hasLicense: false,
    hasCodeOfConduct: false,
    hasIssueTemplates: false,
    hasPrTemplate: false,
    hasConfigFiles: false,
    hasTypeDefinitions: false,
    hasEnvExample: false,
    hasCICD: false,
    hasDocumentation: false,
    completedItems: 0,
    totalItems: 12,
  };

  const filePaths = Object.keys(codeFiles);
  const treePathsLower = fileTree.map(f => f.path.toLowerCase());

  // 1. Check for README
  if (filePaths.some(f => f.toLowerCase() === 'readme.md' || f.toLowerCase().includes('readme'))) {
    const readmeContent = codeFiles[filePaths.find(f => f.toLowerCase().includes('readme')) || ''] || '';
    if (readmeContent.length > 200) {
      completenessMetrics.hasReadme = true;
    } else {
      issues.push({
        category: 'Completeness',
        severity: 'high',
        title: 'Incomplete README',
        description: 'README.md exists but is too short or lacks essential information.',
        isDangerous: false,
        impact: 'Users cannot understand project purpose, setup, or usage',
        recommendation: 'Create comprehensive README with: project description, installation, usage examples, contributing guidelines, license info.',
        evidence: [],
      });
    }
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'high',
      title: 'Missing README.md',
      description: 'No README.md file found in project root.',
      isDangerous: false,
      impact: 'Users have no project documentation or guidance',
      recommendation: 'Create README.md with project overview, installation instructions, usage examples, and contribution guidelines.',
      evidence: [],
    });
  }

  // 2. Check for CHANGELOG
  if (treePathsLower.some(p => p.includes('changelog') || p.includes('history'))) {
    completenessMetrics.hasChangelog = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'medium',
      title: 'Missing CHANGELOG',
      description: 'No CHANGELOG file to track version history.',
      isDangerous: false,
      impact: 'Users cannot see what changed between versions',
      recommendation: 'Create CHANGELOG.md documenting all releases, features, fixes, and breaking changes.',
      evidence: [],
    });
  }

  // 3. Check for CONTRIBUTING
  if (treePathsLower.some(p => p.includes('contributing'))) {
    completenessMetrics.hasContributing = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'medium',
      title: 'Missing CONTRIBUTING.md',
      description: 'No guidelines for contributors.',
      isDangerous: false,
      impact: 'Potential contributors unsure how to contribute',
      recommendation: 'Create CONTRIBUTING.md with: how to set up dev environment, coding standards, PR process, testing requirements.',
      evidence: [],
    });
  }

  // 4. Check for LICENSE
  if (treePathsLower.some(p => p.includes('license'))) {
    completenessMetrics.hasLicense = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'high',
      title: 'Missing LICENSE File',
      description: 'No license file found.',
      isDangerous: false,
      impact: 'Legal uncertainty about code usage rights',
      recommendation: 'Add LICENSE file (MIT, Apache 2.0, GPL, etc.). Update package.json with license field.',
      evidence: [],
    });
  }

  // 5. Check for CODE_OF_CONDUCT
  if (treePathsLower.some(p => p.includes('code_of_conduct') || p.includes('code-of-conduct'))) {
    completenessMetrics.hasCodeOfConduct = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing Code of Conduct',
      description: 'No CODE_OF_CONDUCT.md for community guidelines.',
      isDangerous: false,
      impact: 'No clear expectations for respectful community interaction',
      recommendation: 'Add CODE_OF_CONDUCT.md (e.g., based on Contributor Covenant).',
      evidence: [],
    });
  }

  // 6. Check for Issue Templates
  if (treePathsLower.some(p => p.includes('.github/issue') || p.includes('issue_template'))) {
    completenessMetrics.hasIssueTemplates = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing Issue Templates',
      description: 'No GitHub issue templates configured.',
      isDangerous: false,
      impact: 'Issues lack consistent structure and information',
      recommendation: 'Create .github/ISSUE_TEMPLATE/ with bug report and feature request templates.',
      evidence: [],
    });
  }

  // 7. Check for PR Template
  if (treePathsLower.some(p => p.includes('.github/pull_request') || p.includes('pr_template'))) {
    completenessMetrics.hasPrTemplate = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing Pull Request Template',
      description: 'No PR template to guide contributors.',
      isDangerous: false,
      impact: 'Pull requests lack consistent format and checklist',
      recommendation: 'Create .github/pull_request_template.md with PR checklist and description template.',
      evidence: [],
    });
  }

  // 8. Check for Config Files
  const configFiles = [
    'tsconfig.json',
    '.eslintrc',
    'prettier.config',
    'jest.config',
    'vitest.config',
    '.gitignore',
    '.env.example',
  ];

  const hasConfigFiles = configFiles.some(config =>
    treePathsLower.some(p => p.includes(config.toLowerCase()))
  );

  if (hasConfigFiles) {
    completenessMetrics.hasConfigFiles = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'medium',
      title: 'Missing Configuration Files',
      description: 'Essential configuration files (tsconfig, eslint, prettier, etc.) not found.',
      isDangerous: false,
      impact: 'No standardized development environment setup',
      recommendation: 'Add: tsconfig.json, .eslintrc.json, prettier.config.js, jest.config.js, .gitignore',
      evidence: [],
    });
  }

  // 9. Check for Type Definitions
  const hasTypeDefinitions = filePaths.some(f => f.endsWith('.ts') || f.endsWith('.tsx')) &&
    (treePathsLower.some(p => p.includes('types/') || p.includes('types.ts')));

  if (hasTypeDefinitions) {
    completenessMetrics.hasTypeDefinitions = true;
  } else if (packageJson?.devDependencies?.typescript) {
    issues.push({
      category: 'Completeness',
      severity: 'medium',
      title: 'Missing Type Definitions Organization',
      description: 'TypeScript is used but types are not centrally organized.',
      isDangerous: false,
      impact: 'Type definitions scattered, harder to maintain',
      recommendation: 'Create src/types/ folder and centralize all type definitions.',
      evidence: [],
    });
  }

  // 10. Check for Environment Examples
  if (treePathsLower.some(p => p.includes('.env.example') || p.includes('.env.sample'))) {
    completenessMetrics.hasEnvExample = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'medium',
      title: 'Missing Environment Template',
      description: 'No .env.example or .env.sample file.',
      isDangerous: false,
      impact: 'New developers unsure what environment variables are needed',
      recommendation: 'Create .env.example with all required environment variables and descriptions.',
      evidence: [],
    });
  }

  // 11. Check for CI/CD
  if (treePathsLower.some(p => p.includes('.github/workflows') || p.includes('.gitlab-ci') || p.includes('.circleci'))) {
    completenessMetrics.hasCICD = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'high',
      title: 'Missing CI/CD Pipeline',
      description: 'No continuous integration/deployment configuration found.',
      isDangerous: false,
      impact: 'No automated testing or deployment',
      recommendation: 'Set up GitHub Actions, GitLab CI, or CircleCI with automated tests and deployment.',
      evidence: [],
    });
  }

  // 12. Check for Documentation
  const hasDocsFolder = treePathsLower.some(p => p.includes('/docs/') || p.includes('/documentation/'));
  const readmeLength = Object.values(codeFiles)
    .find(content => content.includes('# '))?.length || 0;

  if (hasDocsFolder || readmeLength > 1500) {
    completenessMetrics.hasDocumentation = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'medium',
      title: 'Limited Project Documentation',
      description: 'No dedicated docs folder or comprehensive README.',
      isDangerous: false,
      impact: 'Users have limited guidance on features and usage',
      recommendation: 'Create docs/ folder with API docs, guides, examples, and architecture documentation.',
      evidence: [],
    });
  }

  // Count completed metrics
  completenessMetrics.completedItems = Object.values(completenessMetrics)
    .filter((v, i) => typeof v === 'boolean' && v).length;

  const score = calculateCompletenessScore(completenessMetrics, issues);

  return {
    issues,
    score,
    completenessMetrics,
  };
}

/**
 * Calculate completeness score
 */
export function calculateCompletenessScore(
  metrics: CompletenessAnalysisResult['completenessMetrics'],
  issues: Issue[]
): number {
  // Base score from completed items
  const completionScore = (metrics.completedItems / metrics.totalItems) * 100;

  // Deduct points for critical missing items
  let deductions = 0;

  if (!metrics.hasReadme) deductions += 15;
  if (!metrics.hasLicense) deductions += 10;
  if (!metrics.hasCICD) deductions += 12;
  if (!metrics.hasConfigFiles) deductions += 8;
  if (!metrics.hasContributing) deductions += 5;
  if (!metrics.hasDocumentation) deductions += 8;
  if (!metrics.hasEnvExample) deductions += 5;

  // Additional deduction for issues
  issues.forEach(issue => {
    if (issue.severity === 'high') deductions += 3;
    else if (issue.severity === 'medium') deductions += 1;
  });

  return Math.max(0, Math.min(100, completionScore - deductions));
}

export type { CompletenessAnalysisResult };