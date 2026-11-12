"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleDot,
  FileSearch2,
  GitBranch,
  GitCompareArrows,
  MessageSquareText,
  ScanSearch,
  Sparkles,
} from "lucide-react";

const stages = [
  {
    number: "01",
    title: "Bring a repository",
    description: "Paste a GitHub URL or connect your account to choose a repository.",
    icon: GitBranch,
  },
  {
    number: "02",
    title: "Get the engineering picture",
    description: "See maturity, security, testing, architecture, and readiness signals in one analysis.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Decide what to do next",
    description: "Explore findings, ask questions, and compare future analysis runs.",
    icon: FileSearch2,
  },
];

const categories = [
  { label: "Security", color: "bg-rose-300", text: "text-rose-200" },
  { label: "Architecture", color: "bg-cyan-200", text: "text-cyan-100" },
  { label: "Testing", color: "bg-amber-200", text: "text-amber-100" },
  { label: "Maintainability", color: "bg-violet-200", text: "text-violet-100" },
  { label: "Readiness", color: "bg-emerald-200", text: "text-emerald-100" },
];

export default function IntelligenceSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#080910] px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-40 top-32 h-[28rem] w-[28rem] rounded-full bg-cyan-300/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-violet-500/[0.09] blur-[130px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
        >
          <div>
            <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <span className="h-px w-7 bg-gradient-to-r from-cyan-100 to-violet-200" />
              How GitInsight works
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              From a repo full of signals
              <span className="block bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text pb-2 text-transparent">
                to a plan you can use.
              </span>
            </h2>
          </div>
          <p className="max-w-lg pb-1 text-sm leading-7 text-zinc-400 sm:text-base lg:justify-self-end">
            GitInsight brings repository health into focus, explains the areas worth a closer look, and helps you keep the conversation moving.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="relative">
            <div className="absolute bottom-8 left-[19px] top-8 w-px bg-gradient-to-b from-cyan-200/50 via-violet-200/30 to-transparent" />
            <div className="space-y-7">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                return (
                  <motion.article
                    key={stage.number}
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    className="relative flex gap-5"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-100/20 bg-[#0b1118] shadow-[0_0_24px_rgba(34,211,238,0.12)]">
                      <Icon className="h-4 w-4 text-cyan-100" />
                    </div>
                    <div className="pb-2 pt-0.5">
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] tracking-[0.15em] text-cyan-100/60">{stage.number}</span>
                        <h3 className="text-sm font-semibold text-white sm:text-base">{stage.title}</h3>
                      </div>
                      <p className="max-w-sm text-sm leading-6 text-zinc-400">{stage.description}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-300/[0.12] via-violet-400/[0.08] to-fuchsia-400/[0.10] blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0c1019]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">The engineering picture</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">More than a single score.</h3>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-100/15 bg-cyan-100/[0.06]">
                  <Sparkles className="h-4 w-4 text-cyan-100" />
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-[0.82fr_1.18fr]">
                <div className="relative flex min-h-48 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-200/[0.07] via-white/[0.015] to-violet-300/[0.08] p-5">
                  <motion.div
                    aria-hidden="true"
                    className="absolute h-36 w-36 rounded-full border border-cyan-100/10"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.75, 0.35] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan-100/30 bg-[#0a1119]/90 shadow-[0_0_35px_rgba(34,211,238,0.12)]">
                    <span className="text-3xl font-semibold tracking-tight text-white">76</span>
                    <span className="absolute -bottom-5 text-[9px] uppercase tracking-[0.14em] text-zinc-400">Maturity</span>
                  </div>
                  <p className="relative mt-9 text-center text-[10px] leading-5 text-zinc-400">A helpful starting point,<br />with the detail behind it.</p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-200">Explore by dimension</span>
                    <span className="text-[9px] text-zinc-600">ILLUSTRATIVE</span>
                  </div>
                  <div className="space-y-3.5">
                    {categories.map((category, index) => (
                      <div key={category.label}>
                        <div className="mb-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-zinc-400">{category.label}</span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + index * 0.12 }}
                            className={category.text}
                          >
                            Signals reviewed
                          </motion.span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${68 + ((index * 17) % 29)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.2 + index * 0.1 }}
                            className={`h-full rounded-full ${category.color} opacity-75`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">
                {["Findings", "Strengths", "Recommendations", "Readiness"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[9px] text-zinc-400">
                    <Check className="h-3 w-3 text-emerald-200" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 border-t border-white/[0.08] pt-12 md:mt-24 md:pt-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">Keep going after the report</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Ask. Improve. Compare.</h3>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-400">
              The analysis is a starting point. Use the context to investigate findings and measure what changes next time.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1018] p-5 sm:p-6"
            >
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.08] blur-[80px] transition-colors group-hover:bg-cyan-300/[0.14]" />
              <div className="relative grid gap-6 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-100/15 bg-cyan-100/[0.06]">
                    <MessageSquareText className="h-4 w-4 text-cyan-100" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Ask your repository a question.</h4>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">Follow up on a finding with answers grounded in your report and relevant code context.</p>
                </div>
                <div className="space-y-3 rounded-xl border border-white/[0.08] bg-[#090c13]/90 p-4">
                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm border border-violet-200/15 bg-violet-300/[0.08] px-3 py-2.5 text-[11px] leading-5 text-violet-50">
                    What should I look at first in this report?
                  </div>
                  <div className="flex max-w-[92%] gap-2 rounded-2xl rounded-bl-sm border border-cyan-100/10 bg-cyan-100/[0.04] px-3 py-2.5 text-[11px] leading-5 text-zinc-300">
                    <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-cyan-100" />
                    Start with the highest-priority finding, then review the evidence and recommended next step.
                  </div>
                  <div className="flex items-center gap-1.5 border-t border-white/[0.07] pt-3 text-[9px] text-zinc-500">
                    <CircleDot className="h-3 w-3 text-emerald-200" />
                    Repository-aware conversation
                  </div>
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1018] p-5 sm:p-6"
            >
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-400/[0.08] blur-[80px] transition-colors group-hover:bg-violet-400/[0.14]" />
              <div className="relative grid gap-6 sm:grid-cols-[0.8fr_1.2fr] sm:items-center">
                <div>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100/15 bg-violet-100/[0.06]">
                    <GitCompareArrows className="h-4 w-4 text-violet-100" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">See what changed between runs.</h4>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">Compare score movement and track findings as new, resolved, changed, or persistent.</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-[#090c13]/90 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-zinc-300">Analysis comparison</span>
                    <span className="rounded-full border border-emerald-200/15 bg-emerald-200/[0.05] px-2 py-1 text-[9px] text-emerald-100">Later run</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                      <p className="text-[9px] text-zinc-500">Previous</p>
                      <p className="mt-1 text-2xl font-semibold text-zinc-300">68</p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4 text-cyan-100" />
                    </motion.div>
                    <div className="flex-1 rounded-lg border border-cyan-100/15 bg-cyan-100/[0.04] p-3">
                      <p className="text-[9px] text-cyan-100/70">Latest</p>
                      <p className="mt-1 text-2xl font-semibold text-white">76</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-emerald-200/15 bg-emerald-200/[0.05] px-2 py-1 text-[9px] text-emerald-100">Resolved</span>
                    <span className="rounded-full border border-rose-200/15 bg-rose-200/[0.05] px-2 py-1 text-[9px] text-rose-100">New</span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] text-zinc-400">Persistent</span>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </div>

        <a href="#product-preview" className="group mx-auto mt-12 inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition hover:text-cyan-100">
          See what the report looks like
          <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.span>
        </a>
      </div>
    </section>
  );
}
