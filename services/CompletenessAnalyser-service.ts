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
        severity: 'medium',
        title: 'Incomplete README',
        description: 'README.md exists but is too short or lacks essential information.',
        isDangerous: false,
        impact: 'Users cannot understand project purpose, setup, or usage',
        recommendation: 'Expand README with: project description, installation, usage examples, contributing guidelines, license info.',
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

  // 2. Check for CHANGELOG (community/OSS — only matters once others depend on releases)
  if (treePathsLower.some(p => p.includes('changelog') || p.includes('history'))) {
    completenessMetrics.hasChangelog = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing CHANGELOG',
      description: 'No CHANGELOG file to track version history.',
      isDangerous: false,
      impact: 'Relevant mainly once others depend on version-to-version changes',
      recommendation: 'Add CHANGELOG.md once the project has external users or releases.',
      evidence: [],
    });
  }

  // 3. Check for CONTRIBUTING (community/OSS — only matters with outside contributors)
  if (treePathsLower.some(p => p.includes('contributing'))) {
    completenessMetrics.hasContributing = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing CONTRIBUTING.md',
      description: 'No guidelines for contributors.',
      isDangerous: false,
      impact: 'Only relevant once the project accepts outside contributions',
      recommendation: 'Add CONTRIBUTING.md if opening this project up to contributors.',
      evidence: [],
    });
  }

  // 4. Check for LICENSE
  if (treePathsLower.some(p => p.includes('license'))) {
    completenessMetrics.hasLicense = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing LICENSE File',
      description: 'No license file found.',
      isDangerous: false,
      impact: 'Unclear usage rights if this project is shared publicly',
      recommendation: 'Add LICENSE file (MIT, Apache 2.0, GPL, etc.) if this is or will be public.',
      evidence: [],
    });
  }

  // 5. Check for CODE_OF_CONDUCT (community/OSS — only relevant with a public community)
  if (treePathsLower.some(p => p.includes('code_of_conduct') || p.includes('code-of-conduct'))) {
    completenessMetrics.hasCodeOfConduct = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing Code of Conduct',
      description: 'No CODE_OF_CONDUCT.md for community guidelines.',
      isDangerous: false,
      impact: 'Only relevant for projects with an open community',
      recommendation: 'Add CODE_OF_CONDUCT.md (e.g., based on Contributor Covenant) once building a public community.',
      evidence: [],
    });
  }

  // 6. Check for Issue Templates (community/OSS)
  if (treePathsLower.some(p => p.includes('.github/issue') || p.includes('issue_template'))) {
    completenessMetrics.hasIssueTemplates = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing Issue Templates',
      description: 'No GitHub issue templates configured.',
      isDangerous: false,
      impact: 'Minor — useful once others start filing issues',
      recommendation: 'Create .github/ISSUE_TEMPLATE/ with bug report and feature request templates.',
      evidence: [],
    });
  }

  // 7. Check for PR Template (community/OSS)
  if (treePathsLower.some(p => p.includes('.github/pull_request') || p.includes('pr_template'))) {
    completenessMetrics.hasPrTemplate = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing Pull Request Template',
      description: 'No PR template to guide contributors.',
      isDangerous: false,
      impact: 'Minor — useful once you have external contributors',
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

  // 9. Check for Type Definitions (only relevant if TypeScript is actually used)
  const usesTypeScript = filePaths.some(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  const hasTypeDefinitions = treePathsLower.some(p => p.includes('types/') || p.includes('types.ts'));

  if (!usesTypeScript || hasTypeDefinitions) {
    completenessMetrics.hasTypeDefinitions = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Missing Type Definitions Organization',
      description: 'TypeScript is used but types are not centrally organized.',
      isDangerous: false,
      impact: 'Type definitions scattered, harder to maintain',
      recommendation: 'Create src/types/ folder and centralize all type definitions.',
      evidence: [],
    });
  }

  // 10. Check for Environment Examples (only matters if env vars are actually used)
  const handlesEnvVars = Object.values(codeFiles).some(content =>
    content.includes('process.env') || content.includes('import.meta.env')
  );

  if (treePathsLower.some(p => p.includes('.env.example') || p.includes('.env.sample')) || !handlesEnvVars) {
    completenessMetrics.hasEnvExample = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'medium',
      title: 'Missing Environment Template',
      description: 'Code reads environment variables but no .env.example was found.',
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
      severity: 'medium',
      title: 'Missing CI/CD Pipeline',
      description: 'No continuous integration/deployment configuration found.',
      isDangerous: false,
      impact: 'No automated testing or deployment checks',
      recommendation: 'Set up GitHub Actions, GitLab CI, or CircleCI with automated tests and deployment.',
      evidence: [],
    });
  }

  // 12. Check for Documentation
  const hasDocsFolder = treePathsLower.some(p => p.includes('/docs/') || p.includes('/documentation/'));
  const readmePathForLength = filePaths.find(f => f.toLowerCase().includes('readme'));
  const readmeLength = readmePathForLength ? (codeFiles[readmePathForLength]?.length ?? 0) : 0;

  if (hasDocsFolder || readmeLength > 1500) {
    completenessMetrics.hasDocumentation = true;
  } else {
    issues.push({
      category: 'Completeness',
      severity: 'low',
      title: 'Limited Project Documentation',
      description: 'No dedicated docs folder or comprehensive README.',
      isDangerous: false,
      impact: 'Users have limited guidance on features and usage',
      recommendation: 'Create docs/ folder with API docs, guides, examples, and architecture documentation as the project grows.',
      evidence: [],
    });
  }

  // Count completed metrics (informational — display purposes only)
  completenessMetrics.completedItems = Object.values(completenessMetrics)
    .filter((v, i) => typeof v === 'boolean' && v).length;

  const score = calculateCompletenessScore(completenessMetrics, fileTree);

  return {
    issues,
    score,
    completenessMetrics,
  };
}

/**
 * Calculate completeness score.
 *
 * Each check below contributes a fixed point value to the score EXACTLY
 * ONCE if present. There is no separate "ratio" calculation layered on
 * top of flat deductions and per-issue deductions for the same missing
 * item — that triple-counting is what was driving every analyzed repo
 * toward 0 regardless of what was actually in it.
 *
 * Core completeness (README, config, env handling, CI, license, types,
 * docs) makes up 70 of 100 points — these matter for any project.
 * Community/OSS infrastructure (CHANGELOG, CONTRIBUTING, CODE_OF_CONDUCT,
 * issue/PR templates) makes up the remaining 30 — these only really
 * matter once a project has outside contributors, so they're weighted
 * accordingly rather than punished the same as a missing README.
 */
export function calculateCompletenessScore(
  metrics: CompletenessAnalysisResult['completenessMetrics'],
  fileTree: FileTreeItem[]
): number {
  let score = 0;

  // Core completeness — 70 pts total
  if (metrics.hasReadme) score += 15;
  if (metrics.hasConfigFiles) score += 15;
  if (metrics.hasEnvExample) score += 10;
  if (metrics.hasCICD) score += 10;
  if (metrics.hasLicense) score += 10;
  if (metrics.hasTypeDefinitions) score += 5;
  if (metrics.hasDocumentation) score += 5;

  // Community/OSS — 30 pts total
  if (metrics.hasChangelog) score += 6;
  if (metrics.hasContributing) score += 6;
  if (metrics.hasCodeOfConduct) score += 6;
  if (metrics.hasIssueTemplates) score += 6;
  if (metrics.hasPrTemplate) score += 6;

  score = Math.max(0, Math.min(100, score));

  // A repo with actual code in it should never read as a flat 0 — that
  // number should only ever describe a genuinely empty repository.
  const hasAnyCode = fileTree.some(f => f.type === 'blob');
  if (hasAnyCode) {
    score = Math.max(score, 8);
  }

  return Math.round(score);
}

export type { CompletenessAnalysisResult };