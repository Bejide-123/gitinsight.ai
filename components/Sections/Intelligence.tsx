"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Zap, Shield, GitBranch, BarChart3, Sparkles, Terminal, Rocket } from "lucide-react";

export default function IntelligenceSection() {
  const features = [
    {
      icon: Activity,
      title: "Maturity Score",
      desc: "Analyze architecture quality, test coverage, maintainability, and documentation standards across your repository.",
      gradient: "from-purple-500/20 to-blue-500/20",
    },
    {
      icon: GitBranch,
      title: "Feature Detection",
      desc: "Automatically identifies frameworks, auth systems, API layers, dashboards, and engineering patterns.",
      gradient: "from-purple-500/20 to-purple-600/20",
    },
    {
      icon: BarChart3,
      title: "Velocity Audits",
      desc: "Track commit complexity, engineering throughput, and real development momentum beyond simple metrics.",
      gradient: "from-blue-500/20 to-purple-500/20",
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
    <section className="relative overflow-hidden bg-[#050505] py-20 md:py-32 px-6">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.06),transparent_40%)]" />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] md:w-[900px] h-[250px] md:h-[500px] bg-gradient-to-r from-purple-500/5 via-purple-500/5 to-blue-500/5 blur-[120px] md:blur-[160px] rounded-full" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 mb-6"
          >
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-purple-400">
              Intelligence Layer
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
          >
            Core Intelligence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed"
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)] hover:scale-[1.02]"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 rounded-2xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-500">
                      <Icon className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white/90 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {item.desc}
                  </p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-400 to-transparent group-hover:w-full transition-all duration-700" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 mb-6">
              <Rocket size={14} className="text-purple-400" />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-purple-400">
                Live Intelligence
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Real-time code
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
                      <div className="w-10 h-10 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center group-hover:border-purple-500/40 group-hover:bg-purple-500/20 transition-all duration-300">
                        <Icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white text-lg font-semibold mb-1 tracking-tight group-hover:text-white/90 transition-colors">
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
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-blue-500/10 blur-3xl scale-105 rounded-[30px]" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_120px_rgba(0,0,0,0.5)]">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors cursor-pointer" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors cursor-pointer" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors cursor-pointer" />
                </div>
                <div className="ml-3 text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium">
                  Analysis Terminal v4.1
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[8px] text-purple-400/60 font-mono tracking-wider">LIVE</span>
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
                      { label: "Scanning Source Files", width: "100%" },
                      { label: "Neural Pattern Matching", width: "64%" },
                      { label: "Security Entropy Scan", width: "82%" },
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
                            className="h-full bg-gradient-to-r from-purple-400 to-purple-300 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logs */}
                  <div className="space-y-1.5 text-zinc-500 leading-relaxed border-t border-white/5 pt-3 text-xs">
                    <p className="text-blue-400/60">[INFO] Found 142 microservices...</p>
                    <p className="text-yellow-400/60">[WARN] Circular dependency detected...</p>
                    <p className="text-blue-400/60">[INFO] Detecting authentication...</p>
                    <p className="text-blue-400/60">[INFO] Calculating entropy...</p>
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
          className="mt-20 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
        />
      </div>
    </section>
  );
}