"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [ repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const handleAnalyze = () => {
    if (repoUrl.trim()) {
      const id = crypto.randomUUID(); // Using crypto.randomUUID()
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(repoUrl)}`);
    }
  };

  return (
    <section className="relative pt-28 pb-24 px-6 overflow-hidden">

      {/* 🌌 Animated background grid */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
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
      </div>

      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-white/10 rounded-full bg-white/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs tracking-widest uppercase text-white/60">
            ENGINEERING INTELLIGENCE V2.0 IS LIVE
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white leading-tight"
        >
          Turn GitHub Repositories Into{" "}
          <span className="italic font-light text-white/70">
            Engineering Intelligence
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-white/50 text-lg max-w-2xl mx-auto"
        >
          Autonomous deep-analysis of codebase health, team velocity, and technical debt.
          Built for high-performance engineering teams.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 max-w-xl mx-auto"
        >
          <div className="flex items-center bg-[#0e0e0e] border border-white/10 rounded-xl p-1.5">
            <input
              className="flex-1 bg-transparent px-4 py-3 text-white text-sm outline-none placeholder:text-white/20"
              placeholder="https://github.com/organization/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
            <button
              onClick={() => handleAnalyze()}
            className="px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition">
              Analyze
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}