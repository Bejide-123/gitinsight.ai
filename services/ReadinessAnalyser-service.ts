// src/services/readinessAnalyzer.service.ts

import type { Issue } from '@/types/analysis';
import type { FileTreeItem } from '@/types/github';

interface ReadinessAnalysisResult {
  issues: Issue[];
  score: number;
  readinessMetrics: {
    hasDeploymentConfig: boolean;
    hasEnvironmentManagement: boolean;
    hasHealthChecks: boolean;
    hasErrorMonitoring: boolean;
    hasLoggingInfra: boolean;
    hasBackupStrategy: boolean;
    hasSecurityScanning: boolean;
    hasDependencyPinning: boolean;
    hasPerformanceOptimization: boolean;
    hasLoadBalancing: boolean;
    hasRateLimiting: boolean;
    hasCaching: boolean;
    readyItems: number;
    totalItems: number;
  };
}

/**
 * Analyze project readiness for deployment.
 *
 * Load balancing, disaster recovery, and full container orchestration are
 * SCALE infrastructure — they matter once a project has real production
 * traffic, not before. A solo MVP deployed on Vercel doesn't need its own
 * Kubernetes config to be "deployable." Those checks stay for visibility
 * but are weighted low; baseline deploy-readiness (lock file, env handling,
 * basic error visibility, dependency scanning) carries the real weight.
 */
export function analyzeReadiness(
  codeFiles: Record<string, string>,
  fileTree: FileTreeItem[],
  packageJson: any,
  metadata: any
): ReadinessAnalysisResult {
  const issues: Issue[] = [];
  const readinessMetrics = {
    hasDeploymentConfig: false,
    hasEnvironmentManagement: false,
    hasHealthChecks: false,
    hasErrorMonitoring: false,
    hasLoggingInfra: false,
    hasBackupStrategy: false,
    hasSecurityScanning: false,
    hasDependencyPinning: false,
    hasPerformanceOptimization: false,
    hasLoadBalancing: false,
    hasRateLimiting: false,
    hasCaching: false,
    readyItems: 0,
    totalItems: 12,
  };

  const filePaths = Object.keys(codeFiles);
  const treePathsLower = fileTree.map(f => f.path.toLowerCase());

  // A platform-deployed app (Vercel/Netlify/Render homepage set) doesn't
  // need its own Dockerfile to be "deployable" — the platform IS the
  // deployment path.
  const isPlatformDeployed = Boolean(metadata?.homepage);

  // 1. Check Deployment Configuration
  const hasDockerfile = filePaths.some(f => f.toLowerCase() === 'dockerfile' || f.includes('dockerfile'));
  const hasDockerCompose = treePathsLower.some(p => p.includes('docker-compose'));
  const hasKubernetes = treePathsLower.some(p => p.includes('kubernetes') || p.includes('k8s'));
  const hasTerraform = treePathsLower.some(p => p.includes('terraform'));

  if (hasDockerfile || hasDockerCompose || hasKubernetes || hasTerraform || isPlatformDeployed) {
    readinessMetrics.hasDeploymentConfig = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'No Clear Deployment Path',
      description: 'No Dockerfile, Docker Compose, or detected live deployment found.',
      isDangerous: false,
      impact: 'Unclear how this project would be deployed or run in production',
      recommendation: 'Add a Dockerfile, or deploy to a platform like Vercel/Render/Railway.',
      evidence: [],
    });
  }

  // 2. Check Environment Management
  const hasEnvExample = treePathsLower.some(p => p.includes('.env.example') || p.includes('.env.sample'));
  const handlesEnvVars = Object.values(codeFiles).some(content =>
    content.includes('process.env') || content.includes('Deno.env') || content.includes('import.meta.env')
  );

  if (hasEnvExample || !handlesEnvVars) {
    readinessMetrics.hasEnvironmentManagement = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'high',
      title: 'Incomplete Environment Variable Setup',
      description: 'Code reads environment variables but no .env.example documents them.',
      isDangerous: false,
      impact: 'Hard for anyone to know what config is required to run this project',
      recommendation: 'Add a .env.example listing every required variable with a placeholder value.',
      evidence: [],
    });
  }

  // 3. Check for Health Checks (scale concern — low severity pre-traffic)
  const hasHealthEndpoint = Object.values(codeFiles).some(content =>
    content.includes('/health') || content.includes('healthcheck') || content.includes('/status')
  );

  if (hasHealthEndpoint) {
    readinessMetrics.hasHealthChecks = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'low',
      title: 'No Health Check Endpoint',
      description: 'No /health or /status endpoint found.',
      isDangerous: false,
      impact: 'Relevant once running behind a load balancer or uptime monitor',
      recommendation: 'Add a simple /health endpoint when introducing uptime monitoring.',
      evidence: [],
    });
  }

  // 4. Check for Error Monitoring
  const hasErrorMonitoring = Object.values(codeFiles).some(content =>
    content.includes('sentry') || content.includes('datadog') || content.includes('newrelic')
  );

  if (hasErrorMonitoring) {
    readinessMetrics.hasErrorMonitoring = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'No Error Monitoring',
      description: 'No error tracking or monitoring system configured.',
      isDangerous: false,
      impact: 'Production errors may go unnoticed',
      recommendation: 'Integrate Sentry, Datadog, or similar once this serves real users.',
      evidence: [],
    });
  }

  // 5. Check for Logging Infrastructure
  const hasLogging = Object.values(codeFiles).some(content =>
    content.includes('winston') || content.includes('pino') || content.includes('bunyan') ||
    content.includes('logger') || content.includes('console.error')
  );

  if (hasLogging) {
    readinessMetrics.hasLoggingInfra = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'No Structured Logging',
      description: 'No structured logging system configured.',
      isDangerous: false,
      impact: 'Difficult to debug issues in production',
      recommendation: 'Implement structured logging with Winston, Pino, or similar.',
      evidence: [],
    });
  }

  // 6. Check for Backup Strategy (only matters once there's real user data)
  const hasBackupConfig = treePathsLower.some(p =>
    p.includes('backup') || p.includes('disaster') || p.includes('recovery')
  );

  if (hasBackupConfig) {
    readinessMetrics.hasBackupStrategy = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'low',
      title: 'No Documented Backup Strategy',
      description: 'No backup or disaster recovery documentation found.',
      isDangerous: false,
      impact: 'Worth addressing once the database holds real user data',
      recommendation: 'Document a backup approach once this handles real user data in production.',
      evidence: [],
    });
  }

  // 7. Check for Security Scanning
  const hasSecurityScanning = Object.values(codeFiles).some(content =>
    content.includes('dependabot') || content.includes('snyk') || content.includes('sonarqube') ||
    content.includes('trivy')
  ) || treePathsLower.some(p => p.includes('dependabot'));

  if (hasSecurityScanning) {
    readinessMetrics.hasSecurityScanning = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'low',
      title: 'No Automated Dependency Scanning',
      description: 'No Dependabot config or vulnerability scanner detected.',
      isDangerous: false,
      impact: 'Vulnerable dependencies could go unnoticed',
      recommendation: 'Enable Dependabot (free, built into GitHub) for automatic dependency alerts.',
      evidence: [],
    });
  }

  // 8. Check Dependency Pinning
  const hasLockFile = treePathsLower.some(p =>
    p.includes('package-lock.json') || p.includes('yarn.lock') || p.includes('pnpm-lock.yaml')
  );

  if (hasLockFile) {
    readinessMetrics.hasDependencyPinning = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'Missing Dependency Lock File',
      description: 'No lock file (package-lock.json, yarn.lock, etc.) found.',
      isDangerous: false,
      impact: 'Dependency versions can drift between environments',
      recommendation: 'Commit the lock file to version control. Use npm ci in CI/CD.',
      evidence: [],
    });
  }

  // 9. Check Performance Optimization
  const hasPerformanceOptimization = Object.values(codeFiles).some(content =>
    content.includes('lazy') || content.includes('dynamic(') || content.includes('next/image') ||
    content.includes('code splitting')
  );

  if (hasPerformanceOptimization) {
    readinessMetrics.hasPerformanceOptimization = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'low',
      title: 'No Obvious Performance Optimization',
      description: 'No lazy loading, code splitting, or image optimization detected.',
      isDangerous: false,
      impact: 'Minor — worth revisiting as the app grows',
      recommendation: 'Consider lazy loading and image optimization as the app scales.',
      evidence: [],
    });
  }

  // 10. Check Load Balancing (genuinely only relevant at scale — visibility only, low weight)
  const hasLoadBalancing = Object.values(codeFiles).some(content =>
    content.includes('nginx') || content.includes('haproxy') || content.includes('load.balanc')
  );

  readinessMetrics.hasLoadBalancing = hasLoadBalancing || isPlatformDeployed;
  // No issue raised here — not actionable or expected before real scale.

  // 11. Check Rate Limiting (only flagged meaningfully if there are public API routes)
  const hasApiRoutes = filePaths.some(f => f.includes('/api/') || f.includes('routes'));
  const hasRateLimiting = Object.values(codeFiles).some(content =>
    content.includes('rate.limit') || content.includes('rate-limit') || content.includes('throttle') ||
    content.includes('express-rate-limit')
  );

  if (hasRateLimiting || !hasApiRoutes) {
    readinessMetrics.hasRateLimiting = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'No Rate Limiting on API Routes',
      description: 'Public API routes were found with no rate limiting detected.',
      isDangerous: true,
      impact: 'API routes are exposed to abuse or basic DoS attempts',
      recommendation: 'Implement rate limiting on API endpoints (e.g. express-rate-limit).',
      evidence: [],
    });
  }

  // 12. Check Caching Strategy
  const hasCaching = Object.values(codeFiles).some(content =>
    content.includes('redis') || content.includes('memcached') || content.includes('cache-control') ||
    content.includes('revalidate')
  );

  if (hasCaching) {
    readinessMetrics.hasCaching = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'low',
      title: 'No Caching Strategy',
      description: 'No caching mechanism detected.',
      isDangerous: false,
      impact: 'Minor — only matters at meaningful traffic volume',
      recommendation: 'Add caching once response times or DB load become a real bottleneck.',
      evidence: [],
    });
  }

  readinessMetrics.readyItems = Object.values(readinessMetrics)
    .filter((v, i) => typeof v === 'boolean' && v).length;

  const score = calculateReadinessScore(readinessMetrics, fileTree);

  return {
    issues,
    score,
    readinessMetrics,
  };
}

/**
 * Calculate readiness score.
 *
 * Each item below contributes a fixed point value to the score EXACTLY
 * ONCE if present — no ratio calculation layered on top of flat
 * deductions and per-issue deductions for the same missing item.
 *
 * Baseline deploy-readiness (lock file, deployment path, env handling,
 * logging, security scanning) makes up 65 of 100 points — this is what
 * any deployed app actually needs. Scale infrastructure (health checks,
 * rate limiting, perf optimization, caching, load balancing, backups)
 * makes up the remaining 35 — these matter once there's real production
 * traffic, not as a baseline expectation for every project.
 */
export function calculateReadinessScore(
  metrics: ReadinessAnalysisResult['readinessMetrics'],
  fileTree: FileTreeItem[]
): number {
  let score = 0;

  // Baseline deploy-readiness — 65 pts total
  if (metrics.hasDependencyPinning) score += 15;
  if (metrics.hasDeploymentConfig) score += 15;
  if (metrics.hasEnvironmentManagement) score += 15;
  if (metrics.hasLoggingInfra) score += 10;
  if (metrics.hasSecurityScanning) score += 10;

  // Scale infrastructure — 35 pts total
  if (metrics.hasHealthChecks) score += 8;
  if (metrics.hasRateLimiting) score += 8;
  if (metrics.hasErrorMonitoring) score += 7;
  if (metrics.hasPerformanceOptimization) score += 6;
  if (metrics.hasCaching) score += 3;
  if (metrics.hasLoadBalancing) score += 2;
  if (metrics.hasBackupStrategy) score += 1;

  score = Math.max(0, Math.min(100, score));

  // A repo with actual code in it should never read as a flat 0 — that
  // number should only ever describe a genuinely empty repository.
  const hasAnyCode = fileTree.some(f => f.type === 'blob');
  if (hasAnyCode) {
    score = Math.max(score, 8);
  }

  return Math.round(score);
}

export type { ReadinessAnalysisResult };