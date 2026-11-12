"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

const links = [
  { number: "01", label: "How it works", href: "/#features" },
  { number: "02", label: "The report", href: "/#product-preview" },
  { number: "03", label: "Pricing", href: "/#pricing" },
];

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-x-0 top-3 z-50 px-3 sm:px-5"
      >
        <div className="relative mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between rounded-2xl border border-white/[0.09] bg-[#0b0d16]/85 px-3 shadow-[0_12px_55px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:px-5">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />

          <Link href="/" className="group relative z-10 flex shrink-0 items-center gap-2.5" aria-label="GitInsight home">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-100/20 bg-gradient-to-br from-cyan-200/[0.14] via-violet-300/[0.08] to-fuchsia-300/[0.10] shadow-[0_0_24px_rgba(34,211,238,0.08)] transition duration-300 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Terminal className="h-4 w-4 text-cyan-100 transition-transform duration-300 group-hover:scale-110" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight text-white">GitInsight</span>
              <span className="hidden text-[8px] uppercase tracking-[0.18em] text-zinc-500 sm:block">Repository intelligence</span>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
          >
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.05]"
              >
                <span className="font-mono text-[8px] text-zinc-600 transition-colors group-hover:text-cyan-100/70">{link.number}</span>
                <span className="text-[11px] text-zinc-400 transition-colors group-hover:text-white">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="relative z-10 hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="px-3 py-2 text-xs text-zinc-400 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="group inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-cyan-300 px-3.5 text-xs font-semibold text-[#071013] shadow-[0_5px_22px_rgba(34,211,238,0.13)] transition hover:shadow-[0_5px_32px_rgba(34,211,238,0.24)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Get started
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-zinc-300 transition hover:border-cyan-100/20 hover:text-white md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-[#05060b]/75 backdrop-blur-sm md:hidden"
            />
            <motion.nav
              id="mobile-site-menu"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="fixed inset-x-3 top-[5.25rem] z-50 rounded-2xl border border-white/10 bg-[#0d1019]/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl md:hidden"
            >
              <div className="mb-2 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                Explore GitInsight
              </div>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="font-mono text-[9px] text-cyan-100/60">{link.number}</span>
                  <span className="flex-1 text-sm text-zinc-200">{link.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-600" />
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex h-11 items-center justify-center rounded-xl border border-white/10 text-sm text-zinc-200 transition hover:bg-white/[0.04]"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-cyan-300 text-sm font-semibold text-[#071013]"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
