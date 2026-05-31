import type { Metadata } from "next";
import "@/app/globals.css";
import Sidebar from "@/components/chat/Sidebar";
import ChatHeader from "@/components/chat/Header";


export const metadata: Metadata = {
  title: "Chat",
  description: "GitInsight AI Chat Interface",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        /* Hide scrollbar while maintaining scroll functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;      /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;              /* Chrome, Safari and Opera */
        }
      `}</style>

      <div className="flex h-screen w-full overflow-hidden bg-[#050505] text-white">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN AREA */}
        <div className="flex flex-col flex-1 ml-[260px] h-full overflow-hidden">
          {/* HEADER */}
          <ChatHeader />

          {/* CHAT CONTENT */}
          <main className="hide-scrollbar flex-1 overflow-y-scroll">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}