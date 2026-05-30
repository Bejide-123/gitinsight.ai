import { Sparkles } from "lucide-react";

interface ExecutiveSummaryProps {
  summary: string;
  repoName: string;
}

export default function ExecutiveSummary({
  summary,
  repoName,
}: ExecutiveSummaryProps) {
  return (
    <section className="relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-7 transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08] backdrop-blur-md">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Ambient Glow - Enhanced */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/[0.03] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={16} className="text-emerald-400/90" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400 w-fit backdrop-blur-sm">
                AI Generated Insight
              </span>

              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                Executive Summary
              </h2>
            </div>
          </div>
        </div>

        {/* Summary Text */}
        <div className="max-w-4xl">
          <p className="text-sm md:text-[15px] leading-relaxed text-zinc-300 font-normal text-balance">
            {summary ? (
              summary
            ) : (
              <>
                The{" "}
                <span className="text-white/90 font-semibold">
                  {repoName}
                </span>{" "}
                repository has been analyzed across architecture, security, performance, and engineering quality dimensions. Review the findings below for a comprehensive breakdown of strengths, risks, and actionable recommendations tailored to the project&apos;s detected intent and operational maturity.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}