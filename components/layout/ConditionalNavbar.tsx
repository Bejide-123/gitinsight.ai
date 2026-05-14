"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // Assuming Navbar is in the same directory

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isChatRoute = pathname.startsWith("/chat");

  if (isChatRoute) {
    return null; // Don't render Navbar on chat routes
  }

  return <Navbar />;
}
