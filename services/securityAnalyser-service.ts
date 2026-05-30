// src/services/securityAnalyzer.service.ts

import type { Issue } from '@/types/analysis';

interface SecurityAnalysisResult {
  issues: Issue[];
  score: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

/**
 * Comprehensive security analysis with 20+ vulnerability patterns
 */
export function analyzeSecurityIssues(
  codeFiles: Record<string, string>,
  dependencies?: Record<string, string>
): SecurityAnalysisResult {
  const issues: Issue[] = [];
  const severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

  // Analyze each file
  Object.entries(codeFiles).forEach(([filePath, content]) => {
    analyzeFileForSecurityIssues(filePath, content, issues);
  });

  // Global security checks
  analyzeGlobalSecurityIssues(codeFiles, dependencies, issues);

  // Count issues by severity
  issues.forEach(issue => {
    severityCounts[issue.severity as keyof typeof severityCounts]++;
  });

  const score = calculateSecurityScore(issues);

  return {
    issues,
    score,
    criticalCount: severityCounts.critical,
    highCount: severityCounts.high,
    mediumCount: severityCounts.medium,
    lowCount: severityCounts.low,
  };
}

/**
 * Analyze individual files for security vulnerabilities
 */
function analyzeFileForSecurityIssues(
  filePath: string,
  content: string,
  issues: Issue[]
): void {
  // 1. CRITICAL: Hardcoded secrets
  detectHardcodedSecrets(filePath, content, issues);

  // 2. CRITICAL: SQL Injection
  detectSQLInjection(filePath, content, issues);

  // 3. HIGH: Command Injection
  detectCommandInjection(filePath, content, issues);

  // 4. HIGH: XSS vulnerability
  detectXSSVulnerability(filePath, content, issues);

  // 5. HIGH: Insecure token storage
  detectInsecureTokenStorage(filePath, content, issues);

  // 6. HIGH: Path Traversal
  detectPathTraversal(filePath, content, issues);

  // 7. MEDIUM: Missing input validation
  detectMissingInputValidation(filePath, content, issues);

  // 8. MEDIUM: Overly permissive CORS
  detectPermissiveCORS(filePath, content, issues);

  // 9. HIGH: Sensitive file exposure
  detectSensitiveFileExposure(filePath, issues);

  // 10. MEDIUM: Insecure random generation
  detectInsecureRandom(filePath, content, issues);

  // 11. MEDIUM: Missing authentication/authorization
  detectMissingAuth(filePath, content, issues);

  // 12. LOW: Missing security headers
  detectMissingSecurityHeaders(filePath, content, issues);

  // 13. MEDIUM: Weak cryptography
  detectWeakCryptography(filePath, content, issues);

  // 14. MEDIUM: Unvalidated redirects
  detectUnvalidatedRedirects(filePath, content, issues);

  // 15. LOW: Console logs with sensitive data
  detectSensitiveConsoleLogging(filePath, content, issues);

  // 16. MEDIUM: Eval usage
  detectEvalUsage(filePath, content, issues);

  // 17. MEDIUM: Insecure dependency versions
  detectOutdatedDependencies(filePath, content, issues);
}

function detectHardcodedSecrets(filePath: string, content: string, issues: Issue[]): void {
  const secretPatterns = [
    { pattern: /(?:api[_-]?key|apikey|api_secret)\s*[=:]\s*['""`]([a-zA-Z0-9_\-]{8,})['""`]/gi, name: 'API Key' },
    { pattern: /(?:password|passwd|pwd)\s*[=:]\s*['""`]([a-zA-Z0-9_\-!@#$%]{8,})['""`]/gi, name: 'Password' },
    { pattern: /(?:token|access[_-]?token|refresh[_-]?token)\s*[=:]\s*['""`]([a-zA-Z0-9_\-\.]{20,})['""`]/gi, name: 'Token' },
    { pattern: /(?:secret|secret[_-]?key|private[_-]?key)\s*[=:]\s*['""`]([\s\S]{20,})['""`]/gi, name: 'Secret' },
    { pattern: /(?:db[_-]?password|database[_-]?password|pg[_-]?password)\s*[=:]\s*['""`]([a-zA-Z0-9_\-!@#$%]{6,})['""`]/gi, name: 'Database Password' },
    { pattern: /aws[_-]?(?:access[_-]?key|secret[_-]?access[_-]?key)\s*[=:]\s*['""`]([a-zA-Z0-9\/+=]{40,})['""`]/gi, name: 'AWS Key' },
  ];

  secretPatterns.forEach(({ pattern, name }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      issues.push({
        category: 'Security',
        severity: 'critical',
        title: `Hardcoded ${name} Detected`,
        description: `${name} found in code. This is a critical security vulnerability.`,
        isDangerous: true,
        impact: 'CRITICAL SECURITY BREACH - Credentials can be stolen from public repository',
        recommendation: 'Move all secrets to environment variables (.env file), use GitHub Secrets, or a secrets manager like Vault, AWS Secrets Manager, or HashiCorp Consul.',
        evidence: matches.slice(0, 2).map(m => m.substring(0, 50) + '...'),
        file: filePath,
      });
    }
  });
}

function detectSQLInjection(filePath: string, content: string, issues: Issue[]): void {
  const sqlPatterns = [
    /\$\{[^}]+\}.*(?:SELECT|INSERT|UPDATE|DELETE|DROP|CREATE)/gi,
    /`SELECT.*\${[^}]+}.*`/gi,
    /\+\s*(?:SELECT|INSERT|UPDATE|DELETE).*FROM\s*\w+/gi,
    /query\(\s*["'`]SELECT.*\$\{/gi,
  ];

  sqlPatterns.forEach((pattern) => {
    if (pattern.test(content) && !content.includes('prepared') && !content.includes('parameterized')) {
      issues.push({
        category: 'Security',
        severity: 'critical',
        title: 'SQL Injection Vulnerability',
        description: 'Unparameterized SQL queries detected. String concatenation for SQL is vulnerable to injection attacks.',
        isDangerous: true,
        impact: 'CRITICAL - DATABASE COMPROMISE - Data can be stolen, modified, or deleted',
        recommendation: 'Use parameterized queries/prepared statements. Use an ORM like Prisma, TypeORM, or Sequelize.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

function detectCommandInjection(filePath: string, content: string, issues: Issue[]): void {
  const cmdPatterns = [
    /(?:exec|spawn|execSync|spawnSync)\s*\(\s*['""`].*\$\{/gi,
    /child_process.*\$\{[^}]+\}/gi,
  ];

  cmdPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        category: 'Security',
        severity: 'critical',
        title: 'Command Injection Vulnerability',
        description: 'User input appears to be used in system command execution.',
        isDangerous: true,
        impact: 'CRITICAL - Remote code execution, server compromise',
        recommendation: 'Avoid executing system commands with user input. Use safer alternatives or validate/sanitize input strictly.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

function detectXSSVulnerability(filePath: string, content: string, issues: Issue[]): void {
  if (content.includes('dangerouslySetInnerHTML') && !content.includes('DOMPurify')) {
    issues.push({
      category: 'Security',
      severity: 'high',
      title: 'XSS Vulnerability - Unprotected dangerouslySetInnerHTML',
      description: 'Using React dangerouslySetInnerHTML without HTML sanitization.',
      isDangerous: true,
      impact: 'HIGH - XSS attacks can execute malicious scripts in user browsers',
      recommendation: 'Use DOMPurify library to sanitize HTML before rendering. Consider using regular text rendering instead.',
      evidence: [],
      file: filePath,
    });
  }

  if ((content.includes('innerHTML =') || content.includes('.innerHTML')) && !content.includes('DOMPurify')) {
    issues.push({
      category: 'Security',
      severity: 'high',
      title: 'XSS Vulnerability - Direct innerHTML Assignment',
      description: 'Direct HTML assignment without sanitization detected.',
      isDangerous: true,
      impact: 'HIGH - XSS attacks possible',
      recommendation: 'Use textContent for text, or DOMPurify for HTML content.',
      evidence: [],
      file: filePath,
    });
  }
}

function detectInsecureTokenStorage(filePath: string, content: string, issues: Issue[]): void {
  const patterns = [
    /localStorage\.setItem\s*\(\s*['"](.*token|.*auth|.*session)['"]/gi,
    /sessionStorage\.setItem\s*\(\s*['"](.*token|.*auth)['"]/gi,
  ];

  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        category: 'Security',
        severity: 'high',
        title: 'Insecure Token Storage in localStorage/sessionStorage',
        description: 'Sensitive tokens stored in browser storage where they can be accessed by XSS attacks.',
        isDangerous: true,
        impact: 'HIGH - Token theft via XSS, account compromise',
        recommendation: 'Use httpOnly, Secure cookies for tokens. Use secure session management. Avoid localStorage for sensitive data.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

function detectPathTraversal(filePath: string, content: string, issues: Issue[]): void {
  const patterns = [
    /readFile\s*\(\s*path\.join\s*\([^)]*\.\.\//gi,
    /join\s*\(\s*.*\$\{.*\}\s*.*\)\s*readFile/gi,
  ];

  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        category: 'Security',
        severity: 'high',
        title: 'Path Traversal Vulnerability',
        description: 'Potential path traversal vulnerability in file operations.',
        isDangerous: true,
        impact: 'HIGH - Unauthorized file access, information disclosure',
        recommendation: 'Validate and sanitize file paths. Use path.resolve() and ensure paths stay within allowed directories.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

function detectMissingInputValidation(filePath: string, content: string, issues: Issue[]): void {
  const hasInputs = /(?:input|form|textarea|select)\s+/gi.test(content);
  const hasValidation = /zod|yup|joi|class-validator|validator\.js|\.parse\(|\.validate\(/gi.test(content);

  if (hasInputs && !hasValidation && (filePath.includes('page') || filePath.includes('component'))) {
    issues.push({
      category: 'Security',
      severity: 'medium',
      title: 'Missing Input Validation',
      description: 'Form inputs found without explicit validation library.',
      isDangerous: false,
      impact: 'Invalid/malicious data can reach the system',
      recommendation: 'Add Zod, Yup, or Joi for schema validation. Validate on both client and server.',
      evidence: [],
      file: filePath,
    });
  }
}

function detectPermissiveCORS(filePath: string, content: string, issues: Issue[]): void {
  const patterns = [
    /Access-Control-Allow-Origin\s*[:=]\s*['"]\*['"]/gi,
    /cors\s*\(\s*\{\s*origin\s*:\s*['"]\*['"]|cors\s*\(\s*\{\s*origin\s*:\s*true/gi,
  ];

  patterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        category: 'Security',
        severity: 'medium',
        title: 'Overly Permissive CORS Policy',
        description: 'CORS allows access from any origin (*).',
        isDangerous: true,
        impact: 'MEDIUM - Data leakage, CSRF attacks, unauthorized access',
        recommendation: 'Restrict CORS to specific trusted domains. Never use "*" in production.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

function detectSensitiveFileExposure(filePath: string, issues: Issue[]): void {
  const sensitivePatterns = [
    /\.env\.local|\.env\.development|\.env\.production|\.env\.example/i,
    /config\.js$|settings\.js$|secrets\.js$/i,
    /private_key|secret_key|api_key/i,
  ];

  sensitivePatterns.forEach(pattern => {
    if (pattern.test(filePath)) {
      issues.push({
        category: 'Security',
        severity: 'high',
        title: 'Sensitive File May Be Exposed',
        description: `File "${filePath}" appears to contain sensitive information.`,
        isDangerous: true,
        impact: 'HIGH - Exposure of credentials and configuration',
        recommendation: 'Ensure sensitive files are in .gitignore. Use environment variables for all secrets.',
        evidence: [`File: ${filePath}`],
      });
    }
  });
}

function detectInsecureRandom(filePath: string, content: string, issues: Issue[]): void {
  if ((content.includes('Math.random()') || content.includes('_.random()')) && 
      (filePath.includes('token') || filePath.includes('session') || filePath.includes('crypto'))) {
    issues.push({
      category: 'Security',
      severity: 'medium',
      title: 'Insecure Random Number Generation',
      description: 'Math.random() used for security-sensitive operations (tokens, session IDs).',
      isDangerous: true,
      impact: 'MEDIUM - Predictable tokens/session IDs can be guessed',
      recommendation: 'Use crypto.getRandomValues() or similar cryptographically secure PRNG.',
      evidence: [],
      file: filePath,
    });
  }
}

function detectMissingAuth(filePath: string, content: string, issues: Issue[]): void {
  const hasApiRoute = filePath.includes('/api/') || filePath.includes('/routes/');
  const hasNoAuth = !content.includes('auth') && !content.includes('middleware') && !content.includes('authenticated');

  if (hasApiRoute && hasNoAuth) {
    issues.push({
      category: 'Security',
      severity: 'medium',
      title: 'Missing Authentication Check',
      description: 'API route appears to lack authentication verification.',
      isDangerous: false,
      impact: 'MEDIUM - Unauthorized access to API endpoints',
      recommendation: 'Add authentication middleware. Verify user identity before processing requests.',
      evidence: [],
      file: filePath,
    });
  }
}

function detectMissingSecurityHeaders(filePath: string, content: string, issues: Issue[]): void {
  const isServer = filePath.includes('server') || filePath.includes('middleware') || filePath.includes('api');
  const hasHelmet = content.includes('helmet');
  const hasManualHeaders = content.includes('X-Content-Type-Options') || content.includes('Content-Security-Policy');

  if (isServer && !hasHelmet && !hasManualHeaders && (content.includes('express') || content.includes('koa'))) {
    issues.push({
      category: 'Security',
      severity: 'low',
      title: 'Missing Security Headers',
      description: 'Security headers (CSP, X-Frame-Options, X-Content-Type-Options) not configured.',
      isDangerous: false,
      impact: 'LOW - Increased risk of XSS, clickjacking',
      recommendation: 'Use Helmet.js for Express/Koa, or manually configure security headers.',
      evidence: [],
      file: filePath,
    });
  }
}

function detectWeakCryptography(filePath: string, content: string, issues: Issue[]): void {
  const weakPatterns = [
    /md5|sha1|des(?!\w)/gi,
    /crypto\.createCipher\(/gi, // Deprecated, use createCipheriv
  ];

  weakPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        category: 'Security',
        severity: 'medium',
        title: 'Weak Cryptographic Algorithm',
        description: 'Weak or deprecated cryptographic algorithm used.',
        isDangerous: true,
        impact: 'MEDIUM - Encryption can be broken',
        recommendation: 'Use strong algorithms: SHA-256+, AES, bcrypt, Argon2.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

function detectUnvalidatedRedirects(filePath: string, content: string, issues: Issue[]): void {
  if ((content.includes('redirect(') || content.includes('window.location =')) && 
      (content.includes('req.query') || content.includes('url?') || content.includes('params'))) {
    issues.push({
      category: 'Security',
      severity: 'medium',
      title: 'Unvalidated Redirect',
      description: 'User input used in redirects without validation.',
      isDangerous: true,
      impact: 'MEDIUM - Open redirect to phishing sites',
      recommendation: 'Validate redirect URLs against a whitelist. Use relative URLs.',
      evidence: [],
      file: filePath,
    });
  }
}

function detectSensitiveConsoleLogging(filePath: string, content: string, issues: Issue[]): void {
  const sensitivePatterns = [
    /console\.log\s*\(\s*['"]*(?:password|token|secret|api[_-]?key|auth)['"]*\s*,/gi,
    /console\.\w+\s*\(\s*(?:req\.body|data|payload)\s*\)/gi,
  ];

  sensitivePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push({
        category: 'Security',
        severity: 'low',
        title: 'Sensitive Data in Console Logs',
        description: 'Sensitive data may be logged to console (visible in browser dev tools).',
        isDangerous: false,
        impact: 'LOW - Information disclosure',
        recommendation: 'Remove sensitive data from logs. Use secure logging with proper redaction.',
        evidence: [],
        file: filePath,
      });
    }
  });
}

function detectEvalUsage(filePath: string, content: string, issues: Issue[]): void {
  if (/\beval\s*\(|Function\s*\([^)]*\$\{/.test(content)) {
    issues.push({
      category: 'Security',
      severity: 'medium',
      title: 'Dangerous eval() Usage',
      description: 'eval() or dynamic Function() execution detected.',
      isDangerous: true,
      impact: 'CRITICAL - Arbitrary code execution',
      recommendation: 'Avoid eval(). Use JSON.parse(), or alternatives like vm module with sandboxing.',
      evidence: [],
      file: filePath,
    });
  }
}

function detectOutdatedDependencies(filePath: string, content: string, issues: Issue[]): void {
  if (filePath.includes('package.json')) {
    const oldPatterns = [
      /"express":\s*"[<~]1\./gi,
      /"react":\s*"[<~]1[0-6]\./gi,
      /"lodash":\s*"[<~]3\./gi,
    ];

    oldPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        issues.push({
          category: 'Security',
          severity: 'medium',
          title: 'Outdated Dependency Version',
          description: 'Project uses outdated versions of dependencies with known vulnerabilities.',
          isDangerous: false,
          impact: 'MEDIUM - Known security vulnerabilities in dependencies',
          recommendation: 'Update to latest stable versions. Use npm audit to identify vulnerabilities.',
          evidence: [],
          file: filePath,
        });
      }
    });
  }
}

/**
 * Global security checks
 */
function analyzeGlobalSecurityIssues(
  codeFiles: Record<string, string>,
  dependencies: Record<string, string> | undefined,
  issues: Issue[]
): void {
  const hasPackageJson = Object.keys(codeFiles).some(path => path.includes('package.json'));

  // Check for dependency vulnerability scanning
  if (hasPackageJson) {
    const hasDependabot = Object.keys(codeFiles).some(path => 
      path.includes('.github/dependabot.yml') || path.includes('.github/workflows') && 
      Object.values(codeFiles).some(content => content.includes('dependabot'))
    );

    if (!hasDependabot) {
      issues.push({
        category: 'Security',
        severity: 'medium',
        title: 'Missing Dependency Vulnerability Scanning',
        description: 'No automated dependency vulnerability scanning (Dependabot, Snyk, etc.) configured.',
        isDangerous: false,
        impact: 'MEDIUM - Exposure to known vulnerabilities',
        recommendation: 'Enable GitHub Dependabot or integrate Snyk. Regularly update dependencies.',
        evidence: [],
      });
    }
  }

  // Check HTTPS enforcement
  issues.push({
    category: 'Security',
    severity: 'low',
    title: 'Ensure HTTPS Enforcement',
    description: 'Application should enforce HTTPS in production.',
    isDangerous: false,
    impact: 'LOW - Data interception risk',
    recommendation: 'Configure hosting to redirect HTTP to HTTPS. Use HSTS headers.',
    evidence: [],
  });
}

/**
 * Calculate security score (0-100)
 */
export function calculateSecurityScore(issues: Issue[]): number {
  let score = 100;

  issues.forEach((issue) => {
    if (issue.severity === 'critical') score -= 30;
    else if (issue.severity === 'high') score -= 15;
    else if (issue.severity === 'medium') score -= 8;
    else if (issue.severity === 'low') score -= 3;
  });

  return Math.max(0, Math.min(100, score));
}

export { type SecurityAnalysisResult };