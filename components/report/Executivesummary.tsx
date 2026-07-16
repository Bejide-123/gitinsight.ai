import { Sparkles, FileText, Zap, Shield, GitBranch, ArrowRight, CheckCircle, Clock } from "lucide-react";

interface ExecutiveSummaryProps {
  summary: string;
  repoName: string;
}

export default function ExecutiveSummary({
  summary,
  repoName,
}: ExecutiveSummaryProps) {
  return (
    <section className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#080808] to-[#050505] p-8 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_80px_rgba(168,85,247,0.06)]">
      
      {/* Animated gradient orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none" />
      
      {/* Top glow line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-5 mb-7">
          {/* Icon with glow */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-12 h-12 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/20 to-purple-600/5 flex items-center justify-center shadow-lg shadow-purple-500/5">
              <Sparkles size={20} className="text-purple-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-[10px] font-medium uppercase tracking-[0.15em] text-purple-400 backdrop-blur-sm">
                <Zap size={12} />
                AI Generated
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-400 backdrop-blur-sm">
                <Shield size={12} />
                Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-400 backdrop-blur-sm">
                <FileText size={12} />
                Full Report
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Executive Summary
              <span className="ml-2 text-zinc-600 font-light">·</span>
              <span className="ml-2 text-sm font-normal text-zinc-400">Insights</span>
            </h2>
          </div>
        </div>

        {/* Summary Text with decorative border */}
        <div className="relative pl-6">
          {/* Decorative left border with gradient */}
          <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-purple-500 via-purple-400/50 to-transparent rounded-full" />
          <div className="absolute left-0 top-0 w-0.5 h-12 bg-gradient-to-b from-purple-400 to-transparent" />

          <p className="text-[15px] md:text-base leading-relaxed text-zinc-300 font-normal max-w-4xl">
            {summary ? (
              summary
            ) : (
              <>
                The{" "}
                <span className="text-white font-semibold border-b-2 border-purple-500/30 pb-0.5">
                  {repoName}
                </span>{" "}
                repository has been analyzed across architecture, security, performance, and engineering quality dimensions. Review the findings below for a comprehensive breakdown of strengths, risks, and actionable recommendations tailored to the project&apos;s detected intent and operational maturity.
              </>
            )}
          </p>
        </div>

        {/* Footer with stats and actions */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <GitBranch size={13} className="text-purple-400" />
                <span className="font-medium">Analysis complete</span>
              </div>
            </div>
            
            <div className="w-px h-4 bg-white/10" />
            
            <div className="flex items-center gap-2.5 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-emerald-400" />
                <span className="font-medium text-emerald-400/80">Ready for review</span>
              </div>
            </div>
            
            <div className="w-px h-4 bg-white/10" />
            
            <div className="flex items-center gap-2.5 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-zinc-500" />
                <span>Generated just now</span>
              </div>
            </div>
          </div>

          <button className="group relative flex items-center gap-2 px-5 py-2.5 rounded-lg border border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative text-xs font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
              View full analysis
            </span>
            <ArrowRight size={14} className="relative text-purple-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}