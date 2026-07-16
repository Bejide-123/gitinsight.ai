"use client"
import { CheckCircle2, Zap, ChevronRight, Sparkles, Clock, ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

type PhaseStatus = "completed" | "active" | "upcoming" | "future";

interface RoadmapPhase {
  number: number;
  title: string;
  description: string;
  status: PhaseStatus;
  tags?: string[];
  estimatedDate?: string;
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
    badgeBorder: string;
    opacity: string;
    grayscale: string;
    accentIcon: React.ElementType;
    accentColor: string;
    dotColor: string;
    glow: string;
  }
> = {
  completed: {
    borderColor: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    badgeBorder: "border-emerald-500/20",
    opacity: "opacity-100",
    grayscale: "",
    accentIcon: CheckCircle2,
    accentColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    glow: "rgba(52,211,153,0.15)",
  },
  active: {
    borderColor: "border-purple-500/30",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    badgeBorder: "border-purple-500/20",
    opacity: "opacity-100",
    grayscale: "",
    accentIcon: Zap,
    accentColor: "text-purple-400",
    dotColor: "bg-purple-400",
    glow: "rgba(168,85,247,0.15)",
  },
  upcoming: {
    borderColor: "border-amber-500/30",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    badgeBorder: "border-amber-500/20",
    opacity: "opacity-100",
    grayscale: "",
    accentIcon: ChevronRight,
    accentColor: "text-amber-400",
    dotColor: "bg-amber-400",
    glow: "rgba(245,158,11,0.1)",
  },
  future: {
    borderColor: "border-white/10",
    badgeBg: "bg-white/5",
    badgeText: "text-zinc-500",
    badgeBorder: "border-white/5",
    opacity: "opacity-60",
    grayscale: "grayscale",
    accentIcon: ChevronRight,
    accentColor: "text-zinc-500",
    dotColor: "bg-zinc-600",
    glow: "rgba(255,255,255,0.02)",
  },
};

export default function EvolutionRoadmap({ phases }: EvolutionRoadmapProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollSpeed = 0;
    let rafId: number;

    const tick = () => {
      if (scrollSpeed !== 0) {
        container.scrollLeft += scrollSpeed;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const EDGE_ZONE = 100;
    const MAX_SPEED = 12;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;

      if (x < EDGE_ZONE) {
        const intensity = (EDGE_ZONE - x) / EDGE_ZONE;
        scrollSpeed = -MAX_SPEED * intensity;
      } else if (x > width - EDGE_ZONE) {
        const intensity = (x - (width - EDGE_ZONE)) / EDGE_ZONE;
        scrollSpeed = MAX_SPEED * intensity;
      } else {
        scrollSpeed = 0;
      }
    };

    const handleMouseLeave = () => {
      scrollSpeed = 0;
    };

    const handleScroll = () => {
      setShowLeftGradient(container.scrollLeft > 4);
      setShowRightGradient(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 4
      );
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
            <Sparkles size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Evolution Roadmap
            </h2>
            <p className="text-[10px] text-zinc-500 font-medium">
              {phases.length} phases planned
            </p>
          </div>
        </div>

        {/* Status legend */}
        <div className="hidden md:flex items-center gap-3 text-[9px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Upcoming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span>Future</span>
          </div>
        </div>
      </div>

      {/* Scrollable container */}
      <div className="relative group">
        {/* Left gradient fade */}
        {showLeftGradient && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        )}

        {/* Right gradient fade */}
        {showRightGradient && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {phases.map((phase, index) => {
            const config = PHASE_CONFIG[phase.status];
            const AccentIcon = config.accentIcon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={phase.number}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex-shrink-0 w-80 relative overflow-hidden rounded-2xl border ${config.borderColor} bg-[#0a0a0a] p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_${config.glow}] hover:scale-[1.02] ${config.opacity} ${config.grayscale}`}
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${config.badgeBg.split('/')[0]} via-transparent to-transparent opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-500 pointer-events-none`} />

                {/* Decorative glow */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                  style={{ background: config.glow }}
                />

                <div className="relative z-10 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full ${config.badgeBg} ${config.badgeText} border ${config.badgeBorder}`}>
                        Phase {phase.number}
                      </span>
                      {phase.status === "active" && (
                        <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.15em] text-purple-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {phase.status === "completed" && (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      )}
                      {phase.status === "active" && (
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      )}
                      {phase.status === "upcoming" && (
                        <Clock size={14} className="text-amber-400" />
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      phase.status === "future" ? "text-zinc-500" : "text-white"
                    }`}>
                      {phase.title}
                    </h3>

                    <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                      phase.status === "future" ? "text-zinc-600" : "text-zinc-400"
                    }`}>
                      {phase.description}
                    </p>
                  </div>

                  {/* Estimated date */}
                  {phase.estimatedDate && (
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
                      <Clock size={11} className="text-zinc-600" />
                      <span>Estimated: {phase.estimatedDate}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {phase.tags && phase.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap pt-3 border-t border-white/5">
                      {phase.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[8px] font-medium bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-[0.1em] text-zinc-500 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Status indicator bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ color: config.badgeText === 'text-emerald-400' ? '#34d399' : config.badgeText === 'text-purple-400' ? '#a855f7' : config.badgeText === 'text-amber-400' ? '#f59e0b' : '#71717a' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
        <ArrowRight size={12} className="text-purple-400" />
        <span>Hover over cards for details · Scroll horizontally to explore</span>
      </div>
    </div>
  );
}