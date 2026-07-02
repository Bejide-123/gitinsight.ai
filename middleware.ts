import { NextRequest } from "next/server";
import { authMiddleware } from "./middlewares/auth";

export function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  // Exclude /api/analyse from auth middleware so analysis can be run during demos
  matcher: ["/api/chat/:path*"],
};