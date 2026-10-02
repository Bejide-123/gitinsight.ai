export function RepoSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between gap-4 rounded-lg border border-white/[0.08] bg-[#0d1115] p-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="h-10 w-10 shrink-0 rounded bg-zinc-800" />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="h-3.5 w-40 max-w-full rounded bg-zinc-800" />
          <div className="h-3 w-28 rounded bg-zinc-800" />
        </div>
      </div>
      <div className="h-9 w-24 shrink-0 rounded bg-zinc-800" />
    </div>
  );
}