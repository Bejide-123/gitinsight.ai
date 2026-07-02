import {
  GitBranch,
  ClipboardList,
  Rocket,
  Wrench,
  Shield,
  FlaskConical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DimensionScore {
  label: string;
  icon: LucideIcon;
  score: number;
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
  },
  {
    label: "Completeness",
    icon: ClipboardList,
    score: 92,
  },
  {
    label: "Readiness",
    icon: Rocket,
    score: 65,
  },
  {
    label: "Maintainability",
    icon: Wrench,
    score: 74,
  },
  {
    label: "Security",
    icon: Shield,
    score: 81,
  },
  {
    label: "Testing",
    icon: FlaskConical,
    score: 58,
  },
];

const getColorForScore = (score: number) => {
  if (score >= 75) return { bar: "bg-emerald-500/90", icon: "text-emerald-400/80", glow: "rgb(34, 197, 94)" };
  if (score >= 50) return { bar: "bg-amber-500/90", icon: "text-amber-400/80", glow: "rgb(250, 204, 21)" };
  return { bar: "bg-red-500/90", icon: "text-red-400/80", glow: "rgb(239, 68, 68)" };
};

export default function EngineeringDimensions({
  dimensions = DEFAULT_DIMENSIONS,
  totalFilesAnalyzed = 0,
}: EngineeringDimensionsProps) {
  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <div className="flex-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-white/15 bg-white/10 text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm mb-2">
            Engineering Analysis
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
            Engineering Dimensions
          </h2>
        </div>
        {totalFilesAnalyzed > 0 && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <span className="text-[10px] text-zinc-400 font-medium">
              {totalFilesAnalyzed} files analyzed
            </span>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {dimensions.map((dim) => {
          const Icon = dim.icon;
          const colors = getColorForScore(dim.score);

          return (
            <div
              key={dim.label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-4 transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08] backdrop-blur-md"
            >
              {/* Animated gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Decorative glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ background: colors.glow }}
              />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Top Section */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg border border-white/15 bg-white/[0.04] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/[0.08] group-hover:border-white/20">
                    <Icon
                      size={15}
                      strokeWidth={2}
                      className={`${colors.icon} transition-colors duration-300`}
                    />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">
                    {Math.round(dim.score)}
                    <span className="text-xs text-zinc-500">%</span>
                  </span>
                </div>

                {/* Bottom Section */}
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-semibold">
                    {dim.label}
                  </p>

                  {/* Progress Bar */}
                  <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden border border-white/[0.05]">
                    <div
                      className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out shadow-lg`}
                      style={{
                        width: `${dim.score}%`,
                        boxShadow: `0 0 8px ${colors.glow}40`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}