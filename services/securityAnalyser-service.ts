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

    // 6. LOW: Missing Security Headers (e.g., Helmet.js for Node.js/Express)
    // This is a basic check, more advanced would involve parsing config files
    if (filePath.includes('server.js') || filePath.includes('app.js') || filePath.includes('middleware')) {
      if (!content.includes('helmet') && (content.includes('express') || content.includes('koa'))) {
        issues.push({
          category: 'Security',
          severity: 'low',
          title: 'Missing Security Headers',
          description: 'Security headers (like X-Content-Type-Options, X-Frame-Options, CSP) are not explicitly set, potentially leaving the application vulnerable to common web attacks.',
          isDangerous: false,
          impact: 'Increased risk of XSS, clickjacking, and other client-side attacks.',
          recommendation: 'Implement a security middleware like Helmet.js (for Express/Koa) or configure security headers directly in your web server (Nginx, Apache).',
          evidence: ['No "helmet" import or usage found in server-side files.'],
          file: filePath,
        });
      }
    }

    // 7. MEDIUM: Overly Permissive CORS
    if (content.includes('Access-Control-Allow-Origin: *') || content.includes('cors({ origin: "*"')) {
      issues.push({
        category: 'Security',
        severity: 'medium',
        title: 'Overly Permissive CORS Policy',
        description: 'The CORS policy allows access from any origin (*), which can expose sensitive data or functionality to unauthorized domains.',
        isDangerous: true,
        impact: 'Data leakage, CSRF attacks, and unauthorized API access.',
        recommendation: 'Restrict CORS to specific, trusted origins. Avoid using "*" in production environments.',
        evidence: ['"Access-Control-Allow-Origin: *" or similar found.'],
        file: filePath,
      });
    }

    // 8. HIGH: Sensitive File Exposure (basic check for common patterns)
    const sensitiveFilePatterns = [
      /(\.env|\.env\.local|\.env\.development|\.env\.production)/i,
      /(config\.js|settings\.js|credentials\.js)/i,
      /(private_key|secret_key|api_key)/i,
    ];
    sensitiveFilePatterns.forEach(pattern => {
      if (pattern.test(filePath) && content.length > 0) { // Check if file path matches and content is not empty
        issues.push({
          category: 'Security',
          severity: 'high',
          title: 'Potential Sensitive File Exposure',
          description: `A file named "${filePath}" appears to contain sensitive information or is a configuration file that should not be publicly accessible.`,
          isDangerous: true,
          impact: 'Exposure of sensitive credentials, API keys, or configuration details.',
          recommendation: 'Ensure sensitive files are properly excluded from version control (e.g., via .gitignore) and not deployed to public environments. Use environment variables for secrets.',
          evidence: [`File path matches sensitive pattern: ${filePath}`],
          file: filePath,
        });
      }
    });
  });

  // Global checks (not file-specific)
  // 9. MEDIUM: Missing Dependency Vulnerability Scanning (conceptual)
  // This check assumes we can infer the absence of a scanning tool
  const hasPackageJson = Object.keys(codeFiles).some(path => path.includes('package.json'));
  const hasLockFile = Object.keys(codeFiles).some(path => path.includes('package-lock.json') || path.includes('yarn.lock'));

  if (hasPackageJson && hasLockFile) {
    // This is a very basic heuristic. A real check would involve looking for CI/CD configs
    // or specific dependency scanning tool configurations.
    issues.push({
      category: 'Security',
      severity: 'medium',
      title: 'Missing Dependency Vulnerability Scanning',
      description: 'No explicit configuration for dependency vulnerability scanning (e.g., Dependabot, Snyk, Renovate) was detected. Outdated or vulnerable dependencies can introduce significant security risks.',
      isDangerous: false,
      impact: 'Exposure to known vulnerabilities in third-party libraries.',
      recommendation: 'Integrate a dependency vulnerability scanner into your CI/CD pipeline or use GitHub\'s Dependabot. Regularly update dependencies.',
      evidence: ['No clear signs of automated dependency scanning setup.'],
    });
  }

  // 10. LOW: Missing HTTPS Enforcement (conceptual)
  // This is hard to detect from code alone, but important to flag
  issues.push({
    category: 'Security',
    severity: 'low',
    title: 'Consider HTTPS Enforcement',
    description: 'While not directly detectable from code, ensuring all traffic is served over HTTPS is a fundamental security practice to protect data in transit.',
    isDangerous: false,
    impact: 'Data interception, man-in-the-middle attacks if HTTP is used.',
    recommendation: 'Configure your hosting environment or CDN to enforce HTTPS for all traffic. Obtain and configure SSL/TLS certificates.',
    evidence: ['Recommendation based on best practices.'],
  });

  return issues;
}

/**
 * Calculate security score
 */
export function calculateSecurityScore(issues: Issue[]): number {
  let score = 100; // Start with a base score

  // Deduct points for each issue
  issues.forEach((issue) => {
    if (issue.severity === 'critical') score -= 40;
    else if (issue.severity === 'high') score -= 25;
    else if (issue.severity === 'medium') score -= 10;
    else if (issue.severity === 'low') score -= 5;
  });

  // Ensure score doesn't go below 0
  return Math.max(0, score);
}