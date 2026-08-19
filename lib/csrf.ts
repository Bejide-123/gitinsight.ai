/**
 * Generate a CSRF token for a given session ID.
 * In production, store these in Redis or a session store with TTL.
 */
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

export function generateCsrfToken(sessionId: string): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  csrfTokens.set(sessionId, { token, expiresAt });
  return token;
}

export function verifyCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);

  if (!stored) {
    return false;
  }

  // Check expiration
  if (stored.expiresAt < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  const isValid = constantTimeEqual(stored.token, token);

  return isValid;
}

/**
 * Verify the double-submit cookie/header pair used by request middleware.
 * The cookie is readable by the browser and must be echoed in the header.
 */
export function verifyCsrfTokenPair(cookieToken: string, headerToken: string): boolean {
  if (!cookieToken || !headerToken) {
    return false;
  }

  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);

  return cookieBuffer.length === headerBuffer.length &&
    constantTimeEqual(cookieToken, headerToken);
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * Prevents attackers from guessing tokens character-by-character.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export function cleanupExpiredTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (data.expiresAt < now) {
      csrfTokens.delete(sessionId);
    }
  }
}

// Run cleanup every hour in production
if (process.env.NODE_ENV === 'production') {
  setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
}
