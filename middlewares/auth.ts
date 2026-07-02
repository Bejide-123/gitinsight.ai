import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function authMiddleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.cookies.get("auth_token")?.value;

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user', JSON.stringify(decoded));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}