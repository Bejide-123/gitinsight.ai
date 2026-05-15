"use client";

import {
  ArrowUp,
  Paperclip,
} from "lucide-react";

export default function BottomInput() {
  return (
    <div className="absolute bottom-8 left-8 right-8 z-50">
      
      <div className="mx-auto flex max-w-4xl flex-col gap-4">

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3">
          
          <button className="rounded-xl border border-cyan-400/40 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-cyan-400 transition hover:bg-cyan-400 hover:text-black">
            Deep Dive Security
          </button>

          <button className="rounded-xl bg-white px-5 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-zinc-200">
            Export Results
          </button>

          <button className="rounded-xl border border-white/10 bg-zinc-900 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800">
            View Raw Data
          </button>
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-2">
          
          <button className="flex h-10 w-10 items-center justify-center text-zinc-500 transition hover:text-white">
            <Paperclip size={18} />
          </button>

          <input
            type="text"
            placeholder="Ask follow-up questions about this analysis..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />

          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition hover:bg-cyan-400">
            <ArrowUp size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}