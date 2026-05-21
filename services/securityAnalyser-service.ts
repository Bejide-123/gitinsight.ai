// src/services/securityAnalyzer.service.ts

import type { Issue } from '@/types/analysis';

/**
 * Analyze code for security vulnerabilities
 */
export function analyzeSecurityIssues(
  codeFiles: Record<string, string>
): Issue[] {
  const issues: Issue[] = [];

  Object.entries(codeFiles).forEach(([filePath, content]) => {
    
    // 1. CRITICAL: Hardcoded secrets
    const secretPatterns = [
      /(?:API_KEY|APIKEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY)\s*=\s*["'`]([a-zA-Z0-9_\-]{8,})["'`]/gi,
      /(?:apiKey|api_key|accessToken|secretKey)\s*:\s*["'`]([a-zA-Z0-9_\-]{8,})["'`]/gi,
    ];

    secretPatterns.forEach((pattern) => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          category: 'Security',
          severity: 'critical',
          title: 'Hardcoded Secrets Detected',
          description: 'API keys or secrets found in code',
          isDangerous: true,
          impact: 'SECURITY BREACH - Credentials can be stolen from public repository',
          recommendation: 'Move all secrets to environment variables (.env)',
          evidence: matches.slice(0, 3), // Show first 3 examples
          file: filePath,
        });
      }
    });

    // 2. HIGH: SQL Injection risk
    const sqlInjectionPatterns = [
      /\$\{[^}]+\}.*(?:SELECT|INSERT|UPDATE|DELETE)/gi,
      /\+.*(?:SELECT|INSERT|UPDATE|DELETE).*FROM/gi,
    ];

    sqlInjectionPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        issues.push({
          category: 'Security',
          severity: 'critical',
          title: 'SQL Injection Vulnerability',
          description: 'Unparameterized SQL queries detected',
          isDangerous: true,
          impact: 'DATABASE COMPROMISE - Data can be stolen or deleted',
          recommendation: 'Use parameterized queries or ORM with prepared statements',
          evidence: [],
          file: filePath,
        });
      }
    });

    // 3. HIGH: XSS vulnerability
    if (content.includes('dangerouslySetInnerHTML') && !content.includes('DOMPurify')) {
      issues.push({
        category: 'Security',
        severity: 'high',
        title: 'XSS Vulnerability',
        description: 'Unsafe HTML rendering without sanitization',
        isDangerous: true,
        impact: 'XSS ATTACK - Malicious scripts can execute',
        recommendation: 'Use DOMPurify to sanitize HTML before rendering',
        evidence: [],
        file: filePath,
      });
    }

    // 4. MEDIUM: Insecure token storage
    if (content.includes('localStorage.setItem') && 
        (content.includes('token') || content.includes('auth') || content.includes('session'))) {
      issues.push({
        category: 'Security',
        severity: 'high',
        title: 'Insecure Token Storage',
        description: 'Sensitive tokens stored in localStorage',
        isDangerous: true,
        impact: 'Token theft via XSS attacks',
        recommendation: 'Use httpOnly cookies or secure session management',
        evidence: [],
        file: filePath,
      });
    }

    // 5. MEDIUM: No input validation
    const hasFormInputs = content.includes('input') || content.includes('form');
    const hasValidation = content.includes('zod') || 
                          content.includes('yup') || 
                          content.includes('.parse(') ||
                          content.includes('.validate(');
    
    if (hasFormInputs && !hasValidation && filePath.includes('Page')) {
      issues.push({
        category: 'Security',
        severity: 'medium',
        title: 'Missing Input Validation',
        description: 'Forms without validation library detected',
        isDangerous: false,
        impact: 'Invalid data can cause bugs or security issues',
        recommendation: 'Add Zod or Yup for input validation',
        evidence: [],
        file: filePath,
      });
    }
  });

  return issues;
}

/**
 * Calculate security score
 */
export function calculateSecurityScore(issues: Issue[]): number {
  let score = 100;

  issues.forEach((issue) => {
    if (issue.severity === 'critical') score -= 40;
    else if (issue.severity === 'high') score -= 25;
    else if (issue.severity === 'medium') score -= 10;
    else if (issue.severity === 'low') score -= 5;
  });

  return Math.max(0, score);
}