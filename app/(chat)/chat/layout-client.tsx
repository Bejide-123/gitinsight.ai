"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/chat/Sidebar";
import ChatHeader from "@/components/chat/Header";

export default function ChatLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent<{ isOpen: boolean }>) => {
      setIsSidebarOpen(event.detail.isOpen);
    };

    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener);
    };
  }, []);

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .main-content {
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
        <Sidebar />
        <div 
          className={`
            flex flex-col flex-1 h-full overflow-hidden main-content
            ${isSidebarOpen ? 'ml-[320px]' : 'ml-[72px]'}
          `}
        >
          {/* Header */}
          <ChatHeader />
          <main className="hide-scrollbar flex-1 overflow-y-scroll">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}