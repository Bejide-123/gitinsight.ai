"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Zap, Shield, GitBranch, BarChart3, Sparkles, Rocket } from "lucide-react";

export default function IntelligenceSection() {
  const features = [
    {
      icon: Activity,
      title: "Maturity Score",
      desc: "Analyze architecture quality, test coverage, maintainability, and documentation standards across your repository.",
    },
    {
      icon: GitBranch,
      title: "Repository Context",
      desc: "Identify project structure, frameworks, technology choices, and engineering patterns.",
    },
    {
      icon: BarChart3,
      title: "Prioritized Findings",
      desc: "Turn detected risks and improvement areas into an ordered, actionable engineering backlog.",
    },
  ];

  const insights = [
    {
      title: "Architecture Mapping",
      desc: "Visualize dependency graphs, services, and engineering boundaries instantly.",
      icon: Cpu,
    },
    {
      title: "Security Deep-Scan",
      desc: "Detect vulnerabilities, unsafe patterns, and infrastructure risks proactively.",
      icon: Shield,
    },
    {
      title: "Maintainability Review",
      desc: "Surface code quality, documentation, and long-term maintenance signals.",
      icon: Zap,
    },
  ];

  return (
    <section id="features" className="relative overflow-hidden border-b border-white/[0.08] bg-[#07090c] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded border border-cyan-200/15 bg-cyan-200/[0.04] px-3 py-2"
          >
            <Sparkles size={14} className="text-cyan-200" />
            <span className="text-xs text-cyan-100">
              Intelligence Layer
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl"
          >
            Core Intelligence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base"
          >
            Advanced repository analysis powered by AI-driven engineering
            insights, architecture mapping, and live code intelligence.
          </motion.p>
        </div>

        {/* ================= CORE INTELLIGENCE CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 md:mb-32">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d1115] p-6 transition-colors hover:border-cyan-200/20 hover:bg-[#10161a] sm:p-7"
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md border border-cyan-200/15 bg-cyan-200/[0.04] transition-colors group-hover:border-cyan-200/25">
                      <Icon className="h-5 w-5 text-cyan-100" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-6 text-zinc-400">
                    {item.desc}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-cyan-200/60 transition-all duration-300 group-hover:w-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= REAL-TIME SYNTHESIS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded border border-emerald-200/15 bg-emerald-200/[0.04] px-3 py-2">
              <Rocket size={14} className="text-emerald-200" />
              <span className="text-xs text-emerald-100">
                Live Intelligence
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Real-time code
              <br />
              <span className="text-cyan-200">
                synthesis.
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed max-w-xl">
              Deep repository understanding powered by autonomous AI analysis,
              architectural reasoning, and live engineering telemetry.
            </p>

            <div className="mt-10 space-y-6">
              {insights.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 group cursor-default"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded border border-white/10 bg-white/[0.03] transition group-hover:border-cyan-200/20">
                        <Icon className="h-4 w-4 text-cyan-100" />
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-white">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT SIDE - TERMINAL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d1115]">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors cursor-pointer" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors cursor-pointer" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors cursor-pointer" />
                </div>
                <div className="ml-3 text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium">
                  Example analysis steps
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500">Illustrative</span>
                </div>
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono">
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="text-white/60 text-sm">
                      $ analyze repo: main-stack
                    </span>
                    <span className="text-[10px] text-white/20">now</span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-4">
                    {[
                      { label: "Repository structure", width: "100%" },
                      { label: "Engineering dimensions", width: "64%" },
                      { label: "Prioritized findings", width: "82%" },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between gap-2 mb-1.5 text-white/60 text-xs">
                          <span className="truncate">{item.label}</span>
                          <span className="flex-shrink-0 text-white/40">{item.width}</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: item.width }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="h-full rounded-full bg-cyan-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logs */}
                  <div className="space-y-1.5 text-zinc-500 leading-relaxed border-t border-white/5 pt-3 text-xs">
                    <p className="text-cyan-100/70">[INFO] Repository structure indexed</p>
                    <p className="text-amber-100/70">[INFO] Reviewing security patterns</p>
                    <p className="text-cyan-100/70">[INFO] Scoring architecture and tests</p>
                    <p className="text-cyan-100/70">[INFO] Preparing recommendations</p>
                    <p className="text-emerald-400/80 font-medium pt-1">
                      [SUCCESS] Repository intelligence generated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 h-px bg-white/[0.08]"
        />
      </div>
    </section>
  );
}