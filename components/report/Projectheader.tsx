import Image from "next/image";
import { Link2, Star, GitFork, TrendingUp, Sparkles, Shield, CheckCircle } from "lucide-react";
import type { Analysis } from "@/types/analysis";

interface ProjectHeaderProps {
  analysis: Analysis;
  stars?: number;
  forks?: number;
  language?: string;
}

export default function ProjectHeader({
  analysis,
  stars = 0,
  forks = 0,
  language = "Unknown",
}: ProjectHeaderProps) {
  const {
    repoName,
    maturityScore,
    level,
    isProductionReady,
    projectContext,
  } = analysis;

  const circumference = 314;
  const offset = circumference - (maturityScore / 100) * circumference;
  const owner = repoName?.split("/")[0];

  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: "#10b981", glow: "rgba(16,185,129,0.3)", border: "border-emerald-500/20" };
    if (score >= 60) return { color: "#f59e0b", glow: "rgba(245,158,11,0.3)", border: "border-amber-500/20" };
    return { color: "#ef4444", glow: "rgba(239,68,68,0.3)", border: "border-red-500/20" };
  };

  const scoreColor = getScoreColor(maturityScore);

  return (
    <section className="grid grid-cols-12 gap-5">
      {/* LEFT SIDE - Main Content */}
      <div className="col-span-12 lg:col-span-8">
        <div className="flex flex-col sm:flex-row sm:gap-6 gap-4">
          {/* Avatar */}
          <div className="relative shrink-0 pt-1">
            <div className="absolute -inset-3 rounded-3xl bg-purple-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Image
              src={owner ? `https://github.com/${owner}.png` : "/placeholder-avatar.png"}
              alt={`${owner} avatar`}
              width={72}
              height={72}
              className="relative w-18 h-18 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] object-cover shadow-xl"
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
                
                <span className="px-2.5 py-0.5 rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-medium uppercase tracking-wider text-zinc-400 backdrop-blur-sm">
                  Public
                </span>

                {isProductionReady && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-medium text-emerald-400">
                    <CheckCircle size={12} />
                    Ready
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-snug">
                <span className="text-white/80 font-medium">
                  Detected as{" "}
                  <span className="text-purple-400 font-semibold">
                    {projectContext.intent.replace(/-/g, " ")}
                  </span>
                </span>{" "}
                project
              </p>
            </div>

            {/* Confidence Badge */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/20 bg-purple-500/10 backdrop-blur-sm">
                <Sparkles size={12} className="text-purple-400" />
                <span className="text-[10px] font-semibold text-purple-400">
                  {projectContext.confidence}% confidence
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="space-y-2.5">
              {/* GitHub Link */}
              <a
                href={`https://github.com/${repoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <Link2 size={14} className="text-zinc-500 group-hover:text-purple-400 transition-colors" />
                <span className="text-[11px] sm:text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
                  github.com/{repoName}
                </span>
              </a>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="text-amber-400/70" />
                    <span className="text-[9px] uppercase tracking-wider font-medium text-zinc-500">Stars</span>
                  </div>
                  <span className="text-sm font-bold text-white">{stars.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-1 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <GitFork size={13} className="text-blue-400/70" />
                    <span className="text-[9px] uppercase tracking-wider font-medium text-zinc-500">Forks</span>
                  </div>
                  <span className="text-sm font-bold text-white">{forks.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-1 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="text-[9px] uppercase tracking-wider font-medium text-zinc-500">Language</span>
                  </div>
                  <span className="text-sm font-bold text-white">{language}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Score Card */}
      <div className="col-span-12 lg:col-span-4">
        <div className={`relative group overflow-hidden rounded-2xl border ${scoreColor.border} bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-5 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.06]`}>
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative corner glow */}
          <div className={`absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            {/* Status Badge */}
            <div className="space-y-1 text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full border ${scoreColor.border} bg-white/5 text-[10px] font-bold uppercase tracking-wide text-white/90 backdrop-blur-sm`}>
                {isProductionReady ? "Production Ready" : level}
              </span>
              
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold px-3">
                Maturity Score
              </p>
            </div>

            {/* Score Circle */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Dynamic glow */}
              <div 
                className="absolute inset-0 rounded-full blur-2xl transition-all duration-700"
                style={{ background: scoreColor.glow }}
              />

              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background Circle */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgb(39, 39, 42)" strokeWidth="6" />

                {/* Progress Circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={scoreColor.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: `drop-shadow(0 0 12px ${scoreColor.glow})` }}
                />
              </svg>

              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tighter text-white leading-none">
                  {maturityScore}
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 mt-1 font-semibold">Score</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-center text-[10px] text-zinc-400 leading-relaxed px-2 max-w-[140px]">
              {maturityScore >= 80 
                ? "Excellent health - Production ready" 
                : maturityScore >= 60 
                ? "Good health - Minor improvements needed"
                : "Needs attention - Significant work required"}
            </p>

            {/* Bottom indicator */}
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}