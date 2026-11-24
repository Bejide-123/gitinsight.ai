"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { ArrowRight, Check, LayoutDashboard, LoaderCircle, Plus } from "lucide-react";
import { startGitHubConnection } from "@/services/github-auth";
import type { DashboardUser } from "@/types/dashboard";

interface DashboardHeroProps {
  user: DashboardUser;
}

export function DashboardHero({ user }: DashboardHeroProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const initials = user.username
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    setConnectError(null);

    try {
      await startGitHubConnection();
    } catch {
      setConnectError("Could not start GitHub connection. Please try again.");
      setIsConnecting(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#07080b]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-base font-semibold text-white sm:h-14 sm:w-14">
            {initials || "GI"}
          </div>
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs text-zinc-400">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Workspace Overview</span>
            </div>
            <h1 className="break-words text-xl font-semibold text-white sm:text-2xl tracking-tight">
              Welcome back, {user.username}
            </h1>
            <p className="mt-0.5 max-w-2xl text-xs text-zinc-400">
              Review repository health, inspect findings, and track progress over commits.
            </p>
            {user.email && <p className="mt-0.5 truncate text-[11px] text-zinc-500">{user.email}</p>}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {user.githubConnected ? (
            <div className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 text-xs text-emerald-300">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>Connected{user.githubUsername ? ` as @${user.githubUsername}` : " to GitHub"}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectGitHub}
              disabled={isConnecting}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] disabled:cursor-wait disabled:opacity-60"
            >
              {isConnecting ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FaGithub className="h-3.5 w-3.5" />
              )}
              {isConnecting ? "Connecting..." : "Connect GitHub"}
            </button>
          )}
          <Link
            href="/history"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            History
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/chat"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Analyze Repository
          </Link>
        </div>
      </div>
      {connectError && (
        <p role="alert" className="mx-auto w-full max-w-[1440px] px-4 pb-4 text-xs text-rose-400 sm:px-6 lg:px-8">
          {connectError}
        </p>
      )}
    </section>
  );
}
