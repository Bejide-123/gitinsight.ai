import { Brain, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";

interface AIInsightsProps {
  strengths: string[];
  weaknesses: string[];
  longTermAdvice: string;
  sentimentScore?: number; // 0-4 bars filled
}

export default function AIInsights({
  strengths,
  weaknesses,
  longTermAdvice,
  sentimentScore = 2,
}: AIInsightsProps) {
  const getSentimentColor = (score: number) => {
    if (score >= 3) return "bg-emerald-500";
    if (score >= 2) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-8 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
      {/* Animated gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Decorative glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/[0.04] blur-3xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Agent Card */}
        <div className="lg:w-1/4 flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <Brain size={18} className="text-white" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Expert Review</h2>
          </div>

          {/* Agent Profile */}
          <div className="p-4 bg-white/[0.06] border border-white/15 rounded-2xl mb-6 hover:bg-white/[0.08] transition-colors duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Brain size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">GitInsight AI</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  Engineering Analyst
                </p>
              </div>
            </div>
          </div>

          {/* Sentiment bars */}
          <div className="space-y-2.5">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
              Summary Sentiment
            </p>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i < sentimentScore
                      ? `${getSentimentColor(sentimentScore)} shadow-lg`
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 space-y-6">
          {/* Strengths */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Architectural Strengths</h3>
            </div>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 flex-shrink-0 mt-1.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle size={16} className="text-red-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Critical Weaknesses</h3>
            </div>
            <ul className="space-y-2">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-zinc-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 flex-shrink-0 mt-1.5" />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Long-term advice */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lightbulb size={16} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Long-term Outlook</h3>
            </div>
            <div className="p-4 bg-white/[0.04] border border-white/10 rounded-2xl">
              <p className="text-sm text-zinc-400 leading-relaxed italic">
                &quot;{longTermAdvice}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}