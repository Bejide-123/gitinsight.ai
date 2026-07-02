'use client';

import type { CategoryScore } from '@/types/analysis';
import { useState, useEffect } from 'react';

interface PerformanceMetricsProps {
  categoryScores: Record<string, CategoryScore>;
}

export default function PerformanceMetrics({ categoryScores }: PerformanceMetricsProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="col-span-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent backdrop-blur-xl md:col-span-8 overflow-hidden group">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Glow orb */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full blur-3xl opacity-10 group-hover:opacity-15 transition-opacity duration-500"></div>

      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">
            Performance Metrics
          </h3>
          <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {Object.entries(categoryScores).map(([category, scoreData], idx) => {
            const isHovered = hoveredCategory === category;

            return (
              <div
                key={category}
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`space-y-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${
                  isHovered ? 'border-purple-500/40 bg-purple-500/10' : 'border-white/5 hover:border-white/10'
                }`}
                style={{
                  animation: mounted ? `fadeInUp 0.5s ease-out ${idx * 100}ms forwards` : 'none',
                  opacity: mounted ? 1 : 0,
                }}
              >
                {/* Category name and score */}
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400 transition-colors duration-300">
                    {category}
                  </span>
                  <span className={`text-lg font-bold text-purple-300 transition-all duration-300 ${
                    isHovered ? 'scale-110' : 'scale-100'
                  }`}>
                    {Math.round(scoreData.score)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 overflow-hidden rounded-full bg-white/5 border border-white/10">
                  {/* Glow effect on hover */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    } blur-lg bg-purple-500/50`}
                    style={{
                      width: `${scoreData.score}%`,
                    }}
                  />

                  {/* Main progress bar */}
                  <div
                    style={{
                      width: mounted ? `${scoreData.score}%` : '0%',
                    }}
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700 ease-out rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}