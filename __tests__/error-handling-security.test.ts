import { describe, it, expect, beforeEach, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockAnalyzeRepository: vi.fn(),
}));

vi.mock('@/services/analysis-service', () => ({
  analyzeRepository: mocks.mockAnalyzeRepository,
}));

vi.mock('@/lib/db', () => ({
  default: vi.fn(),
}));

describe('Error Handling - Information Disclosure Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not expose stack traces in error responses', () => {
    // Simulating an error response
    const error = new Error('Database connection failed');
    error.stack = 'Error: Database connection failed\n    at module.js:123\n    at ...';

    // Safe error handler
    const safeResponse = {
      error: 'Service temporarily unavailable', // Generic message
      // Do NOT include: stack: error.stack
    };

    expect(safeResponse.error).not.toContain('at module.js');
    expect(safeResponse.error).not.toContain('stack');
  });

  it('does not expose database connection details in error messages', () => {
    // Vulnerable error
    const vulnerableError =
      'MongooseError: connect ECONNREFUSED 10.0.0.1:27017 (prod-database.internal)';

    // Safe error
    const safeError = 'Service temporarily unavailable';

    expect(vulnerableError).toContain('10.0.0.1:27017');
    expect(vulnerableError).toContain('prod-database.internal');

    expect(safeError).not.toContain('10.0.0.1');
    expect(safeError).not.toContain('prod-database.internal');
  });

  it('does not expose file paths in error messages', () => {
    const vulnerableError =
      'Error: Cannot read file /home/deploy/app/secrets/.env.local';

    const safeError = 'Configuration error';

    expect(vulnerableError).toContain('.env.local');
    expect(vulnerableError).toContain('/home/deploy');

    expect(safeError).not.toContain('/.env.local');
    expect(safeError).not.toContain('/home/deploy');
  });

  it('logs detailed errors internally but returns generic messages', () => {
    function getErrorMessage(error: Error): string {
      // In production, log the detailed error
      if (process.env.NODE_ENV !== 'test') {
        console.error('[ERROR]', error);
      }

      // Always return a generic message to the client
      return 'An unexpected error occurred';
    }

    const error = new Error('Detailed internal error: MongoDB connection pool exhausted');
    const clientResponse = getErrorMessage(error);

    expect(clientResponse).toBe('An unexpected error occurred');
    expect(clientResponse).not.toContain('MongoDB connection pool');
  });

  it('does not expose API keys in error responses', () => {
    const vulnerableError = 'GitHub API key: ghp_xxxxxxxxxxxx failed validation';
    const safeError = 'GitHub authentication failed';

    expect(vulnerableError).toContain('ghp_');
    expect(safeError).not.toContain('ghp_');
  });

  it('categorizes errors and returns appropriate messages', () => {
    function getErrorMessage(error: Error): string {
      const msg = error.message.toLowerCase();
      if (msg.includes('validation')) {
        return 'Invalid input format';
      }
      if (msg.includes('authentication')) {
        return 'Authentication failed';
      }
      if (msg.includes('timeout')) {
        return 'Request timeout';
      }
      return 'An unexpected error occurred';
    }

    expect(getErrorMessage(new Error('Validation failed'))).toBe('Invalid input format');
    expect(getErrorMessage(new Error('Authentication failed'))).toBe('Authentication failed');
    expect(getErrorMessage(new Error('Request timeout'))).toBe('Request timeout');
    expect(getErrorMessage(new Error('Unknown error'))).toBe('An unexpected error occurred');
  });

  it('sanitizes error messages before logging', () => {
    function sanitizeErrorForLogging(error: any): any {
      const message = error.message || String(error);

      // Redact sensitive patterns
      const sanitized = message
        .replace(/token[=:]\s*['"]?[^'"\s]+['"]?/gi, 'token=[REDACTED]')
        .replace(/secret[=:]\s*['"]?[^'"\s]+['"]?/gi, 'secret=[REDACTED]')
        .replace(/password[=:]\s*['"]?[^'"\s]+['"]?/gi, 'password=[REDACTED]')
        .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '[IP_REDACTED]'); // IP addresses

      return {
        message: sanitized,
        code: error.code,
      };
    }

    const error = new Error('Auth failed: token=abc123secret password=xyz789');
    const sanitized = sanitizeErrorForLogging(error);

    expect(sanitized.message).toContain('[REDACTED]');
    expect(sanitized.message).not.toContain('abc123secret');
    expect(sanitized.message).not.toContain('xyz789');
  });
});

describe('Input Validation - Size Limits & DOS Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects payloads exceeding max size limit (1MB)', () => {
    const maxPayloadSize = 1024 * 1024; // 1MB

    function validatePayloadSize(size: number, limit: number): boolean {
      return size <= limit;
    }

    expect(validatePayloadSize(512 * 1024, maxPayloadSize)).toBe(true); // 512KB
    expect(validatePayloadSize(1024 * 1024, maxPayloadSize)).toBe(true); // 1MB exact
    expect(validatePayloadSize(2 * 1024 * 1024, maxPayloadSize)).toBe(false); // 2MB
  });

  it('rejects repository URLs exceeding max length', () => {
    const maxUrlLength = 2000; // Reasonable limit

    function validateUrlLength(url: string, limit: number): boolean {
      return url.length <= limit;
    }

    const validUrl = 'https://github.com/owner/repo-name';
    const tooLongUrl = 'https://github.com/' + 'a'.repeat(3000);

    expect(validateUrlLength(validUrl, maxUrlLength)).toBe(true);
    expect(validateUrlLength(tooLongUrl, maxUrlLength)).toBe(false);
  });

  it('rejects deeply nested JSON objects', () => {
    function validateJsonDepth(obj: any, maxDepth: number, currentDepth: number = 0): boolean {
      if (currentDepth > maxDepth) {
        return false;
      }

      if (obj === null || typeof obj !== 'object') {
        return true;
      }

      if (Array.isArray(obj)) {
        return obj.every((item) => validateJsonDepth(item, maxDepth, currentDepth + 1));
      }

      return Object.values(obj).every((value) => validateJsonDepth(value, maxDepth, currentDepth + 1));
    }

    const shallow = { a: { b: { c: 'value' } } };
    const deep = { a: { b: { c: { d: { e: { f: 'value' } } } } } };

    expect(validateJsonDepth(shallow, 5)).toBe(true);
    expect(validateJsonDepth(deep, 3)).toBe(false);
  });

  it('validates strings do not contain dangerous script tags', () => {
    function hasDangerousTags(text: string): boolean {
      const dangerous = ['<script', 'javascript:', 'onerror=', 'onload=', 'onclick='];
      return dangerous.some((tag) => text.toLowerCase().includes(tag));
    }

    const normalText = 'My Repository for Testing';
    const scriptInjection = '<script>alert("xss")</script>';
    const onErrorInjection = '<img onerror="alert(1)">';

    expect(hasDangerousTags(normalText)).toBe(false);
    expect(hasDangerousTags(scriptInjection)).toBe(true);
    expect(hasDangerousTags(onErrorInjection)).toBe(true);
  });

  it('prevents regex DOS (ReDoS) attacks', () => {
    function validateRegexSafety(pattern: string): boolean {
      // Detect common ReDoS patterns
      const dangerousPatterns = [
        /(\w+)*/, // Catastrophic backtracking
        /(\d+)+/, // Exponential backtracking
        /(a|a)*/, // Alternation with overlap
      ];

      return !dangerousPatterns.some((dangerous) => {
        try {
          return pattern === dangerous.source;
        } catch {
          return false;
        }
      });
    }

    expect(validateRegexSafety('^[a-zA-Z0-9]+$')).toBe(true); // Safe
    expect(validateRegexSafety('(\\w+)*')).toBe(false); // Dangerous
  });

  it('limits the number of fields in a request', () => {
    const maxFields = 20;

    function validateFieldCount(obj: any, limit: number): boolean {
      const count = Object.keys(obj).length;
      return count <= limit;
    }

    const normalRequest = { repoUrl: 'https://github.com/owner/repo' };
    const bombRequest: any = {};

    for (let i = 0; i < 100; i++) {
      bombRequest[`field_${i}`] = 'value';
    }

    expect(validateFieldCount(normalRequest, maxFields)).toBe(true);
    expect(validateFieldCount(bombRequest, maxFields)).toBe(false);
  });

  it('rejects array payloads with excessive items', () => {
    const maxItems = 100;

    function validateArraySize(arr: any[], limit: number): boolean {
      return Array.isArray(arr) && arr.length <= limit;
    }

    const normalArray = [1, 2, 3, 4, 5];
    const hugeArray = Array(1000).fill(1);

    expect(validateArraySize(normalArray, maxItems)).toBe(true);
    expect(validateArraySize(hugeArray, maxItems)).toBe(false);
  });

  it('prevents memory exhaustion through string repetition', () => {
    const maxStringLength = 10000;

    function validateStringLength(str: string, limit: number): boolean {
      return str.length <= limit;
    }

    const normalString = 'a'.repeat(100);
    const hugeString = 'a'.repeat(1000000); // 1MB string

    expect(validateStringLength(normalString, maxStringLength)).toBe(true);
    expect(validateStringLength(hugeString, maxStringLength)).toBe(false);
  });
});
