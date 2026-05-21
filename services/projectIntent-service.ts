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
  };
  weight: number;
}

const PROJECT_INTENT_RULES: IntentSignals[] = [
  {
    intent: 'portfolio',
    signals: {
      readme: ['portfolio', 'personal project', 'showcase', 'demo'],
      dependencies: ['framer-motion', 'gsap', 'three'],
      deployment: ['vercel', 'netlify', 'github-pages'],
    },
    weight: 1.0,
  },
  {
    intent: 'learning',
    signals: {
      readme: ['tutorial', 'learning', 'coursework', 'bootcamp', 'practice'],
    },
    weight: 1.0,
  },
  {
    intent: 'mvp',
    signals: {
      readme: ['mvp', 'beta', 'prototype', 'alpha'],
      dependencies: ['supabase', 'firebase', 'clerk', 'stripe'],
      filePatterns: ['dashboard', 'auth', 'billing'],
      deployment: ['vercel', 'railway', 'render'],
    },
    weight: 1.2,
  },
  {
    intent: 'production-saas',
    signals: {
      readme: ['production', 'live app', 'customers', 'saas'],
      dependencies: ['stripe', 'sentry', 'datadog', 'posthog'],
      filePatterns: ['tests/', '.github/workflows', 'monitoring'],
    },
    weight: 1.5,
  },
  {
    intent: 'enterprise',
    signals: {
      readme: ['enterprise', 'banking', 'healthcare', 'government'],
      dependencies: ['kubernetes', 'kafka', 'redis'],
      filePatterns: ['kubernetes/', 'terraform/', 'monitoring/'],
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

  PROJECT_INTENT_RULES.forEach((rule) => {
    let intentScore = 0;

    // Check README
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
    signals: detectedSignals.slice(0, 5),
    expectedFeatures: getExpectedFeatures(topIntent),
    notRequiredFeatures: getNotRequiredFeatures(topIntent),
  };
}

function getExpectedFeatures(intent: ProjectIntent): string[] {
  const features: Record<ProjectIntent, string[]> = {
    portfolio: ['Clean UI', 'Responsive', 'Deployment'],
    learning: ['Basic functionality', 'Code organization'],
    mvp: ['Auth', 'Core features', 'Database', 'Deployment'],
    startup: ['Auth', 'Payments', 'Testing', 'Monitoring'],
    'production-saas': ['Testing', 'Security', 'CI/CD', 'Monitoring'],
    enterprise: ['Testing', 'Security', 'Compliance', 'Audit logs'],
    'open-source-library': ['TypeScript', 'Tests', 'Documentation'],
  };
  return features[intent];
}

function getNotRequiredFeatures(intent: ProjectIntent): string[] {
  const notRequired: Record<ProjectIntent, string[]> = {
    portfolio: ['Testing', 'CI/CD', 'Monitoring', 'Docker'],
    learning: ['Testing', 'CI/CD', 'Monitoring', 'Security hardening'],
    mvp: ['Extensive testing', 'Docker', 'Kubernetes'],
    startup: ['Kubernetes', 'Microservices'],
    'production-saas': ['Kubernetes'],
    enterprise: [],
    'open-source-library': ['Backend', 'Database'],
  };
  return notRequired[intent];
}