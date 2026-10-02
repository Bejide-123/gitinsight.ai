"use client";

import EmptyChatHero from "@/components/chat/EmptyChatHero";

export default function Chat() {
  return (
    <main className="h-full w-full overflow-y-auto bg-[#07090c] text-white">
      <EmptyChatHero />
    </main>
  );
}