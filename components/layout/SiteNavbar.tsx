"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Terminal, X } from "lucide-react";

const links = [
  { label: "Product", href: "/#product-preview" },
  { label: "Capabilities", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
];

export default function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#090c0f]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="GitInsight home">
            <span className="flex h-9 w-9 items-center justify-center rounded border border-cyan-200/15 bg-cyan-200/[0.05]">
              <Terminal className="h-4 w-4 text-cyan-100" />
            </span>
            <span className="text-sm font-semibold text-white">GitInsight</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded px-3.5 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center gap-2 rounded bg-cyan-300 px-3.5 text-sm font-semibold text-[#071013] transition hover:bg-cyan-200"
            >
              Create account
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-9 w-9 items-center justify-center rounded border border-white/10 text-zinc-300 transition hover:bg-white/[0.04] hover:text-white md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

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
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
            />
            <motion.nav
              id="mobile-site-menu"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed inset-x-0 top-16 z-50 border-b border-white/[0.08] bg-[#0d1115] px-4 pb-5 pt-3 shadow-xl md:hidden"
            >
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex gap-2 border-t border-white/[0.08] pt-4">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex h-10 flex-1 items-center justify-center rounded border border-white/10 text-sm text-zinc-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex h-10 flex-1 items-center justify-center rounded bg-cyan-300 text-sm font-semibold text-[#071013]"
                >
                  Create account
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}