'use client';

import { useEffect, useState } from 'react';

interface HealthScoreCardProps {
  score: number;
  level: string;
}

const getScoreColor = (score: number): { circle: string; glow: string; level: string; bg: string } => {
  if (score >= 85) {
    return {
      circle: '#10b981',
      glow: 'from-emerald-500 to-green-600',
      level: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-green-500/5',
    };
  }
  if (score >= 70) {
    return {
      circle: '#3b82f6',
      glow: 'from-blue-500 to-cyan-500',
      level: 'text-blue-400',
      bg: 'from-blue-500/10 to-cyan-500/5',
    };
  }
  if (score >= 55) {
    return {
      circle: '#f59e0b',
      glow: 'from-amber-500 to-orange-500',
      level: 'text-amber-400',
      bg: 'from-amber-500/10 to-orange-500/5',
    };
  }
  return {
    circle: '#ef4444',
    glow: 'from-red-500 to-orange-600',
    level: 'text-red-400',
    bg: 'from-red-500/10 to-orange-500/5',
  };
};

export default function HealthScoreCard({ score, level }: HealthScoreCardProps) {
  const [mounted, setMounted] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const colors = getScoreColor(score);

  useEffect(() => {
    setMounted(true);

    // Animate score from 0 to final score
    const duration = 1000; // 1 second
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedScore(Math.floor(score * progress));

      if (currentStep >= steps) {
        setAnimatedScore(score);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [score]);

  const circumference = 440; // 2 * PI * r (r = 70)
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`col-span-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${colors.bg} backdrop-blur-xl md:col-span-4 relative group`}>
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

      {/* Glow orbs */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${colors.glow} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>

      <div className="relative p-8 flex flex-col items-center justify-center py-12">
        {/* Level Badge */}
        <div className={`absolute top-6 right-6 rounded-full border ${colors.level} border-current/30 ${colors.bg} px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 group-hover:scale-105`}>
          {level}
        </div>

        {/* Animated Circular Progress */}
        <div className={`relative flex h-48 w-48 items-center justify-center transition-transform duration-300 ${mounted ? 'scale-100' : 'scale-95'}`}>
          {/* Background circle glow */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.glow} opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-300`}></div>

          {/* SVG Circle */}
          <svg
            className="h-full w-full -rotate-90 drop-shadow-lg"
            viewBox="0 0 160 160"
            style={{ filter: `drop-shadow(0 0 20px ${colors.circle}20)` }}
          >
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-zinc-800/50"
            />

            {/* Animated progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={colors.circle}
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{
                filter: `drop-shadow(0 0 8px ${colors.circle}40)`,
              }}
            />
          </svg>

          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-6xl font-black bg-gradient-to-br ${colors.glow} bg-clip-text text-transparent transition-all duration-300 ${mounted ? 'scale-100' : 'scale-75'}`}>
              {animatedScore}
            </span>

            <span className="text-xs text-zinc-500 font-semibold mt-1">
              / 100
            </span>
          </div>
        </div>

        {/* Label */}
        <p className="mt-8 text-xs uppercase tracking-[0.15em] text-zinc-400 font-semibold group-hover:text-zinc-300 transition-colors duration-300">
          Repository Health Score
        </p>

        {/* Score description */}
        <div className={`mt-4 text-center`}>
          {animatedScore >= 85 && (
            <p className="text-sm text-emerald-400 font-medium">
              Excellent condition - Production ready
            </p>
          )}
          {animatedScore >= 70 && animatedScore < 85 && (
            <p className="text-sm text-blue-400 font-medium">
              Good health - Minor improvements needed
            </p>
          )}
          {animatedScore >= 55 && animatedScore < 70 && (
            <p className="text-sm text-amber-400 font-medium">
              Fair condition - Improvements recommended
            </p>
          )}
          {animatedScore < 55 && (
            <p className="text-sm text-red-400 font-medium">
              Needs attention - Significant work required
            </p>
          )}
        </div>
      </div>
    </div>
  );
}