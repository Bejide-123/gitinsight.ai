"use client";
import { useRouter } from "next/navigation"; // Fixed: useRouter instead of useNavigate

import { ArrowUp, Paperclip } from "lucide-react";

export default function BottomInput() {
  const router = useRouter(); // Fixed: useRouter() instead of useNavigate()
  
  return (
    <div className="absolute inset-x-0 bottom-0 z-50">
      
      {/* Gradient backdrop */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pointer-events-none" />

      <div className="relative px-8 pb-8">
        <div className="mx-auto max-w-4xl space-y-4">

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push("/chat/ReportPage")} // Fixed: router.push() instead of navigate()
              className="rounded-xl bg-white px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-zinc-200"
            >
              Full Report
            </button>
            <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-zinc-700 hover:bg-zinc-800">
              Deep Dive Security
            </button>
            <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 font-heading text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-zinc-700 hover:bg-zinc-800">
              View Raw Data
            </button>
          </div>

          {/* Input */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            <button className="flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:text-white">
              <Paperclip size={20} strokeWidth={2} />
            </button>

            <input
              type="text"
              placeholder="Ask follow-up questions about this analysis..."
              className="flex-1 bg-transparent font-body text-base text-white outline-none placeholder:text-zinc-600"
            />

            <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black transition-all hover:bg-zinc-200">
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}