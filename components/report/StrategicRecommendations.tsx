import { Lightbulb, TrendingUp, ArrowRight, Sparkles, Clock, Target } from "lucide-react";

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
  { border: string; badge: string; badgeText: string; label: string; accentColor: string; dotColor: string }
> = {
  1: {
    border: "border-purple-500/30",
    badge: "bg-purple-500/10",
    badgeText: "text-purple-400",
    label: "Critical",
    accentColor: "rgb(168, 85, 247)",
    dotColor: "bg-purple-400",
  },
  2: {
    border: "border-amber-500/30",
    badge: "bg-amber-500/10",
    badgeText: "text-amber-400",
    label: "Important",
    accentColor: "rgb(245, 158, 11)",
    dotColor: "bg-amber-400",
  },
  3: {
    border: "border-blue-500/30",
    badge: "bg-blue-500/10",
    badgeText: "text-blue-400",
    label: "Consider",
    accentColor: "rgb(59, 130, 246)",
    dotColor: "bg-blue-400",
  },
};

const IMPACT_CONFIG: Record<
  string,
  { color: string; glow: string; label: string; textColor: string }
> = {
  "High Impact": { 
    color: "bg-purple-400", 
    glow: "rgba(168, 85, 247, 0.3)", 
    label: "High",
    textColor: "text-purple-400",
  },
  "Medium Impact": { 
    color: "bg-amber-400", 
    glow: "rgba(245, 158, 11, 0.3)", 
    label: "Medium",
    textColor: "text-amber-400",
  },
  "Low Impact": { 
    color: "bg-blue-400", 
    glow: "rgba(59, 130, 246, 0.3)", 
    label: "Low",
    textColor: "text-blue-400",
  },
};

export default function StrategicRecommendations({
  recommendations,
}: StrategicRecommendationsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
            <Lightbulb size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Strategic Recommendations
            </h2>
            <p className="text-[10px] text-zinc-500 font-medium">
              {recommendations.length} {recommendations.length === 1 ? 'recommendation' : 'recommendations'} prioritized
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/10">
            <Target size={12} className="text-purple-400" />
            <span className="text-[10px] font-medium text-purple-400">
              {recommendations.filter(r => r.priority === 1).length} Critical
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => {
          const config = PRIORITY_CONFIG[rec.priority] ?? PRIORITY_CONFIG[3];
          const impactConfig = IMPACT_CONFIG[rec.impact];

          return (
            <div
              key={`recommendation-${index}-${rec.title}`} // Unique key using index and title
              className={`group relative overflow-hidden rounded-xl border ${config.border} bg-[#0a0a0a] p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)] hover:scale-[1.01]`}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Decorative glow */}
              <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ background: config.accentColor }}
              />

              {/* Priority badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
                <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${config.badgeText}`}>
                  {config.label}
                </span>
              </div>

              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.badge} border ${config.border} flex items-center justify-center shrink-0 font-bold text-xs ${config.badgeText}`}>
                    {String(rec.priority).padStart(2, "0")}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight group-hover:text-white/90 transition-colors">
                    {rec.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {rec.description}
                </p>

                {/* Metrics */}
                <div className="space-y-3 pt-2">
                  {/* Impact */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                        Impact
                      </span>
                      <span className={`text-[9px] font-bold ${impactConfig.textColor}`}>
                        {impactConfig.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${impactConfig.color} transition-all duration-1000 ease-out`}
                        style={{
                          width: `${rec.impactScore}%`,
                          boxShadow: `0 0 12px ${impactConfig.glow}`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
                        Difficulty
                      </span>
                      <span className="text-[9px] font-bold text-zinc-400">
                        {rec.difficulty}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/40 rounded-full transition-all duration-1000 ease-out group-hover:bg-white/60"
                        style={{ width: `${rec.difficulty}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="text-zinc-500" />
                    <span className="text-[9px] text-zinc-500 font-medium">
                      Priority {rec.priority}
                    </span>
                  </div>
                  <button className="group/btn flex items-center gap-1 text-[9px] font-medium text-zinc-500 hover:text-purple-400 transition-colors">
                    View details
                    <ArrowRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 pt-2">
        <Sparkles size={12} className="text-purple-400" />
        <span>Prioritized by strategic impact and engineering effort</span>
      </div>
    </div>
  );
}