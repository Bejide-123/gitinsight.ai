// utils/projectIntent.ts
import type { ProjectIntent, ProjectContext } from "@/types/analysis";
import type { FileTreeItem, GitHubRepo } from "@/types/github";

interface IntentSignals {
  intent: ProjectIntent;
  signals: {
    readme?: string[];
    dependencies?: string[];
    filePatterns?: string[];
    deployment?: string[];
    complexity?: string[];
  };
  weight: number;
}

const PROJECT_INTENT_RULES: IntentSignals[] = [
  // PORTFOLIO PROJECT
  {
    intent: 'portfolio',
    signals: {
      readme: [
        'portfolio',
        'personal project',
        'learning',
        'practice',
        'demo',
        'showcase',
      ],
      dependencies: [
        'framer-motion', // Focus on UI
        'gsap',
        'three',
        'lottie',
      ],
      filePatterns: [
        'public/resume',
        'public/cv',
        'about-me',
        'portfolio',
      ],
      deployment: [
        'vercel',
        'netlify',
        'github-pages',
      ],
      complexity: [
        'small-to-medium', // < 50 files
        'no-backend',
        'frontend-only',
      ],
    },
    weight: 1.0,
  },

  // LEARNING PROJECT
  {
    intent: 'learning',
    signals: {
      readme: [
        'tutorial',
        'learning',
        'coursework',
        'bootcamp',
        'assignment',
        'practice',
        'following',
      ],
      dependencies: [
        'basic-stack', // React, no advanced libs
      ],
      complexity: [
        'simple-structure',
        'no-tests',
        'no-ci-cd',
      ],
    },
    weight: 1.0,
  },

  // MVP / STARTUP
  {
    intent: 'mvp',
    signals: {
      readme: [
        'mvp',
        'beta',
        'prototype',
        'alpha',
        'early stage',
      ],
      dependencies: [
        'supabase',
        'firebase',
        'clerk',
        'stripe', // Has payments
      ],
      filePatterns: [
        'dashboard',
        'auth',
        'billing',
      ],
      deployment: [
        'vercel',
        'railway',
        'render',
      ],
      complexity: [
        'medium-complexity',
        'some-tests',
      ],
    },
    weight: 1.2,
  },

  // PRODUCTION SAAS
  {
    intent: 'production-saas',
    signals: {
      readme: [
        'production',
        'live app',
        'customers',
        'users',
        'saas',
      ],
      dependencies: [
        'stripe',
        'sentry',
        'datadog',
        'posthog',
        'intercom',
      ],
      filePatterns: [
        'tests/',
        'e2e/',
        'ci/',
        '.github/workflows',
        'monitoring',
      ],
      complexity: [
        'large-codebase',
        'extensive-testing',
        'ci-cd',
      ],
    },
    weight: 1.5,
  },

  // ENTERPRISE SYSTEM
  {
    intent: 'enterprise',
    signals: {
      readme: [
        'enterprise',
        'banking',
        'healthcare',
        'government',
        'compliance',
      ],
      dependencies: [
        'kubernetes',
        'kafka',
        'redis',
        'microservices',
        'oauth2',
      ],
      filePatterns: [
        'kubernetes/',
        'docker-compose',
        'terraform/',
        'monitoring/',
        'security/',
      ],
      complexity: [
        'very-large',
        'extensive-tests',
        'multiple-services',
      ],
    },
    weight: 2.0,
  },

  // OPEN SOURCE LIBRARY
  {
    intent: 'open-source-library',
    signals: {
      readme: [
        'npm package',
        'library',
        'component library',
        'utility',
        'installation',
      ],
      dependencies: [
        'minimal-deps', // Few dependencies
      ],
      filePatterns: [
        'dist/',
        'lib/',
        'package/',
        'CONTRIBUTING.md',
        'CHANGELOG.md',
      ],
      complexity: [
        'well-documented',
        'extensive-tests',
        'typescript',
      ],
    },
    weight: 1.3,
  },
];

/**
 * Detect project intent from repository data
 */
export function detectProjectIntent(data: {
  readme: string | null;
  packageJson: any;
  fileTree: FileTreeItem[];
  metadata: GitHubRepo;
}): ProjectContext {
  const scores: Record<ProjectIntent, number> = {
    portfolio: 0,
    learning: 0,
    mvp: 0,
    startup: 0,
    'production-saas': 0,
    enterprise: 0,
    'open-source-library': 0,
  };

  const detectedSignals: string[] = [];

  // Analyze each intent
  PROJECT_INTENT_RULES.forEach((rule) => {
    let intentScore = 0;

    // Check README signals
    if (data.readme && rule.signals.readme) {
      rule.signals.readme.forEach((signal) => {
        if (data.readme!.toLowerCase().includes(signal)) {
          intentScore += 10;
          detectedSignals.push(`README: ${signal}`);
        }
      });
    }

    // Check dependencies
    if (data.packageJson?.dependencies && rule.signals.dependencies) {
      const deps = Object.keys(data.packageJson.dependencies);
      rule.signals.dependencies.forEach((signal) => {
        if (deps.some((dep) => dep.includes(signal))) {
          intentScore += 15;
          detectedSignals.push(`Dependency: ${signal}`);
        }
      });
    }

    // Check file patterns
    if (rule.signals.filePatterns) {
      rule.signals.filePatterns.forEach((pattern) => {
        if (data.fileTree.some((f) => f.path.includes(pattern))) {
          intentScore += 10;
          detectedSignals.push(`File: ${pattern}`);
        }
      });
    }

    // Check deployment
    if (data.metadata.homepage && rule.signals.deployment) {
      rule.signals.deployment.forEach((platform) => {
        if (data.metadata.homepage?.includes(platform)) {
          intentScore += 5;
          detectedSignals.push(`Deployed: ${platform}`);
        }
      });
    }

    scores[rule.intent] = intentScore * rule.weight;
  });

  // Find highest scoring intent
  const sortedIntents = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topIntent = sortedIntents[0][0] as ProjectIntent;
  const confidence = Math.min(100, sortedIntents[0][1]);

  return {
    intent: topIntent,
    confidence,
    signals: detectedSignals.slice(0, 5), // Top 5 signals
    expectedFeatures: getExpectedFeatures(topIntent),
    notRequiredFeatures: getNotRequiredFeatures(topIntent),
  };
}

/**
 * Get expected features for each project type
 */
function getExpectedFeatures(intent: ProjectIntent): string[] {
  const features: Record<ProjectIntent, string[]> = {
    portfolio: [
      'Clean UI',
      'Responsive design',
      'Deployment',
      'README',
      'Good structure',
    ],
    learning: [
      'Basic functionality',
      'Code organization',
      'Comments',
    ],
    mvp: [
      'Auth',
      'Core features',
      'Database',
      'Deployment',
      'Basic error handling',
    ],
    startup: [
      'Auth',
      'Payments',
      'Testing',
      'Error handling',
      'Monitoring',
    ],
    'production-saas': [
      'Testing',
      'Security',
      'Monitoring',
      'CI/CD',
      'Error tracking',
      'Rate limiting',
    ],
    enterprise: [
      'Extensive testing',
      'Security audit',
      'Monitoring',
      'CI/CD',
      'Documentation',
      'Compliance',
      'Audit logs',
    ],
    'open-source-library': [
      'TypeScript',
      'Tests',
      'Documentation',
      'Examples',
      'CI/CD',
      'Semantic versioning',
    ],
  };

  return features[intent];
}

/**
 * Features NOT required for each project type
 */
function getNotRequiredFeatures(intent: ProjectIntent): string[] {
  const notRequired: Record<ProjectIntent, string[]> = {
    portfolio: [
      'Testing',
      'CI/CD',
      'Monitoring',
      'Rate limiting',
      'Docker',
      'Kubernetes',
    ],
    learning: [
      'Testing',
      'CI/CD',
      'Monitoring',
      'Security hardening',
      'Performance optimization',
    ],
    mvp: [
      'Extensive testing',
      'Advanced monitoring',
      'Docker',
      'Kubernetes',
      'Microservices',
    ],
    startup: [
      'Kubernetes',
      'Microservices',
      'Advanced observability',
    ],
    'production-saas': [
      'Kubernetes',
      'Microservices',
    ],
    enterprise: [], // Everything matters
    'open-source-library': [
      'Backend',
      'Database',
      'Deployment',
    ],
  };

  return notRequired[intent];
}