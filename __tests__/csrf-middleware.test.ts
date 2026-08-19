import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';
import { csrfProtection } from '@/middlewares/csrf';

function createRequest(options: {
  csrfCookie?: string;
  csrfHeader?: string;
  method?: string;
}) {
  const headers = new Headers();
  headers.set('cookie', `token=authenticated-session; csrf_token=${options.csrfCookie || ''}`);
  if (options.csrfHeader) {
    headers.set('x-csrf-token', options.csrfHeader);
  }

  return new NextRequest('http://localhost/api/analyse', {
    method: options.method || 'POST',
    headers,
    body: options.method === 'GET' ? undefined : JSON.stringify({ repoUrl: 'https://github.com/vercel/next.js' }),
  });
}

describe('CSRF middleware enforcement', () => {
  it('allows safe GET requests without a CSRF token', async () => {
    const response = await csrfProtection(createRequest({ method: 'GET' }));

    expect(response.status).toBe(200);
  });

  it('rejects a state-changing request without a CSRF token', async () => {
    const response = await csrfProtection(createRequest({}));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.error).toBe('CSRF token missing');
  });

  it('rejects a header that does not match the CSRF cookie', async () => {
    const response = await csrfProtection(createRequest({
      csrfCookie: 'cookie-token',
      csrfHeader: 'different-token',
    }));

    expect(response.status).toBe(403);
  });

  it('allows a state-changing request when cookie and header match', async () => {
    const token = generateCsrfToken('test-session');
    const response = await csrfProtection(createRequest({
      csrfCookie: token,
      csrfHeader: token,
    }));

    expect(response.status).toBe(200);
  });
});