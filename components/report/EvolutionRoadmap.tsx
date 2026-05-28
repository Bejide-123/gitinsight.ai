import { CheckCircle2, Zap, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

type PhaseStatus = "completed" | "active" | "upcoming" | "future";

interface RoadmapPhase {
  number: number;
  title: string;
  description: string;
  status: PhaseStatus;
  tags?: string[];
}

interface EvolutionRoadmapProps {
  phases: RoadmapPhase[];
}

const PHASE_CONFIG: Record<
  PhaseStatus,
  {
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    opacity: string;
    grayscale: string;
    accentIcon: React.ElementType;
    accentColor: string;
  }
> = {
  completed: {
    borderColor: "border-t-emerald-500/50",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    opacity: "opacity-100",
    grayscale: "",
    accentIcon: CheckCircle2,
    accentColor: "text-emerald-400",
  },
  active: {
    borderColor: "border-t-blue-500/50",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    opacity: "opacity-100",
    grayscale: "",
    accentIcon: Zap,
    accentColor: "text-blue-400",
  },
  upcoming: {
    borderColor: "border-t-amber-500/30",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    opacity: "opacity-100",
    grayscale: "hover:opacity-100 transition-all",
    accentIcon: ChevronRight,
    accentColor: "text-amber-400",
  },
  future: {
    borderColor: "border-t-zinc-700",
    badgeBg: "bg-white/5",
    badgeText: "text-zinc-500",
    opacity: "opacity-60",
    grayscale: "grayscale",
    accentIcon: ChevronRight,
    accentColor: "text-zinc-500",
  },
};

export default function EvolutionRoadmap({ phases }: EvolutionRoadmapProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      
      // Calculate scroll speed based on position
      const scrollSpeed = 8;
      const threshold = 100;

      if (x < threshold) {
        // Scroll left
        container.scrollLeft -= scrollSpeed;
      } else if (x > width - threshold) {
        // Scroll right
        container.scrollLeft += scrollSpeed;
      }
    };

    const handleScroll = () => {
      if (!container) return;
      setShowLeftGradient(container.scrollLeft > 0);
      setShowRightGradient(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    const animationFrame = setInterval(() => {
      container.dispatchEvent(new Event("scroll"));
    }, 50);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("scroll", handleScroll);
      clearInterval(animationFrame);
    };
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
        Evolution Roadmap
      </h2>

      <div className="relative group">
        {/* Left gradient fade */}
        {showLeftGradient && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
        )}

        {/* Right gradient fade */}
        {showRightGradient && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 overflow-x-hidden pb-2 scroll-smooth cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: "auto" }}
        >
          {phases.map((phase) => {
            const config = PHASE_CONFIG[phase.status];
            const AccentIcon = config.accentIcon;

            return (
              <div
                key={phase.number}
                className={`flex-shrink-0 w-72 relative overflow-hidden rounded-3xl border-t-2 ${config.borderColor} border-b border-b-white/10 border-x border-x-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-7 backdrop-blur-md transition-all duration-500 hover:border-b-white/20 hover:border-x-white/20 hover:bg-gradient-to-br hover:from-white/[0.08] ${config.opacity} ${config.grayscale} group`}
              >
                {/* Animated gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${config.badgeBg} ${config.badgeText} backdrop-blur-sm border border-white/10`}
                    >
                      Phase {phase.number}
                    </span>

                    {phase.status === "completed" && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                    {phase.status === "active" && (
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      className={`font-bold text-base mb-2 ${
                        phase.status === "completed" || phase.status === "active"
                          ? "text-white"
                          : "text-zinc-400"
                      }`}
                    >
                      {phase.title}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed ${
                        phase.status === "future" ? "text-zinc-600" : "text-zinc-500"
                      }`}
                    >
                      {phase.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {phase.tags && phase.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-2 border-t border-white/10">
                      {phase.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] bg-white/10 px-2 py-1 rounded-full uppercase tracking-wider text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-zinc-600 text-center mt-3">
        Move your cursor to the edges to scroll
      </p>
    </div>
  );
}