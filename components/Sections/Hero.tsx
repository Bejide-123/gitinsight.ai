"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      const id = crypto.randomUUID();
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(repoUrl)}`);
    }
  };

  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[85vh] flex items-center bg-[#050505]">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </motion.div>

        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />

        {/* Drifting motion layer */}
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
          className="absolute inset-0 opacity-[0.1]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.08),transparent_60%)]" />
        </motion.div>

        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto text-center w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 border border-purple-500/20 rounded-full bg-purple-500/10 backdrop-blur-sm hover:border-purple-500/40 hover:bg-purple-500/20 transition-all duration-300 cursor-default"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-purple-400 font-medium">
            Engineering Intelligence V2.0
          </span>
          <Sparkles className="w-3 h-3 text-purple-400/60" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
        >
          Turn GitHub Repositories Into{" "}
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
            Engineering Intelligence
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
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
            isFocused 
              ? 'border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.08)]' 
              : 'border-white/10 hover:border-white/20'
          }`}>
            <FaGithub className="w-5 h-5 text-zinc-500 ml-3 flex-shrink-0" />
            <input
              className="flex-1 bg-transparent px-3 py-3.5 text-white text-sm outline-none placeholder:text-zinc-600 font-mono"
              placeholder="https://github.com/organization/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button
              onClick={handleAnalyze}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 group ${
                isHovered
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-[1.02]'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              Analyze
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                isHovered ? 'translate-x-1' : 'group-hover:translate-x-1'
              }`} />
            </button>
          </div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs"
          >
            <span className="flex items-center gap-2 text-zinc-500">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Enterprise-grade security</span>
            </span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-2 text-zinc-500">
              <Rocket className="w-3.5 h-3.5 text-purple-400" />
              <span>Trusted by 10,000+ engineers</span>
            </span>
            <span className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="flex items-center gap-2 text-zinc-500">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Open source friendly</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "120px" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 mx-auto h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
        />
      </div>
    </section>
  );
}