"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter()

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-[#050505] border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          <div className="text-white font-bold text-xl tracking-tighter">
            GitInsight
          </div>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
            onClick={() => router.push("/login")}
            className="hidden md:block text-white/60 hover:text-white text-sm">
              Sign In
            </button>

            <button 
            onClick={() => router.push("/register")}
            className="hidden md:block px-4 py-2 bg-white text-black text-sm font-medium">
              Get Started
            </button>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence mode="wait">
        {open && (
          <>
            {/* overlay */}
            <motion.div
              className="fixed inset-0 bg-black/70 z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-[320px] bg-[#050505] border-r border-white/10 z-[70] flex flex-col"
              initial={{ transform: "translateX(-100%)" }}
              animate={{ transform: "translateX(0%)" }}
              exit={{ transform: "translateX(-100%)" }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 22,
              }}
            >
              {/* top */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="text-white font-bold">GitInsight</span>

                <button onClick={() => setOpen(false)}>
                  <X className="text-white" />
                </button>
              </div>

              {/* links */}
              <nav className="flex flex-col gap-6 p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-white/60 hover:text-white text-lg"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* bottom actions (UPDATED) */}
              <div className="mt-auto p-6 border-t border-white/10">
                {/* action group */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col gap-2">
                  {/* Sign In */}
                  <button
                    onClick={() => router.push("/login")}
                  className="w-full h-10 flex items-center justify-center text-sm text-white bg-[#050505] border border-white/10 rounded-md hover:bg-white/5 hover:border-white/20 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                    Sign In
                  </button>

                  {/* divider */}
                  <div className="h-px bg-white/5" />

                  {/* Get Started */}
                  <button 
                    onClick={() => router.push("/register")}
                  className="w-full px-3 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
