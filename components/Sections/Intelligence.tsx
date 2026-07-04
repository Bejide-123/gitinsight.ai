"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Zap, Shield, GitBranch, BarChart3 } from "lucide-react";

export default function IntelligenceSection() {
  const features = [
    {
      icon: Activity,
      title: "Maturity Score",
      desc: "Analyze architecture quality, test coverage, maintainability, and documentation standards across your repository.",
    },
    {
      icon: GitBranch,
      title: "Feature Detection",
      desc: "Automatically identifies frameworks, auth systems, API layers, dashboards, and engineering patterns.",
    },
    {
      icon: BarChart3,
      title: "Velocity Audits",
      desc: "Track commit complexity, engineering throughput, and real development momentum beyond simple metrics.",
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
      title: "Engineering Entropy",
      desc: "Measure technical debt accumulation and long-term maintainability signals.",
      icon: Zap,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#050505] py-16 md:py-32 px-6 sm:px-8 md:px-4 mt-8 sm:mt-12 md:mt-0">
      {/* background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%)]" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] md:w-[900px] h-[250px] md:h-[500px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-[120px] md:blur-[160px] rounded-full" />

      <div className="relative z-10 w-[75vw] md:w-full md:max-w-7xl mx-auto px-0 sm:px-4">
        {/* ================= HEADER ================= */}
        <div className="mb-12 sm:mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[9px] sm:text-xs tracking-[0.3em] uppercase text-white/40 mb-3 sm:mb-4 font-medium"
          >
            Intelligence Layer
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight"
          >
            Core Intelligence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-5 max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg text-zinc-400 leading-relaxed"
          >
            Advanced repository analysis powered by AI-driven engineering
            insights, architecture mapping, and live code intelligence.
          </motion.p>
        </div>

        {/* ================= CORE INTELLIGENCE CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-16 sm:mb-24 md:mb-36">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-xl sm:rounded-2xl md:rounded-3xl
                  border border-white/10
                  bg-white/[0.03]
                  backdrop-blur-xl
                  p-5 sm:p-6 md:p-8
                  hover:border-white/20
                  transition-all duration-500
                  hover:shadow-[0_0_60px_rgba(255,255,255,0.03)]
                "
              >
                {/* hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-52 md:w-60 h-52 md:h-60 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
                </div>

                {/* icon */}
                <div className="relative z-10 mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                </div>

                {/* content */}
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3 md:mb-4 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* bottom line */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-white/30 to-transparent group-hover:w-full transition-all duration-700" />
              </motion.div>
            );
          })}
        </div>

        {/* ================= REAL-TIME SYNTHESIS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-14 lg:gap-20 items-center">
          {/* LEFT SIDE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <p className="text-[9px] sm:text-xs tracking-[0.3em] uppercase text-white/40 mb-3 sm:mb-4 font-medium">
              Live Intelligence
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
              Real-time code
              <br />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">synthesis.</span>
            </h2>

            <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base lg:text-lg text-zinc-400 leading-relaxed max-w-xl">
              Deep repository understanding powered by autonomous AI analysis,
              architectural reasoning, and live engineering telemetry.
            </p>

            <div className="mt-8 sm:mt-10 md:mt-12 space-y-5 sm:space-y-6 md:space-y-8">
              {insights.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-3 sm:gap-4 md:gap-5 group cursor-default"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-white/20 transition-colors">
                        <Icon className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2 tracking-tight">
                        {feature.title}
                      </h4>

                      <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT SIDE TERMINAL */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            {/* glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl scale-105 rounded-[30px]" />

            <div
              className="
                relative
                overflow-hidden
                rounded-[24px] md:rounded-[32px]
                border border-white/10
                bg-[#0b0b0b]
                shadow-[0_20px_120px_rgba(255,255,255,0.06)]
              "
            >
              {/* top bar */}
              <div className="flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/70 flex-shrink-0 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/70 flex-shrink-0 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/70 flex-shrink-0 hover:bg-green-500 transition-colors cursor-pointer" />

                <div className="ml-2 sm:ml-3 md:ml-4 text-[8px] sm:text-[9px] md:text-[11px] tracking-[0.25em] uppercase text-white/30 truncate font-medium">
                  Analysis Terminal v4.1
                </div>
              </div>

              {/* terminal body */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-8 font-mono text-[11px] sm:text-xs md:text-sm">
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span className="truncate text-white/60">
                      $ analyze repo: main-stack
                    </span>
                    <span className="text-[10px] text-white/20">now</span>
                  </div>

                  {/* progress */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-5">
                    {[
                      {
                        label: "Scanning Source Files",
                        width: "100%",
                      },
                      {
                        label: "Neural Pattern Matching",
                        width: "64%",
                      },
                      {
                        label: "Security Entropy Scan",
                        width: "82%",
                      },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between gap-2 mb-1.5 sm:mb-2 text-white/60 text-[10px] sm:text-xs">
                          <span className="truncate mr-2">
                            {item.label}
                          </span>
                          <span className="flex-shrink-0 text-white/40">{item.width}</span>
                        </div>

                        <div className="h-1 sm:h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: item.width }}
                            transition={{ duration: 1.5 }}
                            viewport={{ once: true }}
                            className="h-full bg-gradient-to-r from-white/60 to-white/30 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* logs */}
                  <div className="space-y-2 sm:space-y-2.5 text-zinc-500 leading-relaxed border-t border-white/5 pt-3 sm:pt-4 text-[10px] sm:text-xs">
                    <p className="text-blue-400/60">[INFO] Found 142 microservices...</p>
                    <p className="text-yellow-400/60">[WARN] Circular dependency detected...</p>
                    <p className="text-blue-400/60">[INFO] Detecting authentication...</p>
                    <p className="text-blue-400/60">[INFO] Calculating entropy...</p>

                    <p className="text-emerald-400/80 font-medium">
                      [SUCCESS] Repository intelligence generated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}