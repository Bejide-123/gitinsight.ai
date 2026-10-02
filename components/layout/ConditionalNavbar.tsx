"use client";

import { usePathname } from "next/navigation";
import Navbar from "./SiteNavbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const noNavRoutes = ["/login", "/register"];
  const isChatRoute = pathname.startsWith("/chat");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isChatRoute || isDashboardRoute || noNavRoutes.includes(pathname)) {
    return null; // Don't render Navbar on chat, login, or register routes
  }

  return <Navbar />;
}
