"use client";

import { Terminal } from "lucide-react";

export default function AnalysisLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
      
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Terminal Icon */}
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
          
          {/* pulse ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping" />

          <Terminal
            size={42}
            strokeWidth={1.5}
            className="text-cyan-400"
          />
        </div>

        {/* Heading */}
        <h2 className="mt-10 text-3xl font-semibold tracking-tight text-white">
          Analyzing Repository
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-zinc-500">
          Scanning commits, workflows, dependencies, architecture,
          and repository intelligence...
        </p>

        {/* Animated Progress Bar */}
        <div className="mt-10 h-[4px] w-80 overflow-hidden rounded-full bg-white/5">
          <div className="loader-bar h-full rounded-full bg-cyan-400" />
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
          <span className="h-[1px] w-6 bg-zinc-700" />
          Initializing Intelligence
          <span className="h-[1px] w-6 bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}