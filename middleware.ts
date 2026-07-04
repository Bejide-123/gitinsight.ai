import { NextRequest } from "next/server";
import { authMiddleware } from "./middlewares/auth";

export function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  matcher: ["/api/chat/:path*", "/api/analyse", "/api/history"],
};