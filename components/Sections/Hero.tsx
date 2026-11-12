"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  FileCode2,
  GitBranch,
  GitCommitHorizontal,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const fileRows = [
  { name: "src/", detail: "application code", color: "text-cyan-200" },
  { name: "tests/", detail: "quality signals", color: "text-violet-200" },
  { name: "package.json", detail: "technology stack", color: "text-amber-200" },
];

const dimensions = ["Security", "Architecture", "Testing", "Readiness"];

function AnalysisIllustration() {
  return (
    <div
      className="relative mx-auto aspect-[1/1.35] min-h-[390px] w-full max-w-[650px] sm:aspect-[760/460] sm:min-h-0"
      aria-label="Illustration of repository code being turned into an engineering report"
    >
      <div className="absolute inset-[8%] rounded-full bg-cyan-400/[0.12] blur-[70px]" />
      <div className="absolute inset-[18%] rounded-full bg-violet-500/[0.12] blur-[80px]" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[5%] rounded-full border border-cyan-100/[0.08]"
        animate={{ rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-[13%] top-[20%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_20px_5px_rgba(103,232,249,0.5)]" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[12%] rounded-full border border-dashed border-violet-200/[0.10]"
        animate={{ rotate: -360 }}
        transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute bottom-[18%] right-[14%] h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_16px_4px_rgba(196,181,253,0.5)]" />
      </motion.div>

      <svg
        aria-hidden="true"
        viewBox="0 0 760 460"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient id="insight-flow" x1="120" y1="0" x2="670" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#67e8f9" stopOpacity=".05" />
            <stop offset=".48" stopColor="#a78bfa" stopOpacity=".8" />
            <stop offset="1" stopColor="#67e8f9" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <path d="M194 225C270 225 282 142 374 142s106 83 191 83" stroke="url(#insight-flow)" strokeWidth="1.5" strokeDasharray="5 8" />
        <path d="M194 238c80 0 92 83 180 83s110-83 191-83" stroke="url(#insight-flow)" strokeWidth="1.5" strokeDasharray="5 8" />
      </svg>

      <motion.div
        initial={{ opacity: 0, x: -18, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="absolute left-1/2 top-[4%] z-10 w-[84%] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#11151c]/90 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:left-0 sm:top-[35%] sm:w-[34%] sm:translate-x-0 sm:p-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-200">
            <FaGithub className="h-3.5 w-3.5 text-zinc-400" />
            your repository
          </div>
          <GitBranch className="h-3.5 w-3.5 text-zinc-500" />
        </div>
        <div className="space-y-3">
          {fileRows.map((row, index) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + index * 0.12 }}
              className="flex items-center gap-2.5"
            >
              <FileCode2 className={`h-3.5 w-3.5 shrink-0 ${row.color}`} />
              <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-zinc-200">{row.name}</span>
              <span className="hidden text-[9px] text-zinc-600 lg:block">{row.detail}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-1.5 border-t border-white/[0.07] pt-3 text-[10px] text-zinc-500">
          <GitCommitHorizontal className="h-3 w-3" />
          Code, structure, and project signals
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.2 }}
        className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-40 sm:w-40"
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-cyan-100/20"
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.12, 0.55] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-300/25 via-violet-400/20 to-fuchsia-400/20 blur-xl" />
        <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/15 bg-[#111621]/90 shadow-[0_0_50px_rgba(34,211,238,0.18)] backdrop-blur sm:h-32 sm:w-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="mb-1"
          >
            <Sparkles className="h-6 w-6 text-cyan-100 sm:h-7 sm:w-7" />
          </motion.div>
          <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-[9px]">GitInsight AI</span>
          <span className="mt-1 text-[8px] text-cyan-100/70">making sense of code</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 18, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.48 }}
        className="absolute left-1/2 top-[69%] z-10 w-[84%] -translate-x-1/2 rounded-2xl border border-cyan-100/15 bg-[#10151d]/95 p-3 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:left-auto sm:right-0 sm:top-[35%] sm:w-[34%] sm:translate-x-0 sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-200">Engineering report</span>
          <span className="rounded-full border border-emerald-200/20 bg-emerald-200/[0.08] px-2 py-0.5 text-[9px] text-emerald-100">ready to explore</span>
        </div>
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-200/[0.10] to-violet-300/[0.08] p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-100/30 text-sm font-semibold text-white">76</div>
          <div>
            <p className="text-[11px] font-medium text-white">Maturity score</p>
            <p className="mt-0.5 text-[9px] text-zinc-400">A starting point, with context</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {dimensions.map((dimension, index) => (
            <motion.span
              key={dimension}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + index * 0.1 }}
              className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-1 text-[9px] text-zinc-300"
            >
              {dimension}
            </motion.span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-white/[0.07] pt-3 text-[10px] text-cyan-100">
          <ArrowUpRight className="h-3 w-3" />
          Findings + prioritized next steps
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] top-[25%] flex h-9 w-9 items-center justify-center rounded-xl border border-fuchsia-200/20 bg-fuchsia-200/[0.07] text-fuchsia-100 shadow-[0_0_28px_rgba(232,121,249,0.15)] sm:right-[13%] sm:top-[13%] sm:h-10 sm:w-10"
      >
        <ShieldCheck className="h-4 w-4" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-[24%] left-[8%] flex h-9 w-9 items-center justify-center rounded-xl border border-amber-100/20 bg-amber-100/[0.07] text-amber-100 shadow-[0_0_28px_rgba(253,230,138,0.12)] sm:bottom-[13%] sm:left-[12%] sm:h-10 sm:w-10"
      >
        <ScanLine className="h-4 w-4" />
      </motion.div>

      <p className="absolute bottom-1 right-2 text-[9px] text-zinc-600 sm:bottom-0 sm:right-6">Illustrative example</p>
    </div>
  );
}

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
      setInputError("Enter a GitHub repository URL, such as https://github.com/owner/repository.");
    }
  };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#080910] px-4 pb-14 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_22%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(ellipse_at_84%_28%,rgba(168,85,247,0.17),transparent_34%),radial-gradient(ellipse_at_66%_90%,rgba(236,72,153,0.09),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_94%)]" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-28 -z-10 h-96 w-96 rounded-full border border-violet-200/[0.08]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-7 lg:grid-cols-[0.88fr_1.12fr] lg:gap-4">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-100/20 bg-cyan-100/[0.06] px-3 py-1.5 text-xs text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.08)]"
          >
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-70"
                animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-200" />
            </span>
            Engineering intelligence for your GitHub repositories
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="max-w-2xl text-[2.75rem] font-semibold leading-[0.99] tracking-[-0.055em] text-white sm:text-6xl lg:text-[4.35rem]"
          >
            Your codebase has a story.
            <span className="mt-3 block bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text pb-2 text-transparent">
              See the whole picture.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base"
          >
            From security signals and testing gaps to production readiness, GitInsight turns a GitHub repository
            into an engineering report your team can understand—and act on.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-8 max-w-xl"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleAnalyze();
              }}
              className={`group flex items-center gap-2 rounded-xl border bg-[#10121b]/90 p-1.5 shadow-2xl shadow-black/30 backdrop-blur transition-all ${
                isFocused
                  ? "border-cyan-100/50 shadow-[0_0_35px_rgba(34,211,238,0.12)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <FaGithub className="ml-3 h-4 w-4 shrink-0 text-zinc-400" />
              <input
                type="url"
                aria-label="GitHub repository URL"
                className="min-w-0 flex-1 bg-transparent px-2 py-3.5 text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Paste a GitHub repository URL"
                value={repoUrl}
                onChange={(event) => {
                  setRepoUrl(event.target.value);
                  setInputError(null);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                type="submit"
                disabled={!repoUrl.trim()}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-200 to-cyan-300 px-4 py-3.5 text-xs font-bold text-[#071013] shadow-lg shadow-cyan-950/30 transition hover:from-cyan-100 hover:to-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-sm"
              >
                Analyze repo
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            {inputError && <p role="alert" className="mt-2 text-sm text-rose-300">{inputError}</p>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-200" />
                Start from a repository URL
              </span>
              <a href="/login" className="inline-flex items-center gap-1 text-zinc-400 transition hover:text-cyan-100">
                Connect GitHub to browse repos
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </motion.div>

          <motion.a
            href="#features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            Follow the journey
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </motion.span>
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, x: 14 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.14 }}
          className="relative"
        >
          <AnalysisIllustration />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="mx-auto mt-8 flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-5 text-[10px] uppercase tracking-[0.15em] text-zinc-500 sm:gap-x-10 sm:text-[11px]"
      >
        {["Security signals", "Engineering maturity", "Actionable recommendations", "Progress over time"].map((item) => (
          <span key={item} className="inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-cyan-200/70" />
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
