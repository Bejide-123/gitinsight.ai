"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Menu, 
  X, 
  Sparkles, 
  User, 
  Zap, 
  GitBranch, 
  BarChart3, 
  Shield,
  Rocket,
  Globe,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "#", icon: BarChart3, disabled: true },
  { name: "Repositories", href: "#", icon: GitBranch, disabled: true },
  { name: "Analytics", href: "#", icon: Zap, disabled: true },
  { name: "Security", href: "#", icon: Shield, disabled: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, href: string, disabled?: boolean) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_60px_rgba(0,0,0,0.6)]"
            : "bg-[#050505] border-b border-white/5"
        }`}
      >
        {/* Top glow line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          {/* Logo - Left end */}
          <Link href="/" className="group flex items-center gap-2.5 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/30 transition-all duration-500" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20 flex items-center justify-center group-hover:border-purple-500/40 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <Terminal className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-white font-bold text-xl tracking-tight group-hover:tracking-tighter transition-all duration-300">
                GitInsight
              </span>
              <span className="text-purple-400/60 text-[10px] font-bold uppercase tracking-[0.2em] ml-2 hidden sm:inline">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop nav - Center */}
          <nav className="hidden md:flex items-center gap-0.5 bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-sm">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isHovered = hoveredIndex === index;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.disabled)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative px-4 py-1.5 text-xs font-medium transition-all duration-300 rounded-full flex items-center gap-2 ${
                    item.disabled 
                      ? "cursor-not-allowed opacity-50" 
                      : ""
                  } ${
                    isActive && !item.disabled
                      ? "text-white bg-white/10"
                      : `text-white/50 hover:text-white hover:bg-white/5 ${isHovered && !item.disabled ? 'scale-105' : 'scale-100'}`
                  }`}
                >
                  <Icon size={15} className={isActive && !item.disabled ? "text-purple-400" : "text-white/30"} />
                  <span>{item.name}</span>
                  {isActive && !item.disabled && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-full border border-purple-500/20 bg-purple-500/5"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                  {item.disabled && (
                    <span className="text-[8px] text-white/20 font-mono uppercase tracking-wider ml-0.5">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right end - Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-2 mr-1 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[9px] text-emerald-400/60 font-mono tracking-wider">OPERATIONAL</span>
            </div>

            <button
              onClick={() => router.push("/login")}
              className="hidden md:block text-sm text-white/50 hover:text-white transition-all duration-300 px-3 py-1.5 rounded-full hover:bg-white/5"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push("/register")}
              className="hidden md:block relative group px-5 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Rocket size={14} />
                Get Started
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:border-white/20"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </header>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence mode="wait">
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-[340px] bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-r border-white/10 z-[70] flex flex-col shadow-2xl shadow-black/50"
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
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/20 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-lg tracking-tight">
                      GitInsight
                    </span>
                    <span className="block text-[8px] text-purple-400/60 font-bold uppercase tracking-[0.3em]">
                      AI Platform
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:border-white/20"
                >
                  <X size={20} />
                </button>
              </div>

              {/* links */}
              <nav className="flex-1 flex flex-col gap-1 p-6 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        if (item.disabled) {
                          e.preventDefault();
                          return;
                        }
                        setOpen(false);
                      }}
                      className={`relative px-4 py-3.5 text-base transition-all duration-300 rounded-xl flex items-center gap-3 ${
                        item.disabled 
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      } ${
                        isActive && !item.disabled
                          ? "text-white bg-purple-500/10 border border-purple-500/20"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={18} className={isActive && !item.disabled ? "text-purple-400" : "text-white/30"} />
                      <span>{item.name}</span>
                      {item.disabled && (
                        <span className="ml-auto text-[8px] text-white/20 font-mono uppercase tracking-wider">
                          Soon
                        </span>
                      )}
                      {isActive && !item.disabled && (
                        <motion.div
                          layoutId="mobile-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-purple-400 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      )}
                    </Link>
                  );
                })}

                {/* Mobile divider */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Mobile nav extras */}
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="px-4 py-3 text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-3 cursor-not-allowed opacity-50"
                >
                  <Globe size={16} />
                  Documentation
                  <span className="ml-auto text-[8px] text-white/20 font-mono uppercase tracking-wider">
                    Soon
                  </span>
                </Link>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="px-4 py-3 text-sm text-white/30 hover:text-white/60 transition-colors flex items-center gap-3 cursor-not-allowed opacity-50"
                >
                  <Zap size={16} />
                  What's New
                  <span className="ml-auto text-[8px] text-white/20 font-mono uppercase tracking-wider">
                    Soon
                  </span>
                </Link>
              </nav>

              {/* bottom actions */}
              <div className="p-6 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-2.5 backdrop-blur-sm">
                  {/* Status */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-white/30 font-mono tracking-wider">STATUS</span>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      <span className="text-[9px] text-emerald-400/60 font-mono">All Systems Go</span>
                    </div>
                  </div>

                  {/* Sign In */}
                  <button
                    onClick={() => {
                      router.push("/login");
                      setOpen(false);
                    }}
                    className="w-full h-11 flex items-center justify-center gap-2.5 text-sm text-white bg-[#050505] border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-300 group"
                  >
                    <User className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                    Sign In
                  </button>

                  {/* Get Started */}
                  <button
                    onClick={() => {
                      router.push("/register");
                      setOpen(false);
                    }}
                    className="w-full h-11 flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <Rocket size={16} />
                    Get Started
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </div>

                {/* Version */}
                <div className="mt-3 text-center">
                  <span className="text-[8px] text-white/20 font-mono tracking-[0.3em] uppercase">
                    v2.4.0 · AI Engine Active
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}