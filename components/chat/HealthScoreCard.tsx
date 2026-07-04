// HealthScoreCard.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, TrendingUp, Award } from "lucide-react";

interface HealthScoreCardProps {
  score: number;
  level: string;
}

const getScoreConfig = (score: number) => {
  if (score >= 85) {
    return {
      color: "#10b981",
      gradient: "from-emerald-400 to-green-500",
      label: "Excellent",
      sublabel: "Production ready",
      bg: "from-emerald-500/10 via-green-500/5 to-transparent",
      border: "border-emerald-500/30",
      ring: "ring-emerald-500/20",
    };
  }
  if (score >= 70) {
    return {
      color: "#3b82f6",
      gradient: "from-blue-400 to-cyan-500",
      label: "Good",
      sublabel: "Minor improvements needed",
      bg: "from-blue-500/10 via-cyan-500/5 to-transparent",
      border: "border-blue-500/30",
      ring: "ring-blue-500/20",
    };
  }
  if (score >= 55) {
    return {
      color: "#f59e0b",
      gradient: "from-amber-400 to-orange-500",
      label: "Fair",
      sublabel: "Improvements recommended",
      bg: "from-amber-500/10 via-orange-500/5 to-transparent",
      border: "border-amber-500/30",
      ring: "ring-amber-500/20",
    };
  }
  return {
    color: "#ef4444",
    gradient: "from-red-400 to-orange-500",
    label: "Needs Work",
    sublabel: "Significant work required",
    bg: "from-red-500/10 via-orange-500/5 to-transparent",
    border: "border-red-500/30",
    ring: "ring-red-500/20",
  };
};

export default function HealthScoreCard({ score, level }: HealthScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = getScoreConfig(score);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative col-span-12 md:col-span-4 overflow-hidden rounded-3xl border ${config.border} bg-gradient-to-br ${config.bg} backdrop-blur-xl group`}
    >
      {/* Glow effects */}
      <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700`} />
      <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />

      <div className="relative p-8 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className={`w-4 h-4 text-${config.label.toLowerCase()}-400`} />
            <span className="text-xs font-medium text-zinc-400">Health Score</span>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/5 border ${config.border} ${config.label === "Excellent" ? "text-emerald-400" : config.label === "Good" ? "text-blue-400" : config.label === "Fair" ? "text-amber-400" : "text-red-400"}`}>
            {level}
          </span>
        </div>

        {/* Circular Progress */}
        <div className="relative w-48 h-48">
          {/* Background ring */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-white/5"
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
              style={{ filter: `drop-shadow(0 0 20px ${config.color}40)` }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={animatedScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-6xl font-black bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`}
            >
              {animatedScore}
            </motion.span>
            <span className="text-xs text-zinc-500 font-medium mt-1">/ 100</span>
          </div>
        </div>

        {/* Score label */}
        <div className="mt-6 text-center">
          <p className={`text-lg font-bold bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`}>
            {config.label}
          </p>
          <p className="text-sm text-zinc-400 mt-1">{config.sublabel}</p>
        </div>

        {/* Bottom decoration */}
        <div className={`mt-4 w-16 h-1 rounded-full bg-gradient-to-r ${config.gradient} opacity-50`} />
      </div>
    </motion.div>
  );
}