import { CheckCircle2, AlertTriangle, XCircle, Shield, Sparkles, TrendingUp, Clock } from "lucide-react";

type ReadinessItemStatus = "pass" | "warn" | "fail";

interface ReadinessItem {
  label: string;
  status: ReadinessItemStatus;
}

interface ReadinessCategory {
  title: string;
  items: ReadinessItem[];
}

interface ProductionReadinessProps {
  overallScore: number;
  categories: ReadinessCategory[];
  verdict?: string;
}

const ITEM_CONFIG: Record<ReadinessItemStatus, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  pass: { 
    icon: CheckCircle2, 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    label: "Pass"
  },
  warn: { 
    icon: AlertTriangle, 
    color: "text-amber-400", 
    bg: "bg-amber-500/10", 
    border: "border-amber-500/20",
    label: "Warning"
  },
  fail: { 
    icon: XCircle, 
    color: "text-red-400", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    label: "Fail"
  },
};

const getScoreConfig = (score: number) => {
  if (score >= 75) {
    return {
      color: "text-emerald-400",
      bg: "from-emerald-500/20 via-emerald-500/10 to-transparent",
      border: "border-emerald-500/30",
      glow: "rgba(52,211,153,0.3)",
      label: "Ready",
      progress: "bg-emerald-400",
    };
  }
  if (score >= 50) {
    return {
      color: "text-amber-400",
      bg: "from-amber-500/20 via-amber-500/10 to-transparent",
      border: "border-amber-500/30",
      glow: "rgba(245,158,11,0.3)",
      label: "In Progress",
      progress: "bg-amber-400",
    };
  }
  return {
    color: "text-red-400",
    bg: "from-red-500/20 via-red-500/10 to-transparent",
    border: "border-red-500/30",
    glow: "rgba(239,68,68,0.3)",
    label: "Needs Work",
    progress: "bg-red-400",
  };
};

export default function ProductionReadiness({
  overallScore,
  categories,
  verdict,
}: ProductionReadinessProps) {
  const scoreConfig = getScoreConfig(overallScore);
  const passCount = categories.reduce((acc, cat) => 
    acc + cat.items.filter(item => item.status === "pass").length, 0
  );
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_80px_rgba(168,85,247,0.05)]">
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scoreConfig.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      
      {/* Decorative glow */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Score Section */}
        <div className="lg:w-1/3 flex flex-col justify-center">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
              <Shield size={18} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Production Readiness
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium">Audit & Assessment</p>
            </div>
          </div>

          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Comprehensive assessment of operational stability and infrastructure health.
          </p>

          {/* Score Display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl md:text-6xl font-bold ${scoreConfig.color}`}>
                {overallScore}
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-[0.15em]">
                  Overall Readiness
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${scoreConfig.color}`}>
                  {scoreConfig.label}
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div className="mt-4 relative">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full ${scoreConfig.progress} transition-all duration-1000 ease-out`}
                  style={{
                    width: `${overallScore}%`,
                    boxShadow: `0 0 20px ${scoreConfig.glow}`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[8px] text-zinc-600">0</span>
                <span className="text-[8px] text-zinc-600">50</span>
                <span className="text-[8px] text-zinc-600">100</span>
              </div>
            </div>
          </div>

          {/* Verdict */}
          {verdict && (
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-start gap-2.5">
                <Sparkles size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-zinc-400 leading-relaxed italic">&quot;{verdict}&quot;</p>
              </div>
            </div>
          )}

          {/* Quick stats */}
          <div className="mt-4 flex items-center gap-4 text-[10px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>{passCount} passed</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-zinc-500" />
              <span>{totalItems} checks</span>
            </div>
          </div>
        </div>

        {/* Right: Categories Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const passCount = cat.items.filter(item => item.status === "pass").length;
            const totalCount = cat.items.length;

            return (
              <div key={cat.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
                    {cat.title}
                  </h3>
                  <span className="text-[9px] text-zinc-500 font-medium">
                    {passCount}/{totalCount}
                  </span>
                </div>
                <div className="h-px w-full bg-white/5" />
                <ul className="space-y-2.5">
                  {cat.items.map((item) => {
                    const config = ITEM_CONFIG[item.status];
                    if (!config) return null;
                    const Icon = config.icon;
                    return (
                      <li
                        key={item.label}
                        className="flex items-center gap-2.5 text-xs transition-all duration-300 group/item"
                      >
                        <div className={`w-6 h-6 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:scale-110`}>
                          <Icon size={13} className={config.color} />
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          item.status === "fail" 
                            ? "text-zinc-500 line-through" 
                            : item.status === "warn" 
                            ? "text-amber-400/80" 
                            : "text-zinc-300"
                        }`}>
                          {item.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom indicator */}
      <div className="relative z-10 mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] text-zinc-500">
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-purple-400" />
          <span>Readiness score calculated from {totalItems} checks</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Pass</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Warn</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span>Fail</span>
        </div>
      </div>
    </div>
  );
}