import { NextRequest, NextResponse } from 'next/server';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

const store = new Map<string, { count: number; resetAt: number }>();

/**
 * Check if an IP has exceeded rate limit.
 * Returns true if rate limited, false if within limit.
 */
export function checkRateLimit(
  ip: string,
  limit: number = MAX_REQUESTS,
  windowMs: number = WINDOW_MS
): boolean {
  const now = Date.now();
  const current = store.get(ip);

  if (!current || current.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (current.count >= limit) {
    return true;
  }

  current.count += 1;
  return false;
}

/**
 * Clear all rate limit records (for testing only).
 */
export function clearRateLimitStore(): void {
  store.clear();
}

export function rateLimit({
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS,
}: {
  limit?: number;
  windowMs?: number;
} = {}) {
  return function middleware(req: NextRequest) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'local';

    if (checkRateLimit(ip, limit, windowMs)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please slow down and try again shortly.',
        },
        { status: 429 }
      );
    }

    return null;
  };
}
