"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Terminal } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#07090c]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* TOP GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >

          {/* BRAND */}
          <motion.div variants={item} className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded border border-cyan-200/15 bg-cyan-200/[0.04]">
                <Terminal className="h-4 w-4 text-cyan-100" />
              </div>
              <h2 className="text-base font-semibold text-white">
                GitInsight
              </h2>
            </div>

            <p className="mb-6 max-w-sm text-sm leading-6 text-zinc-400">
              Repository health, security signals, and prioritized engineering improvements in one workspace.
            </p>
          </motion.div>

          {/* LINKS */}
          {[
            { title: "Product", links: [{ label: "Preview", href: "/#product-preview" }, { label: "Capabilities", href: "/#features" }, { label: "Pricing", href: "/#pricing" }] },
            { title: "Account", links: [{ label: "Sign in", href: "/login" }, { label: "Create account", href: "/register" }, { label: "Dashboard", href: "/dashboard" }] },
          ].map((group, i) => (
            <motion.div key={i} variants={item}>
              <h4 className="mb-3 text-xs font-medium text-zinc-400">
                {group.title}
              </h4>

              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Repository intelligence for software teams.</span>
          <span>© {new Date().getFullYear()} GitInsight</span>
        </div>
      </div>
    </footer>
  );
}