import { Lightbulb, TrendingUp } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  impact: "High Impact" | "Medium Impact" | "Low Impact";
  difficulty: number;
  impactScore: number;
  priority: 1 | 2 | 3;
}

interface StrategicRecommendationsProps {
  recommendations: Recommendation[];
}

const PRIORITY_CONFIG: Record<
  number,
  { border: string; badge: string; badgeText: string; label: string; accentColor: string }
> = {
  1: {
    border: "border-t-red-500/50",
    badge: "bg-red-500/10",
    badgeText: "text-red-400",
    label: "Priority 1",
    accentColor: "rgb(239, 68, 68)",
  },
  2: {
    border: "border-t-amber-500/50",
    badge: "bg-amber-500/10",
    badgeText: "text-amber-400",
    label: "Priority 2",
    accentColor: "rgb(245, 158, 11)",
  },
  3: {
    border: "border-t-blue-500/30",
    badge: "bg-blue-500/10",
    badgeText: "text-blue-400",
    label: "Priority 3",
    accentColor: "rgb(59, 130, 246)",
  },
};

const IMPACT_CONFIG: Record<
  string,
  { color: string; glow: string }
> = {
  "High Impact": { color: "bg-red-500/90", glow: "rgb(239, 68, 68)" },
  "Medium Impact": { color: "bg-amber-500/90", glow: "rgb(245, 158, 11)" },
  "Low Impact": { color: "bg-blue-500/90", glow: "rgb(59, 130, 246)" },
};

export default function StrategicRecommendations({
  recommendations,
}: StrategicRecommendationsProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.08] flex items-center justify-center">
          <Lightbulb size={18} className="text-white" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Strategic Recommendations
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const config = PRIORITY_CONFIG[rec.priority] ?? PRIORITY_CONFIG[3];
          const impactConfig = IMPACT_CONFIG[rec.impact];

          return (
            <div
              key={rec.priority}
              className={`group relative overflow-hidden rounded-3xl border-t-2 border-b border-b-white/10 border-x border-x-white/10 ${config.border} bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-5 md:p-6 backdrop-blur-md transition-all duration-500 hover:border-b-white/20 hover:border-x-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]`}
            >
              {/* Animated gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Decorative glow */}
              <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ background: config.accentColor }}
              />

              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${config.badge} flex items-center justify-center shrink-0 font-bold text-xs ${config.badgeText} border border-white/15`}>
                    {String(rec.priority).padStart(2, "0")}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {rec.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {rec.description}
                </p>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                      Impact
                    </span>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full ${impactConfig.color} transition-all duration-1000 ease-out`}
                        style={{
                          width: `${rec.impactScore}%`,
                          boxShadow: `0 0 8px ${impactConfig.glow}40`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                      Difficulty
                    </span>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-white/60 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${rec.difficulty}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    {rec.impact}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${config.badge} ${config.badgeText}`}
                  >
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}