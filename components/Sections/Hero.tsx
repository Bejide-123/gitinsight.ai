"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      const id = crypto.randomUUID();
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(repoUrl)}`);
    }
  };

  return (
    <section className="relative pt-28 pb-24 px-6 overflow-hidden min-h-[80vh] flex items-center">
      {/* 🌌 Animated background grid */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </motion.div>

        {/* soft glow overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent" />

        {/* slow drifting motion layer */}
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-[0.15]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
        </motion.div>

        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto text-center w-full">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm hover:border-white/20 transition-colors cursor-default"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.4)]" />
          <span className="text-xs tracking-[0.2em] uppercase text-white/60 font-medium">
            ENGINEERING INTELLIGENCE V2.0 IS LIVE
          </span>
          <Sparkles className="w-3 h-3 text-white/40" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
        >
          Turn GitHub Repositories Into{" "}
          <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Engineering Intelligence
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Autonomous deep-analysis of codebase health, team velocity, and technical debt.
          Built for high-performance engineering teams.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 max-w-xl mx-auto w-full"
        >
          <div className={`flex items-center bg-[#0a0a0a] border rounded-xl p-1.5 transition-all duration-300 ${
            isFocused ? 'border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-white/10'
          }`}>
            <FaGithub className="w-5 h-5 text-white/30 ml-3 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent px-3 py-3.5 text-white text-sm outline-none placeholder:text-white/20 font-mono"
              placeholder="https://github.com/organization/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              className="px-6 py-3 bg-gradient-to-r from-white to-white/90 text-black text-sm font-medium rounded-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 flex items-center gap-2 group"
            >
              Analyze
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Trust indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-white/30"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              Trusted by 10,000+ engineers
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span>Open source friendly</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}