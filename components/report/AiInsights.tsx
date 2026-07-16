import { Brain, CheckCircle2, AlertCircle, Lightbulb, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";

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
  const getSentimentConfig = (score: number) => {
    if (score >= 3) return { color: "bg-emerald-400", glow: "rgba(52,211,153,0.3)", label: "Positive", text: "text-emerald-400" };
    if (score >= 2) return { color: "bg-amber-400", glow: "rgba(245,158,11,0.3)", label: "Neutral", text: "text-amber-400" };
    return { color: "bg-red-400", glow: "rgba(239,68,68,0.3)", label: "Concerned", text: "text-red-400" };
  };

  const sentimentConfig = getSentimentConfig(sentimentScore);

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_80px_rgba(168,85,247,0.05)]">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Decorative glow */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Agent Card */}
        <div className="lg:w-1/4 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
              <Brain size={18} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Expert Review
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium">AI-Powered Analysis</p>
            </div>
          </div>

          {/* Agent Profile */}
          <div className="relative p-5 bg-white/[0.03] border border-white/10 rounded-2xl mb-6 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
            <div className="absolute -top-3 -right-3">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[8px] font-bold uppercase tracking-[0.15em] text-purple-400">
                <Zap size={10} />
                Active
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Brain size={22} className="text-purple-400" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">GitInsight AI</p>
                <p className="text-[10px] text-zinc-500 font-medium">
                  Engineering Analyst
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles size={10} className="text-purple-400" />
                  <span className="text-[8px] text-zinc-500">v2.4.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment bars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-[0.15em]">
                Summary Sentiment
              </p>
              <span className={`text-[9px] font-bold ${sentimentConfig.text}`}>
                {sentimentConfig.label}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    i < sentimentScore
                      ? `${sentimentConfig.color} shadow-[0_0_12px_${sentimentConfig.glow}]`
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-[8px] text-zinc-600">Based on {strengths.length + weaknesses.length} factors</p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 space-y-6">
          {/* Strengths */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Architectural Strengths</h3>
                <p className="text-[9px] text-zinc-500">{strengths.length} key strengths identified</p>
              </div>
            </div>
            <ul className="space-y-2 pl-3">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed group/strength">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 flex-shrink-0 mt-1.5 group-hover/strength:bg-emerald-400 transition-colors" />
                  <span className="group-hover/strength:text-zinc-300 transition-colors">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle size={16} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Critical Weaknesses</h3>
                <p className="text-[9px] text-zinc-500">{weaknesses.length} areas needing attention</p>
              </div>
            </div>
            <ul className="space-y-2 pl-3">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed group/weakness">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0 mt-1.5 group-hover/weakness:bg-red-400 transition-colors" />
                  <span className="group-hover/weakness:text-zinc-300 transition-colors">{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Long-term advice */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lightbulb size={16} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Long-term Outlook</h3>
                <p className="text-[9px] text-zinc-500">Strategic recommendation</p>
              </div>
            </div>
            <div className="relative p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-transparent rounded-full" />
              <div className="flex items-start gap-3 pl-3">
                <Sparkles size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  &quot;{longTermAdvice}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Footer stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-[9px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Shield size={11} className="text-purple-400" />
              <span>AI confidence: {Math.round((strengths.length / (strengths.length + weaknesses.length)) * 100)}%</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <TrendingUp size={11} className="text-zinc-500" />
              <span>Analysis complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}