"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileCode2,
  GitBranch,
  GitCommit,
  Layers,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Terminal,
  Activity,
  Check,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

type HeroTab = "scorecard" | "findings" | "chat" | "diff";

const SAMPLE_REPOS = [
  { name: "shadcn/ui", url: "https://github.com/shadcn-ui/ui" },
  { name: "expressjs/express", url: "https://github.com/expressjs/express" },
  { name: "facebook/react", url: "https://github.com/facebook/react" },
];

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<HeroTab>("scorecard");
  const router = useRouter();

  const handleAnalyze = (targetUrl?: string) => {
    const urlToTest = (targetUrl || repoUrl).trim();
    try {
      const url = new URL(urlToTest);
      const [owner, repository] = url.pathname.split("/").filter(Boolean);
      if (url.protocol !== "https:" || url.hostname !== "github.com" || !owner || !repository) {
        throw new Error("Invalid GitHub repository URL");
      }

      setInputError(null);
      const canonicalUrl = `https://github.com/${owner}/${repository.replace(/\.git$/, "")}`;
      const id = crypto.randomUUID();
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(canonicalUrl)}`);
    } catch {
      setInputError("Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)");
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setRepoUrl(sampleUrl);
    setInputError(null);
    handleAnalyze(sampleUrl);
  };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-white/[0.08] bg-[#07080b] pt-28 pb-20 sm:pt-32 sm:pb-28"
    >
      {/* Subtle monospace dot grid overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      {/* Ambient neutral glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Header Block */}
        <div className="text-center">
          {/* Release Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs text-zinc-300 backdrop-blur-sm"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-zinc-400">GitInsight 2.0</span>
            <span className="text-zinc-600">•</span>
            <span>Codebase Intelligence & Interrogation</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl sm:leading-[1.08]"
          >
            The Codebase Intelligence Platform for GitHub.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            Audit architecture. Eliminate security risks. Track score trends over commits,
            and interrogate your repository with grounded, line-level AI.
          </motion.p>

          {/* Search/Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mx-auto mt-8 max-w-xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAnalyze();
              }}
              className={`flex items-center gap-2 rounded-xl border bg-[#0d1017]/90 p-1.5 shadow-2xl backdrop-blur-md transition-all ${
                isFocused
                  ? "border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <FaGithub className="ml-3 h-4 w-4 shrink-0 text-zinc-400" />
              <input
                type="url"
                aria-label="GitHub repository URL"
                className="min-w-0 flex-1 bg-transparent px-2 py-2.5 font-mono text-xs text-white outline-none placeholder:text-zinc-500 sm:text-sm"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value);
                  setInputError(null);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                type="submit"
                disabled={!repoUrl.trim()}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black shadow transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Analyze Codebase
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {inputError && (
              <p role="alert" className="mt-2 text-left text-xs text-rose-400">
                {inputError}
              </p>
            )}

            {/* Quick-try Pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
              <span className="text-[11px] text-zinc-400">Try popular repos:</span>
              {SAMPLE_REPOS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleSelectSample(sample.url)}
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  <FaGithub className="h-3 w-3 text-zinc-400" />
                  {sample.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Centerpiece: Interactive Product Showcase Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-14 sm:mt-16"
        >
          {/* Outer Frame */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0c0f16] shadow-2xl overflow-hidden">
            {/* Header / Mac style dots + Tab selector */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] bg-[#090b10] px-4 py-3 gap-2">
              {/* Window Dots & Repo Context */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                </div>
                <span className="h-3.5 w-px bg-white/10" />
                <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                  <FaGithub className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-zinc-200">acme-corp/api-gateway</span>
                  <span className="text-zinc-600">/</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                    <GitBranch className="h-3 w-3" />
                    main
                  </span>
                </div>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("scorecard")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    activeTab === "scorecard"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                  Scorecard
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("findings")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    activeTab === "findings"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                  Code Findings
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    activeTab === "chat"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-zinc-300" />
                  AI Interrogation
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("diff")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    activeTab === "diff"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  Commit Diff
                </button>
              </div>
            </div>

            {/* Tab Content Display */}
            <div className="p-5 sm:p-7 min-h-[360px]">
              <AnimatePresence mode="wait">
                {activeTab === "scorecard" && (
                  <motion.div
                    key="tab-scorecard"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] items-center"
                  >
                    {/* Left: Overall Health & Status */}
                    <div className="rounded-xl border border-white/10 bg-[#090c12] p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                          Maturity Assessment
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Production Ready
                        </span>
                      </div>

                      <div className="mt-5 flex items-baseline gap-3">
                        <span className="font-mono text-5xl font-bold tracking-tight text-white">
                          84
                        </span>
                        <span className="font-mono text-sm text-zinc-500">/ 100</span>
                      </div>

                      <div className="mt-4 border-t border-white/[0.08] pt-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Detected Intent</span>
                          <span className="font-medium text-zinc-200 capitalize">Fullstack API Service</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Intent Confidence</span>
                          <span className="font-mono text-zinc-300">92%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Files Analyzed</span>
                          <span className="font-mono text-zinc-300">48 files</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: 6 Dimension Scores */}
                    <div className="space-y-3.5">
                      {[
                        { label: "Security", score: 92, note: "0 critical vulnerabilities" },
                        { label: "Architecture", score: 78, note: "Layered structure, 1 circular dependency" },
                        { label: "Testing", score: 85, note: "Unit & integration harness detected" },
                        { label: "Maintainability", score: 80, note: "Strict TypeScript & ESLint enabled" },
                        { label: "Readiness", score: 88, note: "Docker container & health endpoints" },
                        { label: "Completeness", score: 90, note: "CI/CD pipelines, README, License" },
                      ].map((dim) => (
                        <div key={dim.label} className="group">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-zinc-300">{dim.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-zinc-500 hidden sm:inline">{dim.note}</span>
                              <span className="font-mono text-zinc-200 font-semibold">{dim.score}</span>
                            </div>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-zinc-200"
                              style={{ width: `${dim.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "findings" && (
                  <motion.div
                    key="tab-findings"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Finding Header */}
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 items-center rounded-md border border-rose-500/20 bg-rose-500/10 px-2 text-[10px] font-bold uppercase text-rose-400">
                            Critical Security Risk
                          </span>
                          <span className="font-mono text-xs text-zinc-300">
                            src/auth/session.ts#L42-L56
                          </span>
                        </div>
                        <span className="font-mono text-xs text-zinc-500">Security Dimension</span>
                      </div>

                      <h3 className="mt-2.5 text-sm font-semibold text-white">
                        Insecure Session Token Parsing Without Signature Verification
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                        Session token cookies are decoded directly into user identities without HMAC signature validation.
                        Allows potential session forgery and unauthorized privilege escalation.
                      </p>
                    </div>

                    {/* Code Diff Preview */}
                    <div className="rounded-xl border border-white/10 bg-[#080a0f] p-4 font-mono text-xs overflow-x-auto">
                      <div className="text-zinc-500 mb-2">// Suggested Remediation Diff</div>
                      <div className="space-y-1">
                        <div className="text-zinc-500">41   const sessionCookie = req.cookies.auth_session;</div>
                        <div className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded -mx-2">
                          - 42   const user = JSON.parse(Buffer.from(sessionCookie, &apos;base64&apos;).toString());
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded -mx-2">
                          + 43   const user = verifyAndDecodeSession(sessionCookie, env.SESSION_SECRET);
                        </div>
                        <div className="text-zinc-500">44   if (!user) throw new UnauthorizedError();</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                      <span>Affected Files: <code className="text-zinc-300">src/auth/session.ts</code>, <code className="text-zinc-300">src/middleware/auth.ts</code></span>
                      <span className="text-emerald-400">Remediation: 1 file change, estimated 15 mins</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "chat" && (
                  <motion.div
                    key="tab-chat"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="max-w-xl rounded-2xl rounded-br-sm border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-zinc-100 leading-relaxed">
                        Why did you flag the authentication implementation in <code className="text-white font-mono">session.ts</code> as a security risk?
                      </div>
                    </div>

                    {/* AI Grounded Answer */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300">
                        <Terminal className="h-3.5 w-3.5" />
                      </div>
                      <div className="max-w-2xl rounded-2xl rounded-bl-sm border border-white/10 bg-[#090c12] p-4 text-xs text-zinc-300 leading-relaxed space-y-3">
                        <p>
                          In <strong className="text-white font-mono">src/auth/session.ts (lines 42–56)</strong>, your handler directly base64-decodes incoming cookie data without checking a cryptographic HMAC signature against your secret key.
                        </p>
                        <p>
                          Anyone can craft a modified base64 payload containing <code className="text-zinc-200 font-mono">&#123;&quot;role&quot;: &quot;admin&quot;&#125;</code> and send it to your API, bypassing identity checks.
                        </p>

                        {/* Citation Badge */}
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                          <FileCode2 className="h-3 w-3 text-zinc-400" />
                          <span>Grounded in src/auth/session.ts#L42-L56</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow-up Question Suggestions */}
                    <div className="pt-2 border-t border-white/[0.08]">
                      <span className="text-[11px] text-zinc-500">Recommended follow-up questions:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          "Which files would I need to change to fix this?",
                          "Does this issue affect any other parts of the application?",
                          "What should I prioritise fixing next?",
                        ].map((prompt) => (
                          <span
                            key={prompt}
                            className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-400 hover:border-white/20 hover:text-white cursor-default transition"
                          >
                            {prompt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "diff" && (
                  <motion.div
                    key="tab-diff"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Commit Diff Banner */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#090c12] p-4">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-zinc-300">
                          <GitCommit className="h-3.5 w-3.5 text-zinc-400" />
                          <span>a8f3b21</span>
                          <span className="text-zinc-600">→</span>
                          <span className="text-white font-semibold">e4c90d2</span>
                        </div>
                        <span className="text-xs text-zinc-400">Comparing 2 analysis runs</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400">
                          <TrendingUp className="h-3.5 w-3.5" />
                          +14 pts (68 → 82)
                        </span>
                      </div>
                    </div>

                    {/* Finding Lifecycle Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-center">
                        <span className="font-mono text-xl font-bold text-emerald-400">3</span>
                        <p className="text-[11px] uppercase tracking-wider text-emerald-300/80 mt-0.5">Resolved Issues</p>
                      </div>
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3 text-center">
                        <span className="font-mono text-xl font-bold text-amber-400">1</span>
                        <p className="text-[11px] uppercase tracking-wider text-amber-300/80 mt-0.5">Demoted / Changed</p>
                      </div>
                      <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-3 text-center">
                        <span className="font-mono text-xl font-bold text-rose-400">0</span>
                        <p className="text-[11px] uppercase tracking-wider text-rose-300/80 mt-0.5">New Vulnerabilities</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                        <span className="font-mono text-xl font-bold text-zinc-300">2</span>
                        <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-0.5">Persistent Gaps</p>
                      </div>
                    </div>

                    {/* Score Attribution Breakdown */}
                    <div className="rounded-xl border border-white/10 bg-[#090c12] p-3.5 text-xs">
                      <span className="font-medium text-zinc-300">Primary Score Contributors:</span>
                      <ul className="mt-2 space-y-1.5 text-zinc-400">
                        <li className="flex items-center justify-between">
                          <span>Security Dimension (+8 pts)</span>
                          <span className="text-emerald-400 font-mono">+8.00</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Architecture Dimension (+4 pts)</span>
                          <span className="text-emerald-400 font-mono">+4.00</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Testing Dimension (+2 pts)</span>
                          <span className="text-emerald-400 font-mono">+2.00</span>
                        </li>
                      </ul>
                      <div className="mt-3 border-t border-white/[0.06] pt-2 text-[11px] text-zinc-500">
                        Fairness engine verified: project intent maintained as fullstack. Zero evaluation skew.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Feature summary pills beneath the terminal */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            Full AST & Dependency Analysis
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            Grounded Gemini Codebase Interrogation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            Commit SHA-Pinned Historical Diffs
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            Production Readiness Auditing
          </span>
        </div>
      </div>
    </section>
  );
}
