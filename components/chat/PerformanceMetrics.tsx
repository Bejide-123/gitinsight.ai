// PerformanceMetrics.tsx - Redesigned with minimal dark theme
"use client";

import type { CategoryScore } from "@/types/analysis";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity, Shield, Zap, TestTube2, FileText } from "lucide-react";

interface PerformanceMetricsProps {
  categoryScores: Record<string, CategoryScore>;
}

const categoryIcons: Record<string, any> = {
  "Code Quality": TrendingUp,
  "Security": Shield,
  "Performance": Zap,
  "Testing": TestTube2,
  "Documentation": FileText,
  "Maintainability": Activity,
};

export default function PerformanceMetrics({ categoryScores }: PerformanceMetricsProps) {
  const categories = Object.entries(categoryScores);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="col-span-12 md:col-span-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] backdrop-blur-xl group relative"
    >
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl group-hover:opacity-100 transition-opacity duration-700 opacity-0" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Category breakdown</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Overview</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(([category, data], idx) => {
            const Icon = categoryIcons[category] || BarChart3;
            const score = Math.round(data.score);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group/item relative p-4 rounded-2xl border border-white/5 hover:border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <Icon className="w-4 h-4 text-zinc-400 group-hover/item:text-purple-400 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300 group-hover/item:text-white transition-colors">
                      {category}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {score}%
                  </span>
                </div>

                <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    className="h-full rounded-full bg-purple-400"
                  />
                </div>

                {data.issues && data.issues.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">
                      {data.issues.length} issue{data.issues.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}