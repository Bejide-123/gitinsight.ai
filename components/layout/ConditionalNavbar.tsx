"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Assuming Navbar is in the same directory

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const noNavRoutes = ["/login", "/register"];
  const isChatRoute = pathname.startsWith("/chat");

  if (isChatRoute || noNavRoutes.includes(pathname)) {
    return null; // Don't render Navbar on chat, login, or register routes
  }

  return <Navbar />;
}
