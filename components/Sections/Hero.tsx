"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnalyze = () => {
    try {
      const url = new URL(repoUrl.trim());
      const [owner, repository] = url.pathname.split("/").filter(Boolean);
      if (url.protocol !== "https:" || url.hostname !== "github.com" || !owner || !repository) {
        throw new Error("Invalid GitHub repository URL");
      }

      setInputError(null);
      const canonicalUrl = `https://github.com/${owner}/${repository.replace(/\.git$/, "")}`;
      const id = crypto.randomUUID();
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(canonicalUrl)}`);
    } catch {
      setInputError("Enter a valid GitHub repository URL, such as https://github.com/owner/repository.");
    }
  };

  return (
    <section id="home" className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-b border-white/[0.08] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_55%)] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* CONTENT */}
      <div className="relative mx-auto w-full max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 inline-flex items-center gap-2 rounded border border-cyan-200/15 bg-cyan-200/[0.04] px-3 py-2 text-xs text-cyan-100"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          <span>
            Repository intelligence for software teams
          </span>
          <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl font-semibold leading-[1.08] text-white sm:text-5xl md:text-6xl"
        >
          GitHub repository analysis,{
          " "}<span className="text-cyan-200">
            made actionable
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base"
        >
          Review repository maturity, security findings, maintainability, and prioritized improvements from one analysis.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-8 w-full max-w-2xl"
        >
          <form onSubmit={(event) => { event.preventDefault(); handleAnalyze(); }} className={`flex items-center gap-2 rounded-md border bg-[#0d1115] p-1.5 transition-colors ${
            isFocused ? "border-cyan-200/30" : "border-white/10 hover:border-white/20"
          }`}>
            <FaGithub className="ml-3 h-4 w-4 shrink-0 text-zinc-500" />
            <input
              type="url"
              aria-label="GitHub repository URL"
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              placeholder="https://github.com/owner/repository"
              value={repoUrl}
              onChange={(e) => { setRepoUrl(e.target.value); setInputError(null); }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button
              type="submit"
              disabled={!repoUrl.trim()}
              className="flex shrink-0 items-center gap-2 rounded bg-cyan-300 px-4 py-3 text-sm font-semibold text-[#071013] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
            >
              Analyze
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          {inputError && <p role="alert" className="mt-2 text-left text-sm text-rose-300">{inputError}</p>}
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
          >
            <span className="flex items-center gap-2 text-zinc-500">
              <Shield className="h-3.5 w-3.5 text-emerald-300" />
              <span>Security findings</span>
            </span>
            <span className="flex items-center gap-2 text-zinc-500">
              <Rocket className="h-3.5 w-3.5 text-cyan-200" />
              <span>Repository maturity</span>
            </span>
            <span className="flex items-center gap-2 text-zinc-500">
              <Zap className="h-3.5 w-3.5 text-amber-200" />
              <span>AI recommendations</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom decorative line */}
      </div>
    </section>
  );
}