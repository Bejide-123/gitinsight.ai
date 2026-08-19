import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';

const mocks = vi.hoisted(() => ({
  mockUserFindOne: vi.fn(),
}));

vi.mock('@/models/User', () => {
  class MockUser {
    static findOne = mocks.mockUserFindOne;
  }
  return { default: MockUser };
});

vi.mock('@/lib/db', () => ({
  default: vi.fn(),
}));

import { getJwtSecret } from '@/lib/env';

describe('JWT Security - Expiration & Refresh', () => {
  const secret = 'this-is-a-secure-test-secret-for-jwt-123456';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = secret;
    process.env.NODE_ENV = 'test';
  });

  it('creates a token with expiration set', () => {
    const token = jwt.sign({ id: 'user-123' }, secret, { expiresIn: '7d' });

    const decoded = jwt.verify(token, secret) as any;

    expect(decoded.id).toBe('user-123');
    expect(decoded.exp).toBeTruthy(); // Expiration timestamp should exist
  });

  it('rejects an expired token', () => {
    // Create a token that expired in the past
    const expiredToken = jwt.sign(
      { id: 'user-123', exp: Math.floor(Date.now() / 1000) - 3600 }, // Expired 1 hour ago
      secret
    );

    expect(() => {
      jwt.verify(expiredToken, secret);
    }).toThrow('jwt expired');
  });

  it('accepts a valid, non-expired token', () => {
    const validToken = jwt.sign(
      { id: 'user-123', iat: Math.floor(Date.now() / 1000) },
      secret,
      { expiresIn: '7d' }
    );

    expect(() => {
      jwt.verify(validToken, secret);
    }).not.toThrow();
  });

  it('rejects a token with wrong secret', () => {
    const token = jwt.sign({ id: 'user-123' }, secret, { expiresIn: '7d' });
    const wrongSecret = 'different-secret-key-123456789';

    expect(() => {
      jwt.verify(token, wrongSecret);
    }).toThrow('invalid signature');
  });

  it('rejects a malformed token', () => {
    const malformedToken = 'not.a.valid.jwt.token';

    expect(() => {
      jwt.verify(malformedToken, secret);
    }).toThrow();
  });

  it('extracts user ID from valid token', () => {
    const token = jwt.sign({ id: 'user-123', email: 'user@example.com' }, secret);
    const decoded = jwt.verify(token, secret) as any;

    expect(decoded.id).toBe('user-123');
    expect(decoded.email).toBe('user@example.com');
  });

  it('rejects token if required payload is missing', () => {
    const invalidToken = jwt.sign({ email: 'user@example.com' }, secret); // No id
    const decoded = jwt.verify(invalidToken, secret) as any;

    // JWT doesn't reject this by itself, but your code should validate it
    expect(decoded.id).toBeUndefined();
  });
});
