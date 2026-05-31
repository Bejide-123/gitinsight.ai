// services/analysis.service.ts

import { fetchRepositoryWithCode } from './github-service';
import { detectProjectIntent } from './projectIntent-service';
import { analyzeSecurityIssues, type SecurityAnalysisResult } from './securityAnalyser-service';
import { analyzeArchitectureIssues, type ArchitectureAnalysisResult } from './architecturalAnalyser-service';
import { analyzeTesting, type TestingAnalysisResult } from './testingAnalyser-service';
import type { Analysis, Issue, ProjectContext, IssueSeverity } from '@/types/analysis';
import type { GitHubRepo, FileTreeItem } from '@/types/github';

/**
 * Scoring weights for different project intents
 */
const INTENT_WEIGHTS: Record<string, Record<string, number>> = {
  portfolio: {
    security: 0.25,
    architecture: 0.35,
    testing: 0.10,
    documentation: 0.30,
  },
  learning: {
    security: 0.20,
    architecture: 0.40,
    testing: 0.20,
    documentation: 0.20,
  },
  'open-source-library': {
    security: 0.20,
    architecture: 0.30,
    testing: 0.35,
    documentation: 0.15,
  },
  mvp: {
    security: 0.30,
    architecture: 0.30,
    testing: 0.25,
    documentation: 0.15,
  },
  startup: {
    security: 0.35,
    architecture: 0.28,
    testing: 0.25,
    documentation: 0.12,
  },
  'production-saas': {
    security: 0.40,
    architecture: 0.28,
    testing: 0.25,
    documentation: 0.07,
  },
  enterprise: {
    security: 0.40,
    architecture: 0.30,
    testing: 0.20,
    documentation: 0.10,
  },
};

/**
 * Maturity level thresholds
 */
const MATURITY_LEVELS: Array<{ min: number; max: number; level: string; production: boolean }> = [
  { min: 0, max: 25, level: 'Prototype', production: false },
  { min: 26, max: 40, level: 'Early Stage', production: false },
  { min: 41, max: 55, level: 'Developing', production: false },
  { min: 56, max: 70, level: 'Production Candidate', production: false },
  { min: 71, max: 85, level: 'Production', production: true },
  { min: 86, max: 100, level: 'Enterprise Ready', production: true },
];

interface CategoryScore {
  score: number;
  weight: number;
  issues: Issue[];
  metrics?: Record<string, any>;
}

interface AnalysisMetadata {
  analysisTime: Date;
  totalIssuesFound: number;
  issuesByCategory: Record<string, number>;
  issuesBySeverity: Record<IssueSeverity, number>;
  codeMetrics: {
    totalFiles: number;
    largeFiles: number;
    averageFileSize: number;
  };
}

interface RepositoryData {
  readme: string | null;
  packageJson: any;
  fileTree: FileTreeItem[];
  codeFiles: Record<string, string>;
  metadata: GitHubRepo;
}

/**
 * Main analysis orchestrator
 * Combines all analyzers and produces comprehensive analysis
 */
export async function analyzeRepository(repoUrl: string): Promise<Analysis> {
  console.log('Starting analyzeRepository for URL:', repoUrl);
  try {
    // 1. Fetch repository data + code files
    console.log('📥 Fetching repository data...');
    const repoData = await fetchRepositoryWithCode(repoUrl);
    console.log('✅ Fetched repoData.metadata:', repoData.metadata?.full_name);
    console.log('✅ Fetched repoData.codeFiles count:', Object.keys(repoData.codeFiles).length);
    
    // 2. Detect project intent
    console.log('🎯 Detecting project intent...');
    const projectContext = detectProjectIntent({
      readme: repoData.readme,
      packageJson: repoData.packageJson,
      fileTree: repoData.fileTree,
      metadata: repoData.metadata,
    });
    
    console.log(`   ✓ Intent: ${projectContext.intent} (${projectContext.confidence}% confidence)`);
    
    // 3. Run all analyzers in parallel
    console.log('🔍 Running comprehensive analysis...');
    
    const [securityResult, architectureResult, testingResult] = await Promise.all([
      Promise.resolve(analyzeSecurityIssues(repoData.codeFiles, repoData.packageJson)),
      Promise.resolve(analyzeArchitectureIssues(repoData.codeFiles, repoData.fileTree)),
      Promise.resolve(analyzeTesting(repoData.fileTree)),
    ]);
    
    console.log(`   ✓ Security: ${securityResult.score}/100 (${securityResult.criticalCount} critical)`);
    console.log(`   ✓ Architecture: ${architectureResult.score}/100`);
    console.log(`   ✓ Testing: ${testingResult.score}/100`);
    
    // 4. Aggregate all issues
    const allIssues = [
      ...securityResult.issues,
      ...architectureResult.issues,
      ...testingResult.issues,
    ];
    
    // 5. Separate dangerous vs improvement issues
    const dangerousIssues = allIssues.filter(i => i.isDangerous);
    const missingImprovements = allIssues.filter(i => !i.isDangerous);
    
    console.log(`   ✓ Found ${dangerousIssues.length} dangerous issues`);
    console.log(`   ✓ Found ${missingImprovements.length} quality improvements`);
    
    // 6. Build category scores with weights
    const weights = getWeightsForIntent(projectContext.intent);
    
    const categoryScores: Record<string, CategoryScore> = {
      security: {
        score: securityResult.score,
        weight: weights.security,
        issues: securityResult.issues,
        metrics: {
          critical: securityResult.criticalCount,
          high: securityResult.highCount,
          medium: securityResult.mediumCount,
          low: securityResult.lowCount,
        },
      },
      architecture: {
        score: architectureResult.score,
        weight: weights.architecture,
        issues: architectureResult.issues,
        metrics: {
          largeFiles: architectureResult.codeMetrics.largeFiles,
          averageFileSize: architectureResult.codeMetrics.averageFileSize,
          fileCount: architectureResult.codeMetrics.fileCount,
          folderStructure: architectureResult.folderStructure,
          hasProperLayering: architectureResult.hasProperLayering,
          circularDependencies: architectureResult.circularDependencies.length,
        },
      },
      testing: {
        score: testingResult.score,
        weight: weights.testing,
        issues: testingResult.issues,
        metrics: {
          hasTestFiles: testingResult.hasTestFiles,
          testFrameworks: testingResult.testFrameworks,
          testingTypes: testingResult.testingTypes,
          hasCoverageConfig: testingResult.hasCoverageConfig,
          hasCIIntegration: testingResult.hasCIIntegration,
          testFileDensity: testingResult.testFileDensity,
        },
      },
    };
    
    // 7. Calculate overall maturity score using weighted average
    const maturityScore = calculateWeightedScore(
      {
        security: categoryScores.security.score,
        architecture: categoryScores.architecture.score,
        testing: categoryScores.testing.score,
      },
      weights
    );
    
    // 8. Get maturity level
    const { level, production } = getMaturityLevel(maturityScore);
    
    console.log(`✅ Overall Score: ${Math.round(maturityScore)}/100 - ${level}`);
    
    // 9. Build metadata
    const metadata = buildAnalysisMetadata(allIssues, repoData, architectureResult);
    
    // 10. Identify strengths
    const strengths = identifyStrengths(repoData, categoryScores, projectContext);
    
    // 11. Generate recommendations
    const criticalBlockers = generateCriticalBlockers(dangerousIssues);
    const nextSteps = generateNextSteps(missingImprovements, projectContext, categoryScores);
    
    // 12. Build final analysis object
    const analysis: Analysis = {
      repoUrl,
      repoName: repoData.metadata.full_name,
      maturityScore: Math.round(maturityScore),
      level,
      isProductionReady: production && dangerousIssues.length === 0,
      projectContext,
      categoryScores,
      dangerousIssues: sortIssuesByPriority(dangerousIssues),
      missingImprovements: sortIssuesByPriority(missingImprovements),
      strengths,
      criticalBlockers,
      nextSteps,
      metadata,
      analyzedAt: new Date(),
    };
    
    console.log(`\n${generateAnalysisSummary(analysis)}`);
    
    return analysis;
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    throw new Error(
      `Repository analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get scoring weights for a specific project intent
 */
function getWeightsForIntent(intent: string): Record<string, number> {
  const weights = INTENT_WEIGHTS[intent] || INTENT_WEIGHTS['startup'];
  console.log(`Using weights for intent '${intent}':`, weights);
  return weights;
}

/**
 * Calculate weighted score from category scores
 */
function calculateWeightedScore(
  scores: Record<string, number>,
  weights: Record<string, number>
): number {
  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(scores).forEach(([category, score]) => {
    const weight = weights[category] || 0;
    totalScore += score * weight;
    totalWeight += weight;
  });

  console.log('Calculated totalScore:', totalScore, 'totalWeight:', totalWeight);
  const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  console.log('Final weighted score:', finalScore);
  return finalScore;
}

/**
 * Get maturity level from score
 */
function getMaturityLevel(
  score: number
): { level: string; production: boolean } {
  const maturityLevel = MATURITY_LEVELS.find(
    m => score >= m.min && score <= m.max
  );

  return (
    maturityLevel || { level: 'Unknown', production: false }
  );
}

/**
 * Build analysis metadata
 */
function buildAnalysisMetadata(
  issues: Issue[],
  repoData: RepositoryData,
  architectureResult: ArchitectureAnalysisResult
): AnalysisMetadata {
  const issuesBySeverity: Record<IssueSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const issuesByCategory: Record<string, number> = {};

  issues.forEach(issue => {
    issuesBySeverity[issue.severity]++;
    issuesByCategory[issue.category] =
      (issuesByCategory[issue.category] || 0) + 1;
  });

  return {
    analysisTime: new Date(),
    totalIssuesFound: issues.length,
    issuesByCategory,
    issuesBySeverity,
    codeMetrics: {
      totalFiles: architectureResult.codeMetrics.fileCount,
      largeFiles: architectureResult.codeMetrics.largeFiles,
      averageFileSize: architectureResult.codeMetrics.averageFileSize,
    },
  };
}

/**
 * Identify project strengths
 */
function identifyStrengths(
  repoData: RepositoryData,
  categoryScores: Record<string, CategoryScore>,
  projectContext: ProjectContext
): string[] {
  const strengths: string[] = [];

  // High scores
  Object.entries(categoryScores).forEach(([category, data]) => {
    if (data.score >= 85) {
      strengths.push(
        `Excellent ${category} practices (${data.score}/100)`
      );
    } else if (data.score >= 75) {
      strengths.push(
        `Strong ${category} implementation (${data.score}/100)`
      );
    }
  });

  // Architecture strengths
  if (categoryScores.architecture.metrics?.hasProperLayering) {
    strengths.push(
      'Well-structured codebase with proper separation of concerns'
    );
  }

  if (categoryScores.architecture.metrics?.circularDependencies === 0) {
    strengths.push('Clean module structure with zero circular dependencies');
  }

  // Testing strengths
  if (categoryScores.testing.metrics?.hasTestFiles) {
    const frameworks = categoryScores.testing.metrics?.testFrameworks || [];
    if (frameworks.length > 1) {
      strengths.push(
        `Multiple testing frameworks (${frameworks.join(', ')})`
      );
    }

    if (
      categoryScores.testing.metrics?.testingTypes?.unit &&
      categoryScores.testing.metrics?.testingTypes?.e2e
    ) {
      strengths.push(
        'Comprehensive multi-type testing (unit, integration, E2E)'
      );
    }
  }

  if (categoryScores.testing.metrics?.hasCIIntegration) {
    strengths.push('Automated testing integrated in CI/CD pipeline');
  }

  // Project characteristics
  if (repoData.metadata.homepage) {
    strengths.push('Active deployment and live service');
  }

  if (
    repoData.metadata.watchers_count > 50 ||
    repoData.metadata.stargazers_count > 50
  ) {
    strengths.push('Strong community engagement and reputation');
  }

  if (repoData.readme && repoData.readme.length > 1000) {
    strengths.push('Comprehensive and detailed documentation');
  }

  if (repoData.packageJson?.devDependencies?.typescript) {
    strengths.push('Type-safe with TypeScript throughout the codebase');
  }

  if (repoData.packageJson?.scripts?.test) {
    strengths.push('Automated testing infrastructure configured');
  }

  // Context-specific strengths
  if (projectContext.intent === 'production-saas') {
    if (categoryScores.security.score >= 80) {
      strengths.push('Production-grade security practices in place');
    }
  }

  if (projectContext.intent === 'enterprise') {
    if (categoryScores.security.score >= 85) {
      strengths.push('Enterprise-level security and compliance standards');
    }
  }

  return strengths.slice(0, 10); // Top 10 strengths
}

/**
 * Generate critical blockers
 */
function generateCriticalBlockers(dangerousIssues: Issue[]): string[] {
  const blockers = dangerousIssues
    .filter(i => i.severity === 'critical')
    .slice(0, 5)
    .map(i => `${i.title} - ${i.impact}`);

  return blockers.length > 0 ? blockers : [];
}

/**
 * Generate prioritized next steps
 */
function generateNextSteps(
  issues: Issue[],
  projectContext: ProjectContext,
  categoryScores: Record<string, CategoryScore>
): string[] {
  const steps: string[] = [];

  // Critical security issues
  const criticalSecurity = issues.filter(
    i => i.category === 'Security' && i.severity === 'critical'
  );

  if (criticalSecurity.length > 0) {
    steps.push(`🔒 Fix ${criticalSecurity.length} critical security issue(s)`);
    criticalSecurity.slice(0, 1).forEach(issue => {
      steps.push(`   → ${issue.recommendation}`);
    });
  }

  // High priority architecture
  const highArchitecture = issues.filter(
    i => i.category === 'Architecture' && i.severity === 'high'
  );

  if (highArchitecture.length > 0) {
    steps.push(`🏗️  Resolve ${highArchitecture.length} architecture issue(s)`);
    highArchitecture.slice(0, 1).forEach(issue => {
      steps.push(`   → ${issue.recommendation}`);
    });
  }

  // Testing improvements
  if (categoryScores.testing.score < 70) {
    const testingIssues = categoryScores.testing.issues.slice(0, 1);
    if (testingIssues.length > 0) {
      steps.push(`🧪 Improve testing coverage`);
      steps.push(`   → ${testingIssues[0].recommendation}`);
    }
  }

  // Context-specific actions
  if (projectContext.intent === 'production-saas') {
    if (categoryScores.architecture.metrics?.circularDependencies > 0) {
      steps.push(
        `⚠️  Remove ${categoryScores.architecture.metrics.circularDependencies} circular dependencies`
      );
    }

    if (!categoryScores.testing.metrics?.hasCIIntegration) {
      steps.push(
        `✅ Integrate tests into CI/CD pipeline for continuous validation`
      );
    }
  }

  if (projectContext.intent === 'enterprise') {
    steps.push(`📋 Implement comprehensive audit logging`);
    steps.push(`🔐 Configure enterprise-grade security hardening`);
  }

  // Medium priority items
  const mediumPriority = issues
    .filter(i => i.severity === 'medium')
    .slice(0, 2);

  if (mediumPriority.length > 0) {
    steps.push(`📈 Address medium-priority improvements`);
    mediumPriority.forEach(issue => {
      steps.push(`   → ${issue.recommendation}`);
    });
  }

  return steps.slice(0, 12); // Top 12 recommendations
}

/**
 * Sort issues by severity priority
 */
function sortIssuesByPriority(issues: Issue[]): Issue[] {
  const severityOrder: Record<IssueSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...issues].sort(
    (a, b) =>
      (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4)
  );
}

/**
 * Generate human-readable analysis summary
 */
export function generateAnalysisSummary(analysis: Analysis): string {
  const divider = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

  return `
📊 REPOSITORY ANALYSIS SUMMARY
${divider}

📍 Repository: ${analysis.repoName}
🎯 Project Type: ${analysis.projectContext.intent} (${analysis.projectContext.confidence}% confidence)
📈 Maturity Score: ${analysis.maturityScore}/100 - ${analysis.level}
✅ Production Ready: ${analysis.isProductionReady ? '✓ Yes' : '✗ No'}

📋 CATEGORY SCORES:
   🔒 Security: ${analysis.categoryScores.security.score}/100
   🏗️  Architecture: ${analysis.categoryScores.architecture.score}/100
   🧪 Testing: ${analysis.categoryScores.testing.score}/100

⚠️  ISSUES FOUND:
   Critical: ${analysis.metadata.issuesBySeverity.critical}
   High: ${analysis.metadata.issuesBySeverity.high}
   Medium: ${analysis.metadata.issuesBySeverity.medium}
   Low: ${analysis.metadata.issuesBySeverity.low}

🌟 TOP STRENGTHS:
${analysis.strengths.slice(0, 3).map(s => `   ✓ ${s}`).join('\n')}

🚨 CRITICAL BLOCKERS:
${
  analysis.criticalBlockers.length > 0
    ? analysis.criticalBlockers.slice(0, 3).map(b => `   ⚠️  ${b}`).join('\n')
    : '   None'
}

📝 NEXT STEPS:
${analysis.nextSteps.slice(0, 5).map((step, i) => `   ${i + 1}. ${step}`).join('\n')}

${divider}
`;
}

/**
 * Export types for use in other modules
 */
export type { CategoryScore, AnalysisMetadata, RepositoryData };