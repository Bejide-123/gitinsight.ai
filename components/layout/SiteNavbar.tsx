"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  GitBranch,
  Menu,
  Terminal,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Capabilities", href: "/#capabilities" },
  { label: "AI Codebase Chat", href: "/#ai-chat" },
  { label: "Diff Engine", href: "/#comparison" },
  { label: "Pricing", href: "/#pricing" },
];

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-x-0 top-3 z-50 px-3 sm:px-6"
      >
        <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl border border-white/[0.08] bg-[#090b10]/80 px-4 shadow-2xl backdrop-blur-xl">
          {/* Subtle top edge specular highlight */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Logo & Product Monogram */}
          <Link
            href="/"
            className="group relative z-10 flex shrink-0 items-center gap-2.5"
            aria-label="GitInsight Home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-200 transition duration-200 group-hover:border-white/20 group-hover:bg-white/[0.08] group-hover:text-white">
              <Terminal className="h-4 w-4" />
            </span>
            <span className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white">
                GitInsight
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                <GitBranch className="h-2.5 w-2.5 text-zinc-500" />
                ai
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="relative z-10 hidden items-center gap-2.5 md:flex">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/#home"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-black shadow-sm transition hover:bg-zinc-200"
            >
              Analyze Repo
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:border-white/20 hover:text-white md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
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
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden"
            />
            <motion.nav
              id="mobile-site-menu"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="fixed inset-x-3 top-20 z-50 rounded-xl border border-white/10 bg-[#0c0e14]/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                  </Link>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex h-10 items-center justify-center rounded-lg border border-white/10 text-xs font-medium text-zinc-200 transition hover:bg-white/[0.04]"
                >
                  Sign In
                </Link>
                <Link
                  href="/#home"
                  onClick={closeMenu}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-white text-xs font-semibold text-black transition hover:bg-zinc-200"
                >
                  Analyze Repo
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
