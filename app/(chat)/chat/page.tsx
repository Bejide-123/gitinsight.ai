"use client";

import EmptyChatHero from "@/components/chat/EmptyChatHero";

export default function Chat() {
  return (
    <main className="relative h-full w-full flex flex-col bg-[#050505] text-white overflow-hidden">
      {/* Background glow (optional but gives it that Vercel feel) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full" />
      </div>

      {/* Empty state hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <EmptyChatHero />
      </div>
    </main>
  );
}