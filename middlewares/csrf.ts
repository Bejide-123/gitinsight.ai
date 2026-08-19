import { NextRequest, NextResponse } from 'next/server';
import { verifyCsrfTokenPair } from '@/lib/csrf';

/**
 * CSRF protection middleware for state-changing requests (POST, PUT, DELETE).
 * 
 * Safe GET requests are skipped. POST/PUT/DELETE require a valid CSRF token
 * in either the x-csrf-token header or csrf_token form field.
 */
export async function csrfProtection(request: NextRequest) {
  // Only protect state-changing methods
  const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(
    request.method
  );

  if (!isStateChanging) {
    return NextResponse.next();
  }

  const authToken = request.headers.get('x-auth-token') ||
    request.cookies.get('token')?.value ||
    request.cookies.get('auth_token')?.value;

  if (!authToken) {
    console.warn('[CSRF] No auth token found in request');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Extract CSRF token from request
  const csrfTokenFromHeader = request.headers.get('x-csrf-token');
  let csrfTokenFromBody = csrfTokenFromHeader;

  // If not in header, try to extract from request body
  if (!csrfTokenFromBody) {
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const clonedRequest = request.clone();
        const body = await clonedRequest.json();
        csrfTokenFromBody = body.csrf_token;
      }
    } catch (error) {
      // If body parsing fails, just use what we have
      console.warn('[CSRF] Failed to parse request body for CSRF token');
    }
  }

  if (!csrfTokenFromBody) {
    console.warn('[CSRF] No CSRF token found in request');
    return NextResponse.json(
      { error: 'CSRF token missing' },
      { status: 403 }
    );
  }

  const csrfCookie = request.cookies.get('csrf_token')?.value;
  const isValidCsrf = verifyCsrfTokenPair(csrfCookie || '', csrfTokenFromBody);

  if (!isValidCsrf) {
    console.warn('[CSRF] Invalid or expired CSRF token');
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}
