"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { ArrowRight, Check, LayoutDashboard, LoaderCircle, Plus } from "lucide-react";
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
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `github_connect_intent=1; path=/; max-age=300; SameSite=Lax${secure}`;

    try {
      await signIn("github", { callbackUrl: "/dashboard?github=connected" });
    } catch {
      document.cookie = `github_connect_intent=; path=/; max-age=0; SameSite=Lax${secure}`;
      setConnectError("Could not start GitHub connection. Please try again.");
      setIsConnecting(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.11),transparent_48%),linear-gradient(115deg,#0b1114,#080a0d_58%,#10100b)]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-9">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-lg font-semibold text-cyan-100 sm:h-16 sm:w-16">
            {initials || "GI"}
          </div>
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs text-cyan-200/80">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Workspace overview</span>
            </div>
            <h1 className="break-words text-2xl font-semibold text-white sm:text-3xl">
              Welcome back, {user.username}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
              Review repository health and pick up where your last analysis left off.
            </p>
            {user.email && <p className="mt-1 truncate text-xs text-zinc-500">{user.email}</p>}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {user.githubConnected ? (
            <div className="inline-flex h-10 items-center gap-2 rounded border border-emerald-300/20 bg-emerald-300/[0.06] px-3.5 text-sm text-emerald-100">
              <Check className="h-4 w-4 text-emerald-300" />
              <span>Connected{user.githubUsername ? ` as @${user.githubUsername}` : " to GitHub"}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectGitHub}
              disabled={isConnecting}
              className="inline-flex h-10 items-center gap-2 rounded border border-white/15 px-3.5 text-sm text-zinc-100 transition hover:border-white/30 hover:bg-white/[0.05] disabled:cursor-wait disabled:opacity-60"
            >
              {isConnecting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <FaGithub className="h-4 w-4" />
              )}
              {isConnecting ? "Connecting..." : "Connect GitHub"}
            </button>
          )}
          <Link
            href="/history"
            className="inline-flex h-10 items-center gap-2 rounded border border-white/10 px-3.5 text-sm text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            View history
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/chat"
            className="inline-flex h-10 items-center gap-2 rounded bg-cyan-300 px-4 text-sm font-semibold text-[#071013] transition hover:bg-cyan-200"
          >
            <Plus className="h-4 w-4" />
            Analyze repository
          </Link>
        </div>
      </div>
      {connectError && (
        <p role="alert" className="mx-auto w-full max-w-[1440px] px-4 pb-4 text-sm text-red-300 sm:px-6 lg:px-8">
          {connectError}
        </p>
      )}
    </section>
  );
}