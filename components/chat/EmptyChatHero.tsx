"use client";

import {
  ArrowRight,
  Bolt,
  Palette,
  Component,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { SiVercel } from "react-icons/si";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

type ExampleCard = {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  logo: React.ReactNode;
  tags?: string[];
  gradient?: string;
};

const examples: ExampleCard[] = [
  {
    title: "vercel/next.js",
    subtitle: "The React Framework",
    description:
      "Analyze performance bottlenecks, hydration strategy, and build optimization in the world's most popular React framework.",
    icon: <Bolt size={14} />,
    logo: <SiVercel size={18} />,
    tags: ["Performance", "SSR", "Optimization"],
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "shadcn/ui",
    subtitle: "Beautifully Designed Components",
    description:
      "Map the architectural structure of accessible component primitives and Radix-based patterns with AI-powered insights.",
    icon: <Palette size={14} />,
    logo: <Component size={18} />,
    tags: ["UI/UX", "Accessibility", "Radix"],
    gradient: "from-purple-500/20 to-pink-500/20",
  },
];

export default function EmptyChatHero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      const id = crypto.randomUUID();
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(repoUrl)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-12 pb-16 min-h-[calc(100vh-4rem)]">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-purple-500/5 blur-[100px]" />
        <div className="absolute top-20 left-10 h-48 w-48 rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 max-w-2xl text-center"
      >
        <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
          <Sparkles className="relative h-6 w-6 text-white" />
        </div>

        <h1 className="mb-3 text-2xl md:text-3xl font-semibold tracking-tight text-white">
          Analyze Any{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            GitHub Repository
          </span>
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-zinc-400 max-w-xl mx-auto">
          Instant engineering intelligence from your codebase. Audit security,
          map dependencies, and optimize performance in seconds.
        </p>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-6 text-[10px] text-zinc-500"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Enterprise-grade security</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-cyan-400" />
            <span>10,000+ repos analyzed</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Powered by AI</span>
          </div>
        </motion.div>
      </motion.div>

      {/* INPUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="z-10 w-full max-w-2xl"
      >
        <div className={`flex items-center gap-2 rounded-xl border transition-all duration-300 p-1 backdrop-blur-md ${
          isFocused 
            ? "border-white/30 bg-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]" 
            : "border-white/10 bg-white/5 hover:border-white/20"
        }`}>
          <div className="flex flex-1 items-center gap-2.5 px-3">
            <FaGithub size={16} className={`transition-colors duration-300 ${
              isFocused ? "text-cyan-400" : "text-zinc-500"
            }`} />

            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600 font-mono py-2.5"
              placeholder="https://github.com/vercel/next.js"
            />

            {repoUrl && (
              <button 
                onClick={() => setRepoUrl("")}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <span className="text-xs">✕</span>
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm text-black transition-all duration-300 font-medium ${
              isHovering 
                ? "bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]" 
                : "bg-white"
            }`}
          >
            Analyze
            <ArrowRight size={14} className={`transition-transform duration-300 ${
              isHovering ? "translate-x-1" : ""
            }`} />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex items-center justify-center gap-3"
        >
          <div className="flex gap-1">
            <span className="h-1 w-4 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]" />
            <span className="h-1 w-4 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]" />
            <span className="h-1 w-4 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]" />
            <span className="h-1 w-4 rounded-full bg-zinc-800" />
            <span className="h-1 w-4 rounded-full bg-zinc-800" />
          </div>

          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
            3 free analyses remaining
          </p>

          <button className="text-[9px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
            Upgrade →
          </button>
        </motion.div>
      </motion.div>

      {/* EXAMPLE CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="z-10 mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2"
      >
        {examples.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setRepoUrl(`https://github.com/${item.title}`);
            }}
            className={`group relative cursor-pointer rounded-xl border border-white/10 bg-gradient-to-br ${item.gradient} from-white/5 to-transparent p-4 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] overflow-hidden`}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute -top-20 -right-20 h-40 w-40 bg-cyan-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-40 w-40 bg-purple-500/10 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white group-hover:border-white/20 transition-all duration-300">
                    {item.logo}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-[9px] text-zinc-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-zinc-500 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                {item.description}
              </p>

              {/* Tags */}
              {item.tags && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-500 group-hover:border-white/10 group-hover:text-zinc-400 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Click to analyze indicator */}
              <div className="mt-2.5 flex items-center gap-1 text-[8px] text-zinc-600 group-hover:text-cyan-400 transition-colors duration-300">
                <span>Click to analyze</span>
                <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "160px" }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </section>
  );
}