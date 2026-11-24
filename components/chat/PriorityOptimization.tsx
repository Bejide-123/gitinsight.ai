// PriorityOptimization.tsx - Clean obsidian theme
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="col-span-12 md:col-span-6 rounded-2xl border border-white/10 bg-[#0c0f16] p-6 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
          <Rocket className="w-5 h-5 text-zinc-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">Priority Optimization</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Recommended next steps</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2.5">
        {nextSteps.length === 0 ? (
          <div className="py-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-xs font-medium text-zinc-300">No optimizations needed</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Your project is in excellent shape</p>
          </div>
        ) : (
          nextSteps.map((step, idx) => {
            const Icon = stepIcons[idx % stepIcons.length];

            return (
              <div
                key={idx}
                className="group p-3.5 rounded-xl border border-white/[0.06] bg-[#090b10] hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 p-1.5 rounded-lg bg-white/[0.04] border border-white/10">
                    <Icon className="w-3.5 h-3.5 text-zinc-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {step}
                    </p>
                  </div>

                  <div className="shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Priority indicator */}
      {nextSteps.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center gap-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span>Prioritized by impact</span>
          </div>
          <span className="w-px h-3 bg-white/10" />
          <span>Higher priority first</span>
        </div>
      )}
    </motion.div>
  );
}
