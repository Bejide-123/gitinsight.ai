"use client";

import {
  PlusCircle,
  History,
  FileText,
  Settings,
  BookOpen,
  User,
  Terminal,
} from "lucide-react";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-[260px] bg-[#050505] border-r border-white/10 flex flex-col p-4 text-sm text-white">
      
      {/* LOGO */}
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
          <Terminal className="w-5 h-5 text-black" />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight uppercase">
            GitInsight AI
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            Premium Engineering
          </p>
        </div>
      </div>

      {/* NAV */}
      <div className="flex-1 space-y-2">
        <button className="w-full text-zinc-500 hover:text-zinc-200 px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition">
          <PlusCircle className="w-5 h-5" />
          <span>New Analysis</span>
        </button>

        <button className="w-full bg-white/10 text-white rounded-lg border-l-2 border-cyan-400 px-4 py-2 flex items-center gap-3">
          <History className="w-5 h-5" />
          <span>Chat History</span>
        </button>

        <div className="pt-6 pb-2 px-4">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            Recent Repositories
          </p>
        </div>

        {/* Repo 1 */}
        <button className="w-full text-white/90 px-4 py-3 flex flex-col gap-1 hover:bg-white/5 border-l-2 border-cyan-500 bg-white/5 rounded-r-lg">
          <span className="text-xs font-mono truncate">
            vercel/next.js
          </span>
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 w-[94%]" />
            </div>
            <span className="text-[10px] text-cyan-400 font-bold">
              94/100
            </span>
          </div>
        </button>

        {/* Repo 2 */}
        <button className="w-full text-zinc-500 hover:text-zinc-200 px-4 py-3 flex flex-col gap-1 hover:bg-white/5">
          <span className="text-xs font-mono truncate">
            tailwindlabs/tailwindcss
          </span>
          <span className="text-[10px] text-zinc-600">
            Analyzed 2d ago
          </span>
        </button>

        <button className="w-full text-zinc-500 hover:text-zinc-200 px-4 py-2 flex items-center gap-3 hover:bg-white/5">
          <FileText className="w-5 h-5" />
          <span>Documentation</span>
        </button>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-auto space-y-4">
        <div className="p-4 bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-xl">
          <p className="text-xs text-zinc-400 mb-2">
            Unlock unlimited private repo scans
          </p>
          <button className="w-full py-2 bg-white text-black text-xs font-bold rounded">
            Upgrade to Pro
          </button>
        </div>

        <div className="flex items-center justify-around py-2 border-t border-white/5">
          <Settings className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer" />
          <BookOpen className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer" />
          <User className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer" />
        </div>
      </div>
    </aside>
  );
}