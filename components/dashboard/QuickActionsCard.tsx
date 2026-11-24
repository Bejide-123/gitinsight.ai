import Link from "next/link";
import { ArrowRight, Clock3, Plus } from "lucide-react";

export function QuickActionsCard() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0c0f16] p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-white tracking-tight">Quick actions</h2>
      <p className="mt-0.5 text-xs text-zinc-500">Continue your repository workflow</p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href="/chat"
          className="flex min-h-10 items-center justify-between gap-3 rounded-lg bg-white px-3 text-xs font-semibold text-black transition hover:bg-zinc-200"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" />
            Analyze a repository
          </span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/history"
          className="flex min-h-10 items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
        >
          <span className="flex items-center gap-2">
            <Clock3 className="h-3.5 w-3.5 text-zinc-400" />
            Browse analysis history
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
        </Link>
      </div>
    </section>
  );
}
