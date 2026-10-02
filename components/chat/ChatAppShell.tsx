"use client";

import { useEffect, useState } from "react";
import ChatHeader from "./Header";
import Sidebar from "./Sidebar";

export function ChatAppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const { isOpen } = (event as CustomEvent<{ isOpen: boolean }>).detail;
      setIsSidebarOpen(isOpen);
    };

    window.addEventListener("sidebar-toggle", handleSidebarToggle);
    return () => window.removeEventListener("sidebar-toggle", handleSidebarToggle);
  }, []);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#07090c] text-white">
      <Sidebar />
      <div
        className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-[margin] duration-300 ease-in-out ${
          isSidebarOpen ? "ml-[280px]" : "ml-[72px]"
        }`}
      >
        <ChatHeader />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}