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
      dependencies: [], // Removed 'basic-stack'
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

  // STARTUP
  {
    intent: 'startup',
    signals: {
      readme: [
        'startup',
        'growth',
        'scaling',
        'investors',
        'product-market fit',
      ],
      dependencies: [
        'next.js',
        'prisma',
        'trpc',
        'tailwind',
        'react-query',
      ],
      filePatterns: [
        'src/pages/api',
        'src/server',
        'db/schema',
        'e2e/',
        'tests/',
      ],
      deployment: [
        'vercel',
        'railway',
        'render',
        'aws',
        'gcp',
      ],
      complexity: [
        'medium-to-large',
        'full-stack',
        'database',
        'ci-cd',
        'some-tests',
      ],
    },
    weight: 1.3,
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
      dependencies: [], // Removed 'minimal-deps'
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
  const projectComplexitySignals = getProjectComplexity(data.fileTree, data.packageJson);

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

    // Check complexity signals
    if (rule.signals.complexity) {
      rule.signals.complexity.forEach((signal) => {
        if (projectComplexitySignals.includes(signal)) {
          intentScore += 8; // Slightly lower weight than direct signals
          detectedSignals.push(`Complexity: ${signal}`);
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

// Helper functions for complexity analysis
function getProjectComplexity(fileTree: FileTreeItem[], packageJson: any): string[] {
  const complexitySignals: string[] = [];

  // File count based complexity
  const fileCount = fileTree.length;
  if (fileCount < 50) {
    complexitySignals.push('small-to-medium');
  } else if (fileCount < 200) {
    complexitySignals.push('medium-complexity');
  } else if (fileCount < 500) {
    complexitySignals.push('medium-to-large');
  } else {
    complexitySignals.push('large-codebase');
  }

  // Backend detection
  if (hasBackend(packageJson)) {
    complexitySignals.push('full-stack');
  } else {
    complexitySignals.push('frontend-only');
  }

  // Test detection
  if (hasTests(fileTree)) {
    complexitySignals.push('some-tests');
  } else {
    complexitySignals.push('no-tests');
  }

  // CI/CD detection
  if (hasCICD(fileTree)) {
    complexitySignals.push('ci-cd');
  } else {
    complexitySignals.push('no-ci-cd');
  }

  // Database detection (simple check for now)
  const backendDeps = Object.keys(packageJson?.dependencies || {});
  if (backendDeps.some(dep => ['prisma', 'sequelize', 'typeorm', 'mongoose', 'knex'].includes(dep))) {
    complexitySignals.push('database');
  }

  // Microservices detection (simple check for now)
  if (fileTree.some(f => f.path.includes('microservices/') || f.path.includes('services/')) && fileCount > 200) {
    complexitySignals.push('multiple-services');
  }

  return complexitySignals;
}

function hasBackend(packageJson: any): boolean {
  const backendDeps = Object.keys(packageJson?.dependencies || {});
  const backendFrameworks = [
    'express',
    'koa',
    'nest.js',
    'fastify',
    'django',
    'flask',
    'spring-boot',
    'laravel',
    'ruby-on-rails',
  ];
  return backendDeps.some((dep) => backendFrameworks.includes(dep));
}

function hasTests(fileTree: FileTreeItem[]): boolean {
  const testPatterns = [
    'test/',
    'tests/',
    '.spec.',
    '.test.',
    'jest.config',
    'vitest.config',
    'cypress.config',
  ];
  return fileTree.some((f) => testPatterns.some((pattern) => f.path.includes(pattern)));
}

function hasCICD(fileTree: FileTreeItem[]): boolean {
  const ciCdPatterns = [
    '.github/workflows',
    '.gitlab-ci.yml',
    'jenkinsfile',
    'azure-pipelines.yml',
    'bitbucket-pipelines.yml',
  ];
  return fileTree.some((f) => ciCdPatterns.some((pattern) => f.path.includes(pattern)));
}