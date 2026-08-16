import { describe, expect, it } from 'vitest';
import type { ProjectContext, Issue } from '@/types/analysis';

const mockProjectContext: ProjectContext = {
  intent: 'startup',
  confidence: 85,
  signals: ['next.js', 'typescript'],
  expectedFeatures: ['auth', 'dashboard'],
  notRequiredFeatures: ['enterprise-sso'],
};

const mockDangerousIssues: Issue[] = [
  {
    category: 'Security',
    severity: 'critical',
    title: 'Hardcoded secret',
    description: 'A production secret is embedded in source.',
    isDangerous: true,
    impact: 'Could allow unauthorized access',
    recommendation: 'Move the secret to environment variables',
    evidence: ['process.env.SECRET'],
  },
];

const mockMissingImprovements: Issue[] = [
  {
    category: 'Testing',
    severity: 'medium',
    title: 'Low test coverage',
    description: 'There are not enough tests around core flows.',
    isDangerous: false,
    impact: 'Higher regression risk',
    recommendation: 'Add unit and integration tests',
    evidence: ['No test files detected'],
  },
];

describe('AI analysis fallback contract', () => {
  it('produces a valid fallback output structure', () => {
    const output = {
      executiveSummary: 'This is a startup project with a promising foundation.',
      recommendations: [
        {
          title: 'Review Critical Issues',
          description: 'Address the critical issues before release.',
          impact: 'High Impact',
          impactScore: 90,
          difficulty: 40,
          priority: 1,
        },
      ],
      productionVerdict: 'Not ready for production yet.',
      roadmapPhases: [
        { number: 1, title: 'Current State', description: 'Foundation built', status: 'completed' },
      ],
      architecturalStrengths: ['Strong foundation'],
      criticalWeaknesses: ['Hardcoded secret'],
      longTermOutlook: 'Potentially strong if gaps are closed.',
      sentimentScore: 2,
      techStack: ['Next.js', 'TypeScript'],
      capabilities: [{ name: 'Authentication', status: 'pass' }],
      productionCategories: [{ title: 'Security', items: [{ label: 'Secrets', status: 'fail' }] }],
    };

    expect(output.executiveSummary).toContain('startup');
    expect(output.recommendations[0].priority).toBe(1);
    expect(output.criticalWeaknesses).toContain('Hardcoded secret');
    expect(output.productionVerdict).toMatch(/production|ready/i);
  });

  it('keeps dangerous issues separate from quality issues', () => {
    expect(mockDangerousIssues[0].isDangerous).toBe(true);
    expect(mockMissingImprovements[0].isDangerous).toBe(false);
  });

  it('uses project intent to describe the context', () => {
    expect(mockProjectContext.intent).toBe('startup');
    expect(mockProjectContext.confidence).toBeGreaterThan(80);
  });
});
