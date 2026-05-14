"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Link as LinkIcon,
  Bolt,
  Palette,
  Component,
} from "lucide-react";
import { SiVercel } from "react-icons/si";

type ExampleCard = {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  logo: React.ReactNode;
};

const examples: ExampleCard[] = [
  {
    title: "vercel/next.js",
    subtitle: "The React Framework",
    description:
      "Analyze performance bottlenecks and hydration strategy in the world's most popular React framework.",
    icon: <Bolt size={18} />,
    logo: <SiVercel size={22} />,
  },
  {
    title: "shadcn/ui",
    subtitle: "Beautifully Designed Components",
    description:
      "Map the architectural structure of accessible component primitives and Radix-based patterns.",
    icon: <Palette size={18} />,
    logo: <Component size={22} />,
  },
];

export default function EmptyChatHero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-16 relative">
      {/* glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl z-10"
      >
        <div className="mx-auto w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent" />
          <span className="text-white text-3xl">⟡</span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white mb-4">
          Analyze Any GitHub Repository
        </h1>

        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          Instant engineering intelligence from your codebase. Audit security,
          map dependencies, and optimize performance in seconds.
        </p>
      </motion.div>

      {/* INPUT */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl z-10"
      >
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 flex-1 px-3">
            <LinkIcon size={16} className="text-zinc-500" />
            <input
              className="w-full bg-transparent outline-none text-white placeholder:text-zinc-600 text-sm"
              placeholder="https://github.com/vercel/next.js"
            />
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition">
            Analyze Free
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2 items-center">
          <div className="flex gap-1">
            <span className="w-4 h-1 bg-cyan-400 rounded-full" />
            <span className="w-4 h-1 bg-cyan-400 rounded-full" />
            <span className="w-4 h-1 bg-cyan-400 rounded-full" />
            <span className="w-4 h-1 bg-zinc-800 rounded-full" />
            <span className="w-4 h-1 bg-zinc-800 rounded-full" />
          </div>

          <p className="text-[11px] text-zinc-500 uppercase tracking-widest">
            3 free analyses remaining
          </p>
        </div>
      </motion.div>

      {/* EXAMPLE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full max-w-3xl z-10">
        {examples.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-white">
                  {item.logo}
                </div>

                <div>
                  <h3 className="text-white text-sm font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <span className="text-zinc-500">{item.icon}</span>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}