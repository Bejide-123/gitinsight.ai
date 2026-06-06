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
 * Analyze project readiness for production deployment
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

  // 1. Check Deployment Configuration
  const hasDockerfile = filePaths.some(f => f.toLowerCase() === 'dockerfile' || f.includes('dockerfile'));
  const hasDockerCompose = treePathsLower.some(p => p.includes('docker-compose'));
  const hasKubernetes = treePathsLower.some(p => p.includes('kubernetes') || p.includes('k8s') || p.includes('.yaml'));
  const hasTerraform = treePathsLower.some(p => p.includes('terraform'));

  if (hasDockerfile || hasDockerCompose || hasKubernetes || hasTerraform) {
    readinessMetrics.hasDeploymentConfig = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'critical',
      title: 'Missing Deployment Configuration',
      description: 'No Dockerfile, Docker Compose, Kubernetes, or Terraform configuration found.',
      isDangerous: false,
      impact: 'Cannot containerize or deploy application reliably',
      recommendation: 'Create Dockerfile for containerization. Add docker-compose.yml for local dev. Consider Kubernetes or Terraform for production.',
      evidence: [],
    });
  }

  // 2. Check Environment Management
  const hasEnvFile = filePaths.some(f => f.toLowerCase().includes('.env'));
  const hasEnvExample = treePathsLower.some(p => p.includes('.env.example') || p.includes('.env.sample'));
  const handlesEnvVars = Object.values(codeFiles).some(content =>
    content.includes('process.env') || content.includes('Deno.env') || content.includes('import.meta.env')
  );

  if (hasEnvFile && hasEnvExample && handlesEnvVars) {
    readinessMetrics.hasEnvironmentManagement = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'high',
      title: 'Incomplete Environment Management',
      description: 'Missing or incomplete environment variable configuration.',
      isDangerous: true,
      impact: 'Secrets exposed in code, configuration not portable',
      recommendation: 'Implement proper env var handling. Use .env.example, handle secrets securely, support multiple environments.',
      evidence: [],
    });
  }

  // 3. Check for Health Checks
  const hasHealthEndpoint = Object.values(codeFiles).some(content =>
    content.includes('/health') || content.includes('healthcheck') || content.includes('/status')
  );

  if (hasHealthEndpoint) {
    readinessMetrics.hasHealthChecks = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'high',
      title: 'Missing Health Check Endpoint',
      description: 'No health check endpoint for monitoring and load balancing.',
      isDangerous: false,
      impact: 'Load balancers cannot detect unhealthy instances',
      recommendation: 'Implement /health or /status endpoint that returns service health status.',
      evidence: [],
    });
  }

  // 4. Check for Error Monitoring
  const hasErrorMonitoring = Object.values(codeFiles).some(content =>
    content.includes('sentry') || content.includes('datadog') || content.includes('newrelic') ||
    content.includes('error tracking') || content.includes('exception handling')
  );

  if (hasErrorMonitoring) {
    readinessMetrics.hasErrorMonitoring = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'high',
      title: 'Missing Error Monitoring',
      description: 'No error tracking or monitoring system configured.',
      isDangerous: false,
      impact: 'Cannot detect and fix production errors quickly',
      recommendation: 'Integrate Sentry, Datadog, New Relic, or similar error tracking platform.',
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
      title: 'Missing Logging Infrastructure',
      description: 'No structured logging system configured.',
      isDangerous: false,
      impact: 'Difficult to debug issues in production',
      recommendation: 'Implement structured logging with Winston, Pino, or Bunyan. Log to files or cloud service.',
      evidence: [],
    });
  }

  // 6. Check for Backup Strategy
  const hasBackupConfig = treePathsLower.some(p =>
    p.includes('backup') || p.includes('disaster') || p.includes('recovery')
  );

  if (hasBackupConfig) {
    readinessMetrics.hasBackupStrategy = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'critical',
      title: 'Missing Backup/Disaster Recovery Plan',
      description: 'No backup or disaster recovery configuration.',
      isDangerous: false,
      impact: 'Data loss risk, no recovery plan for outages',
      recommendation: 'Document backup strategy. Implement automated backups. Test recovery procedures regularly.',
      evidence: [],
    });
  }

  // 7. Check for Security Scanning
  const hasSecurityScanning = Object.values(codeFiles).some(content =>
    content.includes('dependabot') || content.includes('snyk') || content.includes('sonarqube') ||
    content.includes('trivy') || content.includes('owasp')
  );

  if (hasSecurityScanning) {
    readinessMetrics.hasSecurityScanning = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'high',
      title: 'Missing Security Vulnerability Scanning',
      description: 'No automated security scanning configured.',
      isDangerous: false,
      impact: 'Unknown vulnerabilities in dependencies',
      recommendation: 'Enable Dependabot, Snyk, or similar. Scan dependencies and code regularly.',
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
      severity: 'high',
      title: 'Missing Dependency Lock File',
      description: 'No lock file (package-lock.json, yarn.lock, etc.).',
      isDangerous: false,
      impact: 'Inconsistent dependencies across environments',
      recommendation: 'Commit lock file to version control. Use npm ci or yarn install --frozen-lockfile in CI/CD.',
      evidence: [],
    });
  }

  // 9. Check Performance Optimization
  const hasPerformanceOptimization = Object.values(codeFiles).some(content =>
    content.includes('compression') || content.includes('minify') || content.includes('bundle') ||
    content.includes('lazy load') || content.includes('code splitting') || content.includes('cache')
  );

  if (hasPerformanceOptimization) {
    readinessMetrics.hasPerformanceOptimization = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'Missing Performance Optimization',
      description: 'No performance optimization measures configured.',
      isDangerous: false,
      impact: 'Slow application, poor user experience',
      recommendation: 'Enable compression, code splitting, lazy loading. Optimize bundle size. Use caching strategies.',
      evidence: [],
    });
  }

  // 10. Check Load Balancing
  const hasLoadBalancing = Object.values(codeFiles).some(content =>
    content.includes('load.balanc') || content.includes('nginx') || content.includes('haproxy') ||
    content.includes('alb') || content.includes('nlb')
  );

  if (hasLoadBalancing) {
    readinessMetrics.hasLoadBalancing = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'Missing Load Balancer Configuration',
      description: 'No load balancing setup for high availability.',
      isDangerous: false,
      impact: 'Single point of failure, cannot handle traffic spikes',
      recommendation: 'Configure load balancer (Nginx, HAProxy, AWS ALB/NLB) for traffic distribution.',
      evidence: [],
    });
  }

  // 11. Check Rate Limiting
  const hasRateLimiting = Object.values(codeFiles).some(content =>
    content.includes('rate.limit') || content.includes('throttle') || content.includes('express-rate-limit')
  );

  if (hasRateLimiting) {
    readinessMetrics.hasRateLimiting = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'medium',
      title: 'Missing Rate Limiting',
      description: 'No rate limiting protection for API endpoints.',
      isDangerous: true,
      impact: 'Vulnerable to DoS attacks and abuse',
      recommendation: 'Implement rate limiting on API endpoints. Use express-rate-limit or similar middleware.',
      evidence: [],
    });
  }

  // 12. Check Caching Strategy
  const hasCaching = Object.values(codeFiles).some(content =>
    content.includes('redis') || content.includes('memcached') || content.includes('cache-control') ||
    content.includes('etag') || content.includes('caching')
  );

  if (hasCaching) {
    readinessMetrics.hasCaching = true;
  } else {
    issues.push({
      category: 'Readiness',
      severity: 'low',
      title: 'Missing Caching Strategy',
      description: 'No caching mechanism for performance optimization.',
      isDangerous: false,
      impact: 'Slower response times, higher resource usage',
      recommendation: 'Implement Redis/Memcached caching, HTTP caching headers, and CDN caching.',
      evidence: [],
    });
  }

  readinessMetrics.readyItems = Object.values(readinessMetrics)
    .filter((v, i) => typeof v === 'boolean' && v).length;

  const score = calculateReadinessScore(readinessMetrics, issues);

  return {
    issues,
    score,
    readinessMetrics,
  };
}

/**
 * Calculate readiness score
 */
export function calculateReadinessScore(
  metrics: ReadinessAnalysisResult['readinessMetrics'],
  issues: Issue[]
): number {
  // Base score from ready items
  const readyScore = (metrics.readyItems / metrics.totalItems) * 100;

  // Heavy deductions for critical missing items
  let deductions = 0;

  if (!metrics.hasDeploymentConfig) deductions += 20;
  if (!metrics.hasEnvironmentManagement) deductions += 15;
  if (!metrics.hasHealthChecks) deductions += 12;
  if (!metrics.hasErrorMonitoring) deductions += 12;
  if (!metrics.hasBackupStrategy) deductions += 15;
  if (!metrics.hasSecurityScanning) deductions += 10;
  if (!metrics.hasDependencyPinning) deductions += 8;
  if (!metrics.hasLoggingInfra) deductions += 8;
  if (!metrics.hasPerformanceOptimization) deductions += 6;
  if (!metrics.hasRateLimiting) deductions += 8;

  // Additional deductions for issues
  issues.forEach(issue => {
    if (issue.severity === 'critical') deductions += 5;
    else if (issue.severity === 'high') deductions += 3;
    else if (issue.severity === 'medium') deductions += 1;
  });

  return Math.max(0, Math.min(100, readyScore - deductions));
}

export type { ReadinessAnalysisResult };