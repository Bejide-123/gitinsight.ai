"use client";

import { motion } from "framer-motion";
import {
  ShieldAlert,
  Layers,
  MessageSquare,
  GitCompare,
  CheckCircle2,
  XCircle,
  Sparkles,
  GitBranch,
  Terminal,
  Activity,
  ArrowRight,
  Sliders,
  Check,
} from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Architectural & Layering Analysis",
    linter: "Local syntax only",
    genericAi: "Lacks codebase context",
    gitinsight: "Full modular dependency graph & intent-weighted scoring",
  },
  {
    feature: "Vulnerability & Security Auditing",
    linter: "Regex rule matching",
    genericAi: "Hallucinates vulnerabilities",
    gitinsight: "AST-level secrets, injection risks, and auth flaws with remediation",
  },
  {
    feature: "Historical Commit Comparison",
    linter: "None",
    genericAi: "None (stateless)",
    gitinsight: "Tracks new, resolved, persistent & changed findings across SHAs",
  },
  {
    feature: "Interactive Codebase Interrogation",
    linter: "None",
    genericAi: "Generic disconnected advice",
    gitinsight: "Grounded in actual repository code with exact line citations",
  },
  {
    feature: "Production Readiness Verdict",
    linter: "None",
    genericAi: "Vague generalities",
    gitinsight: "Concrete readiness audit (Docker, CI/CD, envs, health checks)",
  },
];

const PILLARS = [
  {
    id: "pillar-audit",
    title: "Multi-Dimensional Codebase Scoring",
    badge: "6 Engineering Dimensions",
    description:
      "Evaluates Security, Architecture, Testing, Maintainability, Readiness, and Completeness with intelligent intent detection that adapts scoring weights to your project type.",
    icon: Layers,
    items: [
      "Dynamic intent detection (Fullstack, API, Library, CLI)",
      "Weighted scoring tailored to architectural purpose",
      "Immediate detection of circular dependencies and dead code",
    ],
  },
  {
    id: "pillar-chat",
    title: "Grounded AI Codebase Interrogation",
    badge: "Repository-Aware Chat",
    description:
      "Ask deep technical questions about flagged risks, refactoring paths, and system design. GitInsight answers using your actual code and analysis findings.",
    icon: MessageSquare,
    items: [
      "Answers backed by line-level code citations",
      "Pre-computed recommended questions based on findings",
      "Explain security risks and specific remediation steps",
    ],
  },
  {
    id: "pillar-diff",
    title: "Commit-to-Commit Comparison Engine",
    badge: "Time-Series Health Tracking",
    description:
      "Verify that PRs actually fix the issues they claim to. Compare any two analysis runs or commits to track new, resolved, persistent, and changed findings.",
    icon: GitCompare,
    items: [
      "Finding lifecycle tracking (New, Resolved, Changed, Persistent)",
      "Score attribution engine detailing category point changes",
      "Fairness engine accounting for scope and intent shifts",
    ],
  },
  {
    id: "pillar-readiness",
    title: "Production Readiness & Blocker Auditing",
    badge: "Pre-Merge Gatekeeping",
    description:
      "Move beyond guessing if your application is ready to deploy. GitInsight validates essential operational infrastructure and surfaces critical blockers.",
    icon: CheckCircle2,
    items: [
      "Checks for Dockerfiles, CI/CD pipelines, and health checks",
      "Validates environment variables and secret isolation",
      "Generates a prioritized, high-ROI engineering roadmap",
    ],
  },
];

export default function IntelligenceSection() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#07080b] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
            <Sliders className="h-3.5 w-3.5 text-zinc-400" />
            Comprehensive Codebase Intelligence
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Built for developers who care about code health.
          </h2>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Linters only catch syntax errors, and generic chat bots lack repository context.
            GitInsight combines static analysis, AST evaluation, and grounded AI to give you the complete picture.
          </p>
        </div>

        {/* Comparison Matrix: GitInsight vs Linters vs Generic LLMs */}
        <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f16]">
          <div className="border-b border-white/[0.08] bg-[#090b10] px-6 py-4">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Beyond Linters & Generic AI Assistants
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Why shallow warnings and disconnected prompts aren&apos;t enough for modern engineering teams.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-400">
                  <th className="py-3 px-6 font-medium">Capability</th>
                  <th className="py-3 px-6 font-medium text-zinc-500">Traditional Linters</th>
                  <th className="py-3 px-6 font-medium text-zinc-500">Generic LLM Prompts</th>
                  <th className="py-3 px-6 font-semibold text-white bg-white/[0.02]">
                    GitInsight AI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.015] transition-colors">
                    <td className="py-3.5 px-6 font-medium text-zinc-200">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-6 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        <span>{row.linter}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        <span>{row.genericAi}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-white font-medium bg-white/[0.02]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{row.gitinsight}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 Core Pillars Bento Grid */}
        <div className="mt-16 sm:mt-24">
          <div className="mb-10 text-center sm:text-left">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              Core Pillars
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Engineered for precision and clarity.
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="rounded-2xl border border-white/10 bg-[#0c0f16] p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-zinc-400">
                        {pillar.badge}
                      </span>
                    </div>

                    <h4 className="mt-5 text-lg font-semibold text-white tracking-tight">
                      {pillar.title}
                    </h4>
                    <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <ul className="mt-6 border-t border-white/[0.06] pt-4 space-y-2">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
