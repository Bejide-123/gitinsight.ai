import Link from "next/link";
import { ArrowRight, Clock3, Plus } from "lucide-react";

export function QuickActionsCard() {
  return (
    <section className="rounded-lg border border-white/[0.09] bg-[#0d1115] p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-white">Quick actions</h2>
      <p className="mt-1 text-xs text-zinc-500">Continue your repository workflow</p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/chat"
          className="flex min-h-11 items-center justify-between gap-3 rounded border border-cyan-200/20 bg-cyan-200/[0.06] px-3 text-sm text-cyan-50 transition hover:bg-cyan-200/[0.1]"
        >
          <span className="flex items-center gap-2.5">
            <Plus className="h-4 w-4" />
            Analyze a repository
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/history"
          className="flex min-h-11 items-center justify-between gap-3 rounded border border-white/[0.08] px-3 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
        >
          <span className="flex items-center gap-2.5">
            <Clock3 className="h-4 w-4" />
            Browse analysis history
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}