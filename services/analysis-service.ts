// services/analysis.service.ts

import { fetchRepositoryWithCode } from './github-service';
import { detectProjectIntent } from './projectIntent-service';
import { analyzeSecurityIssues, calculateSecurityScore } from './securityAnalyser-service';
import { analyzeArchitectureIssues, calculateArchitectureScore } from './architecturalAnalyser-service';
import { getScoringWeights, calculateMaturityScore } from '@/lib/scoringWeights';
import { getMaturityLevel } from '@/lib/constants';
import type { Analysis, Issue } from '@/types/analysis';

/**
 * Main analysis orchestrator
 * This combines all analyzers and produces the final analysis
 */
export async function analyzeRepository(repoUrl: string): Promise<Analysis> {
  
  // 1. Fetch repository data + code files
  console.log('📥 Fetching repository data...');
  const repoData = await fetchRepositoryWithCode(repoUrl);
  
  // 2. Detect project intent (portfolio vs MVP vs enterprise)
  console.log('🎯 Detecting project intent...');
  const projectContext = detectProjectIntent({
    readme: repoData.readme,
    packageJson: repoData.packageJson,
    fileTree: repoData.fileTree,
    metadata: repoData.metadata,
  });
  
  console.log(`   → Intent: ${projectContext.intent} (${projectContext.confidence}% confidence)`);
  
  // 3. Run all analyzers
  console.log('🔍 Running security analysis...');
  const securityIssues = analyzeSecurityIssues(repoData.codeFiles);
  
  console.log('🏗️  Running architecture analysis...');
  const architectureIssues = analyzeArchitectureIssues(
    repoData.codeFiles,
    repoData.fileTree
  );
  
  // TODO: Add more analyzers
  // const errorHandlingIssues = analyzeErrorHandling(repoData.codeFiles);
  // const performanceIssues = analyzePerformance(repoData.codeFiles);
  // const testingIssues = analyzeTesting(repoData.fileTree);
  
  // 4. Separate dangerous vs missing issues
  const allIssues = [
    ...securityIssues,
    ...architectureIssues,
    // ...errorHandlingIssues,
    // ...performanceIssues,
  ];
  
  const dangerousIssues = allIssues.filter(i => i.isDangerous);
  const missingImprovements = allIssues.filter(i => !i.isDangerous);
  
  console.log(`   → Found ${dangerousIssues.length} dangerous issues`);
  console.log(`   → Found ${missingImprovements.length} quality improvements`);
  
  // 5. Calculate category scores
  const categoryScores = {
    security: {
      score: calculateSecurityScore(securityIssues),
      weight: 0, // Will be set below
      issues: securityIssues,
    },
    architecture: {
      score: calculateArchitectureScore(architectureIssues),
      weight: 0,
      issues: architectureIssues,
    },
    // TODO: Add more categories
  };
  
  // 6. Get context-aware scoring weights
  const weights = getScoringWeights(projectContext.intent);
  
  // Apply weights to category scores
  categoryScores.security.weight = weights.security;
  categoryScores.architecture.weight = weights.architecture;
  
  // 7. Calculate overall maturity score
  const maturityScore = calculateMaturityScore(
    {
      security: categoryScores.security.score,
      architecture: categoryScores.architecture.score,
    },
    weights
  );
  
  // 8. Get maturity level
  const { level, production } = getMaturityLevel(maturityScore);
  
  console.log(`✅ Analysis complete: ${maturityScore}/100 - ${level}`);
  
  // 9. Identify strengths
  const strengths = identifyStrengths(repoData, categoryScores);
  
  // 10. Generate recommendations
  const criticalBlockers = dangerousIssues
    .filter(i => i.severity === 'critical')
    .map(i => i.title);
  
  const nextSteps = generateNextSteps(missingImprovements, projectContext);
  
  // 11. Build final analysis object
  const analysis: Analysis = {
    repoUrl,
    repoName: repoData.metadata.full_name,
    analyzedAt: new Date(),
    
    projectContext,
    
    maturityScore,
    level,
    isProductionReady: production && dangerousIssues.length === 0,
    
    categoryScores,
    
    dangerousIssues,
    missingImprovements,
    
    strengths,
    
    criticalBlockers,
    nextSteps,
    
    // TODO: Add AI insights from Claude API
    // aiInsights: await generateAIInsights(analysis),
  };
  
  return analysis;
}

/**
 * Identify project strengths
 */
function identifyStrengths(
  repoData: any,
  categoryScores: any
): string[] {
  const strengths: string[] = [];
  
  // High scores
  Object.entries(categoryScores).forEach(([category, data]: any) => {
    if (data.score >= 80) {
      strengths.push(`Strong ${category} implementation`);
    }
  });
  
  // Has deployment
  if (repoData.metadata.homepage) {
    strengths.push('Deployed and accessible');
  }
  
  // Has README
  if (repoData.readme && repoData.readme.length > 500) {
    strengths.push('Well-documented');
  }
  
  // TypeScript
  if (repoData.metadata.language === 'TypeScript') {
    strengths.push('Type-safe with TypeScript');
  }
  
  return strengths;
}

/**
 * Generate next steps based on issues and project intent
 */
function generateNextSteps(
  issues: Issue[],
  projectContext: any
): string[] {
  const steps: string[] = [];
  
  // Group issues by severity
  const highPriority = issues.filter(i => i.severity === 'high');
  const mediumPriority = issues.filter(i => i.severity === 'medium');
  
  // Add top 5 recommendations
  highPriority.slice(0, 3).forEach((issue, i) => {
    steps.push(`${i + 1}. ${issue.recommendation}`);
  });
  
  mediumPriority.slice(0, 2).forEach((issue, i) => {
    steps.push(`${highPriority.length + i + 1}. ${issue.recommendation}`);
  });
  
  return steps;
}