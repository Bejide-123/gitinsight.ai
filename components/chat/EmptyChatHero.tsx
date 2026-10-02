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
  X,
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
  },
  {
    title: "shadcn/ui",
    subtitle: "Beautifully Designed Components",
    description:
      "Map the architectural structure of accessible component primitives and Radix-based patterns with AI-powered insights.",
    icon: <Palette size={14} />,
    logo: <Component size={18} />,
    tags: ["UI/UX", "Accessibility", "Radix"],
  },
];

export default function EmptyChatHero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = () => {
    const value = repoUrl.trim();
    try {
      const url = new URL(value);
      const segments = url.pathname.split("/").filter(Boolean);
      if (
        url.protocol !== "https:" ||
        url.hostname.toLowerCase() !== "github.com" ||
        segments.length < 2
      ) {
        throw new Error("Invalid repository URL");
      }

      setInputError(null);
      const repoUrl = `https://github.com/${segments[0]}/${segments[1].replace(/\.git$/, "")}`;
      const id = crypto.randomUUID();
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(repoUrl)}`);
    } catch {
      setInputError("Enter a valid GitHub repository URL, like https://github.com/owner/repository.");
    }
  };

  return (
    <section className="relative flex min-h-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_55%)] px-4 py-10 sm:px-6">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 max-w-2xl text-center"
      >
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-md border border-cyan-200/15 bg-cyan-200/[0.05]">
          <Sparkles className="h-5 w-5 text-cyan-100" />
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-white sm:text-3xl">
          Start a repository analysis
        </h1>

        <p className="mx-auto mb-6 max-w-xl text-sm leading-6 text-zinc-400">
          Review engineering health, security signals, and maintainability in one report.
        </p>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-300" />
            <span>Security review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-cyan-200" />
            <span>Engineering scores</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-200" />
            <span>AI recommendations</span>
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
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAnalyze();
          }}
          className={`flex items-center gap-2 rounded-md border p-1 transition-colors ${
            isFocused
              ? "border-cyan-200/30 bg-white/[0.05]"
              : "border-white/10 bg-[#0d1115] hover:border-white/20"
          }`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
            <FaGithub size={16} className={`shrink-0 transition-colors ${
              isFocused ? "text-cyan-200" : "text-zinc-500"
            }`} />

            <input
              type="url"
              aria-label="GitHub repository URL"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
                setInputError(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full min-w-0 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-zinc-600"
              placeholder="https://github.com/vercel/next.js"
            />

            {repoUrl && (
              <button 
                type="button"
                onClick={() => setRepoUrl("")}
                aria-label="Clear repository URL"
                className="text-zinc-500 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="flex shrink-0 items-center gap-2 rounded px-4 py-2.5 text-sm font-semibold text-[#071013] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
            disabled={!repoUrl.trim()}
          >
            Analyze
            <ArrowRight size={14} />
          </button>
        </form>
        {inputError && <p role="alert" className="mt-2 text-sm text-rose-300">{inputError}</p>}
      </motion.div>

      {/* EXAMPLE CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="z-10 mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 md:grid-cols-2"
      >
        {examples.map((item) => (
          <motion.button
            type="button"
            key={item.title}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setRepoUrl(`https://github.com/${item.title}`);
              setInputError(null);
            }}
            className="group min-w-0 rounded-md border border-white/[0.08] bg-[#0d1115] p-4 text-left transition hover:border-cyan-200/20 hover:bg-[#10161a]"
          >
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-white/[0.03] text-zinc-200 transition group-hover:border-cyan-200/20">
                    {item.logo}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-white transition-colors group-hover:text-cyan-100">
                      {item.title}
                    </h3>

                    <p className="text-[9px] text-zinc-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span className="text-zinc-500 transition-colors group-hover:text-cyan-100">
                  {item.icon}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-400">
                {item.description}
              </p>

              {/* Tags */}
              {item.tags && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-white/[0.08] bg-white/[0.025] px-2 py-1 text-[10px] text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-cyan-200/80">
                <span>Use example URL</span>
                <ArrowRight size={11} />
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}