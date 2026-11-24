"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GitCommit,
  GitBranch,
  TrendingUp,
  MessageSquare,
  FileCode,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Layers,
  Sparkles,
  Scale,
} from "lucide-react";

const CHAT_SCENARIOS = [
  {
    question: "Why did you flag our authentication implementation as a security risk?",
    answer:
      "In src/auth/jwt.ts (lines 28–34), your verifyToken function uses jwt.decode() instead of jwt.verify() with the secret key. This accepts tampered or unverified tokens without raising an exception, allowing privilege escalation.",
    citation: "src/auth/jwt.ts#L28-L34",
    impact: "Critical • Authentication Bypass",
  },
  {
    question: "Which files would I need to modify to fix the circular dependency?",
    answer:
      "The cycle is between src/models/user.ts and src/services/teamService.ts. Extract the shared UserRole enum and TeamMembership interface into src/types/permissions.ts to break the cycle without affecting runtime behavior.",
    citation: "src/models/user.ts & src/services/teamService.ts",
    impact: "Architecture • Cyclic Import",
  },
  {
    question: "If we fix these 3 security findings, what risks still remain before production?",
    answer:
      "Fixing the 3 vulnerabilities resolves all critical and high severity risks. The remaining gaps are operational: missing Docker health check directives in Dockerfile and no rate-limiting middleware configured on POST /api/auth/login.",
    citation: "Dockerfile & src/server.ts",
    impact: "Readiness • Infrastructure Gap",
  },
];

export default function DashboardShowcase() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const activeScenario = CHAT_SCENARIOS[selectedScenario];

  return (
    <>
      {/* 1. Grounded AI Codebase Interrogation Deep-Dive */}
      <section
        id="ai-chat"
        className="relative overflow-hidden border-b border-white/[0.08] bg-[#07080b] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            {/* Left Column: Context & Explanations */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                Repository-Aware Intelligence
              </span>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Interrogate your codebase with grounded AI.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Developers don&apos;t need generic AI advice. GitInsight connects natural language questions
                directly to your AST, file tree, dependencies, and identified security gaps.
              </p>

              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold text-zinc-300">Select an interactive prompt:</p>
                {CHAT_SCENARIOS.map((scenario, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedScenario(idx)}
                    className={`w-full text-left rounded-xl border p-3 text-xs transition ${
                      selectedScenario === idx
                        ? "border-white/20 bg-white/[0.06] text-white"
                        : "border-white/[0.06] bg-[#0c0f16] text-zinc-400 hover:border-white/10 hover:text-zinc-200"
                    }`}
                  >
                    <p className="font-medium line-clamp-1">&quot;{scenario.question}&quot;</p>
                    <span className="text-[10px] text-zinc-500 mt-1 block font-mono">
                      {scenario.impact}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Realistic Chat Thread */}
            <div className="rounded-2xl border border-white/10 bg-[#0c0f16] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-zinc-300" />
                  <span className="font-mono text-white">Repository AI Session</span>
                </div>
                <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-mono">
                  Grounded • 100% Code-Linked
                </span>
              </div>

              <div className="space-y-4">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-lg rounded-2xl rounded-br-sm border border-white/10 bg-white/[0.05] p-3.5 text-xs text-zinc-100 leading-relaxed">
                    {activeScenario.question}
                  </div>
                </div>

                {/* AI Assistant Message */}
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300">
                    <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
                  </div>
                  <div className="flex-1 rounded-2xl rounded-bl-sm border border-white/10 bg-[#090b10] p-4 text-xs text-zinc-300 leading-relaxed space-y-3">
                    <p>{activeScenario.answer}</p>
                    
                    {/* Citation */}
                    <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-200">
                      <FileCode className="h-3 w-3 text-zinc-400" />
                      <span>{activeScenario.citation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Commit-to-Commit Comparison Engine Deep-Dive */}
      <section
        id="comparison"
        className="relative overflow-hidden border-b border-white/[0.08] bg-[#07080b] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Column: Visual Commit Comparison Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0c0f16] p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-zinc-400" />
                  <span className="font-mono text-xs text-zinc-300">
                    8c4f92d <span className="text-zinc-600">→</span> d3a18b0
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  +15 pts (70 → 85)
                </span>
              </div>

              {/* Lifecycle Grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-center">
                  <span className="font-mono text-xl font-bold text-emerald-400">4</span>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-300/80 mt-0.5">
                    Resolved Findings
                  </p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3 text-center">
                  <span className="font-mono text-xl font-bold text-amber-400">1</span>
                  <p className="text-[10px] uppercase tracking-wider text-amber-300/80 mt-0.5">
                    Severity Demoted
                  </p>
                </div>
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.04] p-3 text-center">
                  <span className="font-mono text-xl font-bold text-rose-400">0</span>
                  <p className="text-[10px] uppercase tracking-wider text-rose-300/80 mt-0.5">
                    New Regressions
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                  <span className="font-mono text-xl font-bold text-zinc-400">1</span>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Persistent
                  </p>
                </div>
              </div>

              {/* Attribution Items */}
              <div className="mt-5 rounded-xl border border-white/10 bg-[#090b10] p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between text-zinc-300 font-medium">
                  <span>Score Movement Attribution</span>
                  <span className="font-mono text-emerald-400">+15.0 pts</span>
                </div>
                <div className="space-y-1.5 text-zinc-400">
                  <div className="flex justify-between items-center">
                    <span>Security: Patched SQL injection in users repository</span>
                    <span className="font-mono text-emerald-400">+8.5 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Architecture: Extracted shared domain interfaces</span>
                    <span className="font-mono text-emerald-400">+4.0 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Testing: Added integration tests for auth routes</span>
                    <span className="font-mono text-emerald-400">+2.5 pts</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <Scale className="h-3 w-3 text-zinc-400" />
                  <span>Fairness Engine: Normalized delta holds intent weights constant</span>
                </div>
              </div>
            </div>

            {/* Right Column: Context & Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                <GitCommit className="h-3.5 w-3.5 text-zinc-400" />
                Time-Series Evolution
              </span>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                See exactly what changed between commits.
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Codebases evolve with every pull request. GitInsight stores commit SHAs and timestamps
                for every analysis run, so you can measure whether code health is improving or degrading over time.
              </p>

              <ul className="mt-6 space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Fingerprinted findings tracked as New, Resolved, Changed, or Persistent</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Mathematical point attribution explains which category caused the score change</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Fairness engine prevents false drops when repository intent or scope changes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
