import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCsrfToken, getCsrfToken } from '@/services/auth-service';

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
    document.cookie = 'csrf_token=; max-age=0; path=/';
  });

  it('reads the CSRF token from its cookie', () => {
    document.cookie = 'csrf_token=test-csrf-token; path=/';
    expect(getCsrfToken()).toBe('test-csrf-token');
  });

  it('clears the CSRF cookie when logging out', () => {
    document.cookie = 'csrf_token=test-csrf-token; path=/';
    clearCsrfToken();
    expect(getCsrfToken()).toBeNull();
  });
});
