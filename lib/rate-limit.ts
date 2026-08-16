import { NextRequest, NextResponse } from 'next/server';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

const store = new Map<string, { count: number; resetAt: number }>();

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

    const now = Date.now();
    const current = store.get(ip);

    if (!current || current.resetAt <= now) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return null;
    }

    if (current.count >= limit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please slow down and try again shortly.',
        },
        { status: 429 }
      );
    }

    current.count += 1;
    return null;
  };
}
