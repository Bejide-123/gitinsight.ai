"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Terminal, GitBranch, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const handleQuickAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = repoUrl.trim();
    if (!trimmed) return;
    try {
      const url = new URL(trimmed);
      const [owner, repository] = url.pathname.split("/").filter(Boolean);
      if (url.protocol === "https:" && url.hostname === "github.com" && owner && repository) {
        const canonicalUrl = `https://github.com/${owner}/${repository.replace(/\.git$/, "")}`;
        const id = crypto.randomUUID();
        router.push(`/chat/${id}?repoUrl=${encodeURIComponent(canonicalUrl)}`);
      }
    } catch {
      // Fallback redirect to top
      router.push("/#home");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#07080b] border-t border-white/[0.08] text-xs text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {/* Quick Launch Box */}
        <div className="rounded-2xl border border-white/10 bg-[#0c0f16] p-6 sm:p-8 mb-16">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                Start In Seconds
              </span>
              <h3 className="mt-2 text-2xl font-semibold text-white tracking-tight">
                Ready to understand your repository?
              </h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed max-w-lg">
                Enter any public GitHub repository to generate an immediate engineering report,
                audit production readiness, and start chatting with your codebase.
              </p>
            </div>

            <form onSubmit={handleQuickAnalyze} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <FaGithub className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#08090e] pl-9 pr-3 py-2.5 font-mono text-xs text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
              >
                Analyze
                <ArrowRight className="h-3 w-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 pb-12 border-b border-white/[0.06]">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white">
                <Terminal className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-white">
                GitInsight
              </span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Codebase intelligence and engineering maturity analysis for GitHub repositories.
            </p>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px] mb-3">
              Capabilities
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/#capabilities" className="hover:text-white transition">
                  6-Dimension Audits
                </Link>
              </li>
              <li>
                <Link href="/#ai-chat" className="hover:text-white transition">
                  Grounded Codebase Chat
                </Link>
              </li>
              <li>
                <Link href="/#comparison" className="hover:text-white transition">
                  Commit Diff Engine
                </Link>
              </li>
              <li>
                <Link href="/#capabilities" className="hover:text-white transition">
                  Production Readiness
                </Link>
              </li>
            </ul>
          </div>

          {/* Workspace */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px] mb-3">
              Workspace
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Status */}
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase text-[11px] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>All Systems Operational</span>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition"
                >
                  GitHub REST & Octokit
                  <ArrowUpRight className="h-3 w-3 text-zinc-500" />
                </a>
              </li>
              <li>
                <span className="text-zinc-500 font-mono text-[11px]">Next.js 16 • Gemini AI</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} GitInsight AI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/#home" className="hover:text-zinc-300 transition">
              Back to Top
            </Link>
            <span>•</span>
            <span className="font-mono text-zinc-600">v2.0-obsidian</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
