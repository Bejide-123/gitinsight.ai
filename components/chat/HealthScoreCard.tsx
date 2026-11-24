// HealthScoreCard.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface HealthScoreCardProps {
  score: number;
  level: string;
}

const getScoreConfig = (score: number) => {
  if (score >= 80) {
    return {
      color: "#10b981",
      label: "Production Ready",
      sublabel: "Strong engineering foundation",
      textClass: "text-emerald-400",
      border: "border-emerald-500/20",
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
  }
  if (score >= 60) {
    return {
      color: "#f59e0b",
      label: "Needs Attention",
      sublabel: "Minor improvements needed",
      textClass: "text-amber-400",
      border: "border-amber-500/20",
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };
  }
  return {
    color: "#f43f5e",
    label: "Critical Gaps",
    sublabel: "Significant work required",
    textClass: "text-rose-400",
    border: "border-rose-500/20",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };
};

export default function HealthScoreCard({ score, level }: HealthScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = getScoreConfig(score);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      setAnimatedScore(Math.floor(score * progress));
      if (current >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`relative col-span-12 md:col-span-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f16] p-6 shadow-sm flex flex-col items-center justify-between`}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-300">Health Score</span>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${config.badgeBg}`}>
          {level}
        </span>
      </div>

      {/* Circular Progress */}
      <div className="relative w-44 h-44 my-2">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="70"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <circle
            cx="50%"
            cy="50%"
            r="70"
            fill="none"
            stroke={config.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-bold tracking-tight text-white">
            {animatedScore}
          </span>
          <span className="font-mono text-xs text-zinc-500 mt-1">/ 100</span>
        </div>
      </div>

      {/* Score label */}
      <div className="mt-2 text-center">
        <p className={`text-sm font-semibold ${config.textClass}`}>
          {config.label}
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">{config.sublabel}</p>
      </div>
    </motion.div>
  );
}
