import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ limit: 30, windowMs: 60_000 });

export function authMiddleware(req: NextRequest) {
  const routeRateLimit = limiter(req);
  if (routeRateLimit) {
    return routeRateLimit;
  }

  const token = req.cookies.get("token")?.value || req.cookies.get("auth_token")?.value;
  const pathname = req.nextUrl.pathname;

  console.log(`[AUTH MIDDLEWARE] Path: ${pathname}`);
  console.log(`[AUTH MIDDLEWARE] Token found: ${!!token}`);
  if (token) {
    console.log(`[AUTH MIDDLEWARE] Token preview: ${token.slice(0, 20)}...`);
  }

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/api')) {
      console.log(`[AUTH MIDDLEWARE] No token for API request, returning 401`);
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`[AUTH MIDDLEWARE] No token, redirecting to login`);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log(`[AUTH MIDDLEWARE] Token exists, forwarding to route handler for verification`);
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-auth-token', token);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}