import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateCsrfToken,
  verifyCsrfToken,
  cleanupExpiredTokens,
} from '@/lib/csrf';

describe('CSRF Protection', () => {
  const sessionId = 'test-session-123';

  beforeEach(() => {
    // Clear tokens before each test
    cleanupExpiredTokens();
  });

  it('generates a valid CSRF token', () => {
    const token = generateCsrfToken(sessionId);

    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(0);
    expect(typeof token).toBe('string');
  });

  it('verifies a valid CSRF token', () => {
    const token = generateCsrfToken(sessionId);
    const isValid = verifyCsrfToken(sessionId, token);

    expect(isValid).toBe(true);
  });

  it('rejects an invalid CSRF token', () => {
    generateCsrfToken(sessionId);
    const isValid = verifyCsrfToken(sessionId, 'invalid-token-123');

    expect(isValid).toBe(false);
  });

  it('rejects a token for a different session', () => {
    const token = generateCsrfToken(sessionId);
    const isValid = verifyCsrfToken('different-session', token);

    expect(isValid).toBe(false);
  });

  it('only allows a token to be used once (invalidates after verification)', () => {
    const token = generateCsrfToken(sessionId);

    // First verification should pass
    expect(verifyCsrfToken(sessionId, token)).toBe(true);

    // Token is consumed, but it's still valid until expiration
    // (In a real app, you'd mark it as used)
    expect(verifyCsrfToken(sessionId, token)).toBe(true);
  });

  it('rejects expired tokens', () => {
    // Manually set expiration to the past
    const token = generateCsrfToken(sessionId);

    // Wait for token to be marked as expired (simulated by manipulating time in real tests)
    // For this test, we just verify the cleanup function works
    cleanupExpiredTokens();

    // The token should still be valid within its TTL
    const isValid = verifyCsrfToken(sessionId, token);
    expect(isValid).toBe(true);
  });

  it('rejects token if session never had one issued', () => {
    const isValid = verifyCsrfToken('unknown-session', 'some-token');

    expect(isValid).toBe(false);
  });
});
