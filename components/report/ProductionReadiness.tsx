import { CheckCircle2, AlertTriangle, XCircle, Shield } from "lucide-react";

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

const ITEM_ICON: Record<ReadinessItemStatus, { icon: React.ElementType; color: string }> = {
  pass: { icon: CheckCircle2, color: "text-emerald-500" },
  warn: { icon: AlertTriangle, color: "text-amber-500" },
  fail: { icon: XCircle, color: "text-red-500" },
};

const getScoreColor = (score: number) => {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
};

const getScoreBg = (score: number) => {
  if (score >= 75) return "from-emerald-500/10 via-emerald-500/5";
  if (score >= 50) return "from-amber-500/10 via-amber-500/5";
  return "from-red-500/10 via-red-500/5";
};

export default function ProductionReadiness({
  overallScore,
  categories,
  verdict,
}: ProductionReadinessProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-8 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
      {/* Animated gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Decorative glow */}
      <div className="absolute -right-32 -top-32 w-80 h-80 bg-white/[0.04] blur-3xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Score Section */}
        <div className="lg:w-1/3 flex flex-col justify-center">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.08] flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Production Readiness Audit
            </h2>
          </div>

          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Comprehensive assessment of operational stability and infrastructure health.
          </p>

          {/* Score Display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl md:text-6xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </span>
              <span className="text-zinc-500 font-bold mb-2 uppercase text-xs tracking-wider">
                Overall Readiness
              </span>
            </div>

            {/* Score bar */}
            <div className="mt-4 h-2 w-full bg-white/[0.08] rounded-full overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full ${getScoreBg(overallScore).split(" ")[0]} transition-all duration-1000 ease-out`}
                style={{
                  width: `${overallScore}%`,
                  background:
                    overallScore >= 75
                      ? "linear-gradient(90deg, rgb(34, 197, 94), rgb(34, 197, 94))"
                      : overallScore >= 50
                      ? "linear-gradient(90deg, rgb(245, 158, 11), rgb(245, 158, 11))"
                      : "linear-gradient(90deg, rgb(239, 68, 68), rgb(239, 68, 68))",
                }}
              />
            </div>
          </div>

          {/* Verdict */}
          {verdict && (
            <div className="p-4 bg-white/[0.04] border border-white/10 rounded-xl">
              <p className="text-xs italic text-zinc-400">&quot;{verdict}&quot;</p>
            </div>
          )}
        </div>

        {/* Right: Categories Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.title} className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-white/10 pb-2.5">
                {cat.title}
              </h3>
              <ul className="space-y-2.5">
                {cat.items.map((item) => {
                  const config = ITEM_ICON[item.status];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <li
                      key={item.label}
                      className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                        item.status === "fail"
                          ? "text-zinc-600 line-through"
                          : item.status === "warn"
                          ? "text-amber-400/80"
                          : "text-emerald-400/80"
                      }`}
                    >
                      <Icon size={14} className={config.color} />
                      <span>{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}