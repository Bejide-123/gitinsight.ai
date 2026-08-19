import { NextRequest } from "next/server";
import { authMiddleware } from "./middlewares/auth";
import { csrfProtection } from "./middlewares/csrf";

export async function middleware(req: NextRequest) {
  const authResponse = authMiddleware(req);

  if (authResponse.status !== 200) {
    return authResponse;
  }

  // Preserve the auth header that the route handlers use after authentication.
  const requestHeaders = new Headers(req.headers);
  const token = req.cookies.get("token")?.value || req.cookies.get("auth_token")?.value;
  if (token) {
    requestHeaders.set("x-auth-token", token);
  }

  const authenticatedRequest = new NextRequest(req, { headers: requestHeaders });
  return csrfProtection(authenticatedRequest);
}

export const config = {
  matcher: [
    "/api/chat/:path*",
    "/api/analyse",
    "/api/analysis/:path*",
    "/api/auth/logout",
    "/api/github",
    "/api/history",
  ],
};