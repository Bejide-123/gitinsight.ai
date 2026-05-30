import Image from "next/image";
import { Link2, Star, GitFork, TrendingUp } from "lucide-react";
import type { Analysis } from "@/types/analysis";

interface ProjectHeaderProps {
  analysis: Analysis;
  stars?: number;
  forks?: number;
}

export default function ProjectHeader({
  analysis,
  stars = 12400,
  forks = 892,
}: ProjectHeaderProps) {
  const {
    repoName,
    maturityScore,
    level,
    isProductionReady,
    projectContext,
  } = analysis;

  const circumference = 314;
  const offset =
    circumference - (maturityScore / 100) * circumference;

  const owner = repoName?.split("/")[0];

  return (
    <section className="grid grid-cols-12 gap-5">
      {/* LEFT SIDE - Main Content */}
      <div className="col-span-12 lg:col-span-8">
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-4">
          {/* Avatar with enhanced styling */}
          <div className="relative shrink-0 pt-1">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-white/[0.08] to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Image
              src={
                owner
                  ? `https://github.com/${owner}.png`
                  : "/placeholder-avatar.png"
              }
              alt={`${owner} avatar`}
              width={72}
              height={72}
              className="relative w-18 h-18 rounded-2xl border border-white/15 bg-gradient-to-br from-white/5 to-white/[0.02] object-cover shadow-xl"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            {/* Header with repo name and badge */}
            <div className="mb-3 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                  {repoName}
                </h1>
                
                <span className="px-2.5 py-0.5 rounded-lg border border-white/15 bg-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur-sm">
                  Public
                </span>
              </div>

              {/* Enhanced description with better visual hierarchy */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-snug">
                <span className="text-white/80 font-medium">
                  Detected as{" "}
                  <span className="text-emerald-400/90 font-semibold">
                    {projectContext.intent.replace(/-/g, " ")}
                  </span>
                </span>{" "}
                project
              </p>
            </div>

            {/* Confidence Badge - More prominent */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm">
                <TrendingUp size={12} className="text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400">
                  {projectContext.confidence}% confidence
                </span>
              </div>
            </div>

            {/* Metadata Grid - Improved layout */}
            <div className="space-y-2.5">
              {/* GitHub Link */}
              <a
                href={`https://github.com/${repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <Link2
                  size={14}
                  className="text-zinc-500 group-hover:text-white transition-colors"
                />
                <span className="text-[11px] sm:text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                  github.com/{repoName}
                </span>
              </a>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* Stars */}
                <div className="flex flex-col gap-1 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400/70" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500">
                      Stars
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {(stars / 1000).toFixed(1)}k
                  </span>
                </div>

                {/* Forks */}
                <div className="flex flex-col gap-1 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-1">
                    <GitFork size={12} className="text-blue-400/70" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500">
                      Forks
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {(forks / 1000).toFixed(1)}k
                  </span>
                </div>

                {/* Language */}
                <div className="flex flex-col gap-1 px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500">
                      Language
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white">TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Score Card */}
      <div className="col-span-12 lg:col-span-4">
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-5 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative corner glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/[0.04] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            {/* Status Badge */}
            <div className="space-y-1 text-center">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-white/15 bg-white/10 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-sm">
                {isProductionReady ? "🚀 Production Ready" : level}
              </span>
              
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold px-3">
                Maturity Score
              </p>
            </div>

            {/* Score Circle - Compact */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Dynamic glow based on score */}
              <div 
                className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-700"
                style={{
                  background: maturityScore > 75 
                    ? "rgb(34, 197, 94)" 
                    : maturityScore > 50 
                    ? "rgb(250, 204, 21)"
                    : "rgb(239, 68, 68)",
                }}
              />

              <svg
                className="w-full h-full -rotate-90 drop-shadow-lg"
                viewBox="0 0 120 120"
              >
                {/* Background Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgb(39, 39, 42)"
                  strokeWidth="7"
                />

                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={
                    maturityScore > 75 
                      ? "rgb(34, 197, 94)" 
                      : maturityScore > 50 
                      ? "rgb(250, 204, 21)"
                      : "rgb(239, 68, 68)"
                  }
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: maturityScore > 75 
                      ? "drop-shadow(0 0 12px rgba(34, 197, 94, 0.4))"
                      : maturityScore > 50
                      ? "drop-shadow(0 0 12px rgba(250, 204, 21, 0.3))"
                      : "drop-shadow(0 0 12px rgba(239, 68, 68, 0.3))"
                  }}
                />
              </svg>

              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tighter text-white leading-none">
                  {maturityScore}
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 mt-1 font-semibold">
                  Score
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-center text-[10px] text-zinc-400 leading-relaxed px-2 max-w-[140px]">
              High confidence architectural analysis
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}