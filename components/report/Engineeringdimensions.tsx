import {
  GitBranch,
  ClipboardList,
  Rocket,
  Wrench,
  Shield,
  FlaskConical,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DimensionScore {
  label: string;
  icon: LucideIcon;
  score: number;
  description?: string;
}

interface EngineeringDimensionsProps {
  dimensions?: DimensionScore[];
  totalFilesAnalyzed?: number;
}

export const DEFAULT_DIMENSIONS: DimensionScore[] = [
  {
    label: "Structure",
    icon: GitBranch,
    score: 88,
    description: "Code organization & architecture",
  },
  {
    label: "Completeness",
    icon: ClipboardList,
    score: 92,
    description: "Feature implementation coverage",
  },
  {
    label: "Readiness",
    icon: Rocket,
    score: 65,
    description: "Production deployment readiness",
  },
  {
    label: "Maintainability",
    icon: Wrench,
    score: 74,
    description: "Code maintainability & tech debt",
  },
  {
    label: "Security",
    icon: Shield,
    score: 81,
    description: "Security vulnerabilities & risks",
  },
  {
    label: "Testing",
    icon: FlaskConical,
    score: 58,
    description: "Test coverage & quality",
  },
];

const getScoreConfig = (score: number) => {
  if (score >= 80) {
    return {
      bar: "bg-emerald-400",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
      glow: "rgba(52,211,153,0.3)",
      label: "Excellent",
    };
  }
  if (score >= 60) {
    return {
      bar: "bg-amber-400",
      text: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
      glow: "rgba(251,191,36,0.3)",
      label: "Good",
    };
  }
  return {
    bar: "bg-red-400",
    text: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    glow: "rgba(248,113,113,0.3)",
    label: "Needs Work",
  };
};

export default function EngineeringDimensions({
  dimensions = DEFAULT_DIMENSIONS,
  totalFilesAnalyzed = 0,
}: EngineeringDimensionsProps) {
  const avgScore = Math.round(
    dimensions.reduce((acc, dim) => acc + dim.score, 0) / dimensions.length
  );

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-[10px] font-medium uppercase tracking-[0.15em] text-purple-400">
              Engineering Analysis
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-medium text-zinc-400">
              <TrendingUp size={12} className="text-purple-400" />
              {avgScore}% Average
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Engineering Dimensions
          </h2>
        </div>

        {totalFilesAnalyzed > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <span className="text-[10px] text-zinc-400 font-medium">
              {totalFilesAnalyzed.toLocaleString()} files analyzed
            </span>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {dimensions.map((dim) => {
          const Icon = dim.icon;
          const config = getScoreConfig(dim.score);

          return (
            <div
              key={dim.label}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03] hover:scale-[1.02]"
            >
              {/* Animated glow on hover */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{ background: config.glow }}
              />

              {/* Score ring indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${config.bar} shadow-[0_0_8px_${config.glow}]`}
                />
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl border ${config.border} ${config.bg} flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20`}>
                  <Icon size={16} strokeWidth={2} className={config.text} />
                </div>

                {/* Score */}
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {Math.round(dim.score)}
                  </span>
                  <span className="text-xs text-zinc-500">%</span>
                </div>

                {/* Label */}
                <p className="text-[11px] font-medium text-zinc-400 group-hover:text-white transition-colors">
                  {dim.label}
                </p>

                {/* Description */}
                {dim.description && (
                  <p className="text-[9px] text-zinc-500 mt-0.5 leading-relaxed">
                    {dim.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${config.bar} transition-all duration-1000 ease-out`}
                    style={{
                      width: `${dim.score}%`,
                      boxShadow: `0 0 12px ${config.glow}`,
                    }}
                  />
                </div>

                {/* Status label */}
                <div className="mt-1.5">
                  <span className={`text-[8px] uppercase tracking-[0.15em] font-medium ${config.text} opacity-60`}>
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Bottom hover line */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
        <span className="w-1 h-1 rounded-full bg-purple-400" />
        <span>Higher scores indicate better engineering health</span>
        <span className="w-1 h-1 rounded-full bg-purple-400" />
      </div>
    </section>
  );
}