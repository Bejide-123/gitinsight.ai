"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  CircleAlert,
  FileCheck2,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const reportSections = [
  {
    icon: Layers3,
    title: "Engineering dimensions",
    detail: "Architecture, testing, and maintainability",
    color: "text-cyan-100",
    border: "border-cyan-100/15",
  },
  {
    icon: ShieldCheck,
    title: "Risks and strengths",
    detail: "Findings with context to guide your review",
    color: "text-violet-100",
    border: "border-violet-100/15",
  },
  {
    icon: FileCheck2,
    title: "Prioritized next steps",
    detail: "Recommendations to move forward",
    color: "text-emerald-100",
    border: "border-emerald-100/15",
  },
];

export default function DashboardShowcase() {
  return (
    <section
      id="product-preview"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#090a12] px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-cyan-300/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-violet-400/[0.09] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between border-b border-white/[0.08] pb-4">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            <span className="h-px w-7 bg-gradient-to-r from-cyan-100 to-violet-200" />
            A closer look
          </p>
          <span className="font-mono text-[10px] tracking-[0.14em] text-zinc-600">02 / THE REPORT</span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
            >
              <p className="mb-5 text-xs font-medium text-violet-200">One repository. A lot of useful context.</p>
              <h2 className="text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl">
                Make the
                <span className="block bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text pb-2 text-transparent">
                  complex clear.
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
                The report brings repository maturity, engineering dimensions, detected risks, and recommendations together—so you can move from “what is going on?” to “what should we look at?”
              </p>
            </motion.div>

            <div className="mt-8 space-y-3">
              {reportSections.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, delay: index * 0.09 }}
                    className="group flex items-start gap-3.5 border-l border-white/[0.08] py-2 pl-4 transition-colors hover:border-cyan-100/40"
                  >
                    <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.border} bg-white/[0.025]`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-zinc-100">{item.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-zinc-500">{item.detail}</span>
                    </span>
                    <ArrowUpRight className="ml-auto mt-1 h-3.5 w-3.5 text-zinc-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-100" />
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-amber-100/10 bg-amber-100/[0.035] p-3.5">
              <CircleAlert className="h-4 w-4 shrink-0 text-amber-100" />
              <p className="text-xs leading-5 text-zinc-400">
                Use the report as a guide to investigation—not as a substitute for engineering judgment.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-cyan-200/20 via-violet-300/10 to-fuchsia-200/15 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#11131c] p-2 shadow-[0_35px_110px_rgba(0,0,0,0.5)] sm:p-3">
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-300/70" />
                  <span className="h-2 w-2 rounded-full bg-amber-200/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald-200/70" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                  <Sparkles className="h-3 w-3 text-cyan-100" />
                  Report preview
                </div>
                <span className="font-mono text-[9px] text-zinc-600">EXAMPLE</span>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#07090c]">
                <Image
                  src="/real-analysis.png"
                  alt="Illustrative GitInsight repository analysis report with a maturity score, engineering dimensions, repository overview, detected capabilities, and recommendations"
                  width={1200}
                  height={675}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cyan-100/[0.08] to-transparent"
                  animate={{ opacity: [0.35, 0.8, 0.35] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12, x: 12 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="absolute -bottom-5 right-4 hidden max-w-[230px] rounded-xl border border-emerald-100/15 bg-[#111922]/95 p-3 shadow-2xl backdrop-blur-xl sm:block md:-right-5"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-200/[0.08]">
                  <Check className="h-3.5 w-3.5 text-emerald-100" />
                </span>
                <span className="text-[10px] font-medium text-white">Context, not just a verdict</span>
              </div>
              <p className="mt-2 text-[9px] leading-4 text-zinc-400">Findings and recommendations sit alongside the scores.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
