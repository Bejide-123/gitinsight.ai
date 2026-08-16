import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/services/auth-service';

describe('db configuration', () => {
  it('allows importing the db module without a configured MONGODB_URI', async () => {
    const originalUri = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    vi.resetModules();

    await expect(import('@/lib/db')).resolves.toBeDefined();

    if (originalUri) {
      process.env.MONGODB_URI = originalUri;
    }
  });
});

describe('auth service token handling', () => {
  beforeEach(() => {
    document.cookie = 'token=; max-age=0; path=/';
    document.cookie = 'auth_token=; max-age=0; path=/';
  });

  it('stores a token and reads it back from the cookie', () => {
    const token = 'test-token-123';

    setAuthToken(token);

    expect(getAuthToken()).toBe(token);
  });

  it('removes both token cookies when logging out', () => {
    setAuthToken('another-token');

    clearAuthToken();

    expect(getAuthToken()).toBeNull();
  });
});
