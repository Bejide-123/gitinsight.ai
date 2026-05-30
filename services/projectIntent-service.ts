// src/services/projectIntent.service.ts

import type { GitHubRepo, FileTreeItem } from '@/types/github';
import type { ProjectIntent, ProjectContext } from '@/types/analysis';

interface IntentSignals {
  intent: ProjectIntent;
  signals: {
    readme?: string[];
    dependencies?: string[];
    filePatterns?: string[];
    deployment?: string[];
    frameworks?: string[];
    devDependencies?: string[];
  };
  weight: number;
}

const PROJECT_INTENT_RULES: IntentSignals[] = [
  {
    intent: 'portfolio',
    signals: {
      readme: ['portfolio', 'personal project', 'showcase', 'demo', 'my work', 'projects'],
      dependencies: ['framer-motion', 'gsap', 'three', 'react-spring', 'aos'],
      frameworks: ['next.js', 'gatsby', 'astro', 'remix'],
      filePatterns: ['projects/', 'portfolio/', 'work/', 'showcase/'],
      deployment: ['vercel', 'netlify', 'github-pages'],
    },
    weight: 1.0,
  },
  {
    intent: 'learning',
    signals: {
      readme: ['tutorial', 'learning', 'coursework', 'bootcamp', 'practice', 'course', 'educational'],
      devDependencies: ['jest', 'vitest', '@testing-library'],
      frameworks: ['react', 'vue', 'angular', 'svelte'],
      filePatterns: ['__tests__/', 'test/', 'examples/', 'docs/'],
    },
    weight: 0.9,
  },
  {
    intent: 'open-source-library',
    signals: {
      readme: ['library', 'package', 'npm', 'open source', 'plugin', 'module'],
      dependencies: ['typescript', 'rollup', 'webpack', 'vite', 'esbuild'],
      devDependencies: ['jest', 'vitest', 'mocha', 'chai', 'typescript'],
      filePatterns: ['src/', 'dist/', 'lib/', 'package.json'],
      deployment: ['npm', 'github-pages'],
    },
    weight: 1.3,
  },
  {
    intent: 'mvp',
    signals: {
      readme: ['mvp', 'beta', 'prototype', 'alpha', 'early stage', 'launch', 'startup idea'],
      dependencies: ['supabase', 'firebase', 'clerk', 'stripe', 'auth0', 'next-auth'],
      frameworks: ['next.js', 'remix', 'astro'],
      filePatterns: ['dashboard/', 'auth/', 'billing/', 'api/'],
      deployment: ['vercel', 'railway', 'render', 'fly.io'],
      devDependencies: ['tailwindcss', 'shadcn'],
    },
    weight: 1.2,
  },
  {
    intent: 'startup',
    signals: {
      readme: ['startup', 'saas', 'product', 'platform', 'service'],
      dependencies: ['stripe', 'clerk', 'supabase', 'prisma', 'zod'],
      frameworks: ['next.js', 'remix'],
      filePatterns: ['.github/workflows/', 'tests/', 'api/', 'components/', 'lib/'],
      devDependencies: ['jest', 'vitest', 'playwright', 'cypress', 'esbuild'],
      deployment: ['vercel', 'railway', 'render', 'aws'],
    },
    weight: 1.4,
  },
  {
    intent: 'production-saas',
    signals: {
      readme: ['production', 'live app', 'customers', 'saas', 'enterprise', 'production-ready'],
      dependencies: ['stripe', 'sentry', 'datadog', 'posthog', 'prisma', 'postgres', 'redis'],
      frameworks: ['next.js', 'nestjs', 'fastapi', 'django'],
      filePatterns: ['tests/', '.github/workflows/', 'monitoring/', 'api/', 'migrations/'],
      devDependencies: ['jest', 'vitest', 'cypress', 'playwright', 'husky', 'lint-staged'],
      deployment: ['vercel', 'aws', 'heroku', 'railway'],
    },
    weight: 1.6,
  },
  {
    intent: 'enterprise',
    signals: {
      readme: ['enterprise', 'banking', 'healthcare', 'government', 'regulated', 'compliance'],
      dependencies: ['kubernetes', 'kafka', 'redis', 'postgres', 'elasticsearch', 'vault'],
      frameworks: ['spring-boot', 'django', 'fastapi', 'go', 'java'],
      filePatterns: ['kubernetes/', 'terraform/', 'monitoring/', 'audit/', 'compliance/', 'docker-compose.yml'],
      devDependencies: ['jest', 'cypress', 'sonarqube', 'jacoco'],
      deployment: ['kubernetes', 'aws', 'gcp', 'azure'],
    },
    weight: 2.0,
  },
];

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
  const signalWeights: Record<string, number> = {};

  PROJECT_INTENT_RULES.forEach((rule) => {
    let intentScore = 0;

    // 1. README Analysis
    if (data.readme && rule.signals.readme) {
      const readmeWords = data.readme.toLowerCase().split(/\s+/);
      rule.signals.readme.forEach((signal) => {
        if (readmeWords.some(word => word.includes(signal.toLowerCase()))) {
          intentScore += 10;
          if (!detectedSignals.includes(`README: ${signal}`)) {
            detectedSignals.push(`README: ${signal}`);
          }
          signalWeights[`README: ${signal}`] = 10;
        }
      });
    }

    // 2. Dependencies Analysis
    if (data.packageJson?.dependencies && rule.signals.dependencies) {
      const deps = Object.keys(data.packageJson.dependencies || {}).map(d => d.toLowerCase());
      rule.signals.dependencies.forEach((signal) => {
        if (deps.some((dep) => dep.includes(signal.toLowerCase()))) {
          intentScore += 15;
          if (!detectedSignals.includes(`Dependency: ${signal}`)) {
            detectedSignals.push(`Dependency: ${signal}`);
          }
          signalWeights[`Dependency: ${signal}`] = 15;
        }
      });
    }

    // 3. DevDependencies Analysis
    if (data.packageJson?.devDependencies && rule.signals.devDependencies) {
      const devDeps = Object.keys(data.packageJson.devDependencies || {}).map(d => d.toLowerCase());
      rule.signals.devDependencies.forEach((signal) => {
        if (devDeps.some((dep) => dep.includes(signal.toLowerCase()))) {
          intentScore += 12;
          if (!detectedSignals.includes(`DevDep: ${signal}`)) {
            detectedSignals.push(`DevDep: ${signal}`);
          }
          signalWeights[`DevDep: ${signal}`] = 12;
        }
      });
    }

    // 4. Framework Detection
    if (rule.signals.frameworks) {
      const allDeps = {
        ...data.packageJson?.dependencies,
        ...data.packageJson?.devDependencies,
      };
      const depNames = Object.keys(allDeps).map(d => d.toLowerCase());
      
      rule.signals.frameworks.forEach((signal) => {
        if (depNames.some((dep) => dep.includes(signal.toLowerCase()))) {
          intentScore += 8;
          if (!detectedSignals.includes(`Framework: ${signal}`)) {
            detectedSignals.push(`Framework: ${signal}`);
          }
          signalWeights[`Framework: ${signal}`] = 8;
        }
      });
    }

    // 5. File Patterns Analysis
    if (rule.signals.filePatterns) {
      rule.signals.filePatterns.forEach((pattern) => {
        if (data.fileTree.some((f) => f.path.toLowerCase().includes(pattern.toLowerCase()))) {
          intentScore += 10;
          if (!detectedSignals.includes(`File: ${pattern}`)) {
            detectedSignals.push(`File: ${pattern}`);
          }
          signalWeights[`File: ${pattern}`] = 10;
        }
      });
    }

    // 6. Deployment Detection
    if (data.metadata.homepage && rule.signals.deployment) {
      const homepage = data.metadata.homepage.toLowerCase();
      rule.signals.deployment.forEach((platform) => {
        if (homepage.includes(platform.toLowerCase())) {
          intentScore += 8;
          if (!detectedSignals.includes(`Deployed: ${platform}`)) {
            detectedSignals.push(`Deployed: ${platform}`);
          }
          signalWeights[`Deployed: ${platform}`] = 8;
        }
      });
    }

    scores[rule.intent] = intentScore * rule.weight;
  });

  // Sort intents by score
  const sortedIntents = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topIntent = sortedIntents[0][0] as ProjectIntent;
  const topScore = sortedIntents[0][1];
  const secondScore = sortedIntents[1]?.[1] ?? 0;

  // Calculate confidence based on score gap
  let confidence = Math.min(100, topScore);
  
  // Adjust confidence if scores are very close
  if (secondScore > 0 && topScore > 0) {
    const scoreGap = ((topScore - secondScore) / topScore) * 100;
    confidence = Math.min(100, Math.max(40, scoreGap));
  }

  return {
    intent: topIntent,
    confidence: Math.round(confidence),
    signals: detectedSignals.slice(0, 5), // Top 5 signals
    expectedFeatures: getExpectedFeatures(topIntent),
    notRequiredFeatures: getNotRequiredFeatures(topIntent),
  };
}

function getExpectedFeatures(intent: ProjectIntent): string[] {
  const features: Record<ProjectIntent, string[]> = {
    portfolio: ['Clean UI', 'Responsive Design', 'Smooth animations', 'Deployment', 'Fast performance'],
    learning: ['Basic functionality', 'Code organization', 'Comments', 'Readable structure'],
    'open-source-library': ['TypeScript', 'Tests', 'Documentation', 'Example usage', 'Changelog'],
    mvp: ['Authentication', 'Core features', 'Database', 'Deployment', 'Basic monitoring'],
    startup: ['Authentication', 'Payments', 'Testing', 'Monitoring', 'Error tracking', 'Analytics'],
    'production-saas': ['Testing', 'Security', 'CI/CD', 'Monitoring', 'Error tracking', 'Audit logs', 'Performance optimization'],
    enterprise: ['Testing', 'Security', 'Compliance', 'Audit logs', 'Disaster recovery', 'High availability', 'Documentation'],
  };
  return features[intent];
}

function getNotRequiredFeatures(intent: ProjectIntent): string[] {
  const notRequired: Record<ProjectIntent, string[]> = {
    portfolio: ['Testing', 'CI/CD', 'Monitoring', 'Docker', 'Scalability'],
    learning: ['Payments', 'CI/CD', 'Monitoring', 'Scalability', 'Security hardening'],
    'open-source-library': ['Backend', 'Database', 'UI', 'Payments'],
    mvp: ['Extensive testing', 'Docker', 'Kubernetes', 'Multi-region'],
    startup: ['Kubernetes', 'Microservices', 'Multiple databases'],
    'production-saas': ['Kubernetes (initially)', 'Microservices (unless at scale)'],
    enterprise: [],
  };
  return notRequired[intent];
}

/**
 * Get detailed project context with all analysis
 */
export function getProjectContext(data: {
  readme: string | null;
  packageJson: any;
  fileTree: FileTreeItem[];
  metadata: GitHubRepo;
}): ProjectContext {
  return detectProjectIntent(data);
}