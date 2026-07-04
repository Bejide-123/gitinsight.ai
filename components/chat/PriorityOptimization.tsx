// PriorityOptimization.tsx - Redesigned with minimal dark theme
"use client";

import { Zap, ChevronRight, Sparkles, Rocket, Target, Lightbulb, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PriorityOptimizationProps {
  nextSteps: string[];
}

const stepIcons = [Sparkles, Rocket, Target, Lightbulb, Zap];

export default function PriorityOptimization({ nextSteps }: PriorityOptimizationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="col-span-12 md:col-span-6 rounded-3xl border border-white/10 bg-[#0a0a0a] backdrop-blur-xl overflow-hidden group relative"
    >
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl group-hover:opacity-100 transition-opacity duration-700 opacity-0" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/10">
            <Rocket className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Priority Optimization</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Recommended next steps</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {nextSteps.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <CheckCircle className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-sm text-zinc-400">No optimizations needed</p>
              <p className="text-xs text-zinc-500 mt-1">Your project is in excellent shape</p>
            </div>
          ) : (
            nextSteps.map((step, idx) => {
              const Icon = stepIcons[idx % stepIcons.length];

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="group/item relative p-4 rounded-2xl border border-white/5 hover:border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-300 group-hover/item:text-white transition-colors">
                        {step}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-zinc-600 group-hover/item:text-zinc-400 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Priority indicator */}
        {nextSteps.length > 0 && (
          <div className="mt-6 flex items-center gap-4 text-[10px] text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Prioritized by impact</span>
            </div>
            <span className="w-px h-3 bg-white/10" />
            <span>Higher priority first</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}