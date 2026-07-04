"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, Sparkles, User, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
  { name: "Changelog", href: "/changelog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-[#050505] border-b border-white/5"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 blur-xl rounded-full group-hover:bg-white/20 transition-all duration-500" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all duration-300">
                <Sparkles className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
            <span className="text-white font-bold text-xl tracking-tight group-hover:tracking-tighter transition-all duration-300">
              GitInsight
              <span className="text-white/40 font-light">.ai</span>
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm transition-all duration-300 rounded-lg ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="hidden md:block text-sm text-white/60 hover:text-white transition-colors duration-300 px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push("/register")}
              className="hidden md:block px-5 py-2 bg-gradient-to-r from-white to-white/90 text-black text-sm font-medium rounded-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:border-white/20"
            >
              <Menu size={20} />
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-[340px] bg-[#050505] border-r border-white/10 z-[70] flex flex-col shadow-2xl shadow-black/50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 24,
              }}
            >
              {/* top */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-lg tracking-tight">
                    GitInsight
                  </span>
                </Link>

                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:border-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              {/* links */}
              <nav className="flex-1 flex flex-col gap-1 p-6 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`relative px-4 py-3 text-base transition-all duration-300 rounded-lg ${
                        isActive
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* bottom actions */}
              <div className="p-6 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 space-y-2">
                  {/* Sign In */}
                  <button
                    onClick={() => {
                      router.push("/login");
                      setOpen(false);
                    }}
                    className="w-full h-11 flex items-center justify-center gap-2 text-sm text-white bg-[#050505] border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/20 transition-all duration-300 group"
                  >
                    <User className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                    Sign In
                  </button>

                  {/* divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[#050505] px-2 text-[10px] text-white/20 uppercase tracking-widest">or</span>
                    </div>
                  </div>

                  {/* Get Started */}
                  <button
                    onClick={() => {
                      router.push("/register");
                      setOpen(false);
                    }}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-white to-white/90 text-black text-sm font-medium rounded-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get Started
                    <Sparkles className="w-4 h-4" />
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