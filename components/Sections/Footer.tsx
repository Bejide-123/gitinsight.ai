"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Terminal } from "lucide-react";

const groups = [
  {
    name: "Product",
    links: [
      { label: "How it works", href: "/#features" },
      { label: "Report preview", href: "/#product-preview" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    name: "Workspace",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#080910]">
      <div className="pointer-events-none absolute -left-48 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-300/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute -right-48 top-0 h-[36rem] w-[36rem] rounded-full bg-violet-500/[0.09] blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid gap-12 border-b border-white/[0.08] pb-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <span className="h-px w-7 bg-gradient-to-r from-cyan-100 to-violet-200" />
              Your next step starts here
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl md:text-7xl">
              Make your codebase
              <span className="block bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text pb-2 text-transparent">
                make sense.
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-base">
              Start with a GitHub repository. Leave with a clearer picture of its engineering health and what to explore next.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e121b]/85 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.22)] sm:p-6"
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.10] blur-[75px]" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">Start exploring</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-100/15 bg-cyan-100/[0.06]">
                  <Terminal className="h-3.5 w-3.5 text-cyan-100" />
                </span>
              </div>
              <p className="text-lg font-medium leading-7 text-white">One repository is all it takes to begin.</p>
              <Link
                href="/#home"
                className="group mt-5 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-cyan-300 text-xs font-semibold text-[#071013] shadow-[0_6px_25px_rgba(34,211,238,0.12)] transition hover:shadow-[0_6px_35px_rgba(34,211,238,0.26)]"
              >
                Analyze a repository
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-center text-[10px] text-zinc-500">Paste a GitHub URL or connect your account.</p>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:items-start lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-100/20 bg-gradient-to-br from-cyan-200/[0.12] to-violet-300/[0.08] shadow-[0_0_22px_rgba(34,211,238,0.08)] transition group-hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                <Terminal className="h-4 w-4 text-cyan-100" />
              </span>
              <span className="text-base font-semibold tracking-tight text-white">GitInsight</span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-6 text-zinc-500">
              Repository maturity, risks, recommendations, and a path to better-informed engineering decisions.
            </p>
          </motion.div>

          {groups.map((group, index) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <h3 className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{group.name}</h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-cyan-100"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-5 text-[10px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>Engineering clarity, from the first scan to the next improvement.</span>
          <span>© {new Date().getFullYear()} GitInsight</span>
        </div>
      </div>
    </footer>
  );
}
