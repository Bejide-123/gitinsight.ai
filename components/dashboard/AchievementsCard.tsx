import { BadgeCheck, GitBranch, ShieldCheck } from "lucide-react";

interface AchievementsCardProps {
  totalAnalyses: number;
  averageScore: number | null;
  trackedRepositories: number;
}

export function AchievementsCard({
  totalAnalyses,
  averageScore,
  trackedRepositories,
}: AchievementsCardProps) {
  const milestones = [
    {
      title: "First repository review",
      detail: `${Math.min(totalAnalyses, 1)} of 1 analysis`,
      progress: Math.min(totalAnalyses, 1) * 100,
      complete: totalAnalyses >= 1,
      icon: BadgeCheck,
      color: "text-emerald-300",
    },
    {
      title: "Review five analyses",
      detail: `${Math.min(totalAnalyses, 5)} of 5 analyses`,
      progress: Math.min(totalAnalyses / 5, 1) * 100,
      complete: totalAnalyses >= 5,
      icon: GitBranch,
      color: "text-cyan-200",
    },
    {
      title: "Reach an 80 average",
      detail: averageScore === null ? "Needs analysis data" : `${averageScore.toFixed(1)} average score`,
      progress: averageScore === null ? 0 : Math.min(averageScore / 80, 1) * 100,
      complete: averageScore !== null && averageScore >= 80,
      icon: ShieldCheck,
      color: "text-amber-200",
    },
  ];

  return (
    <section className="rounded-lg border border-white/[0.09] bg-[#0d1115] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Milestones</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Progress from your saved analyses
          </p>
        </div>
        <span className="rounded border border-white/10 px-2 py-1 text-[10px] text-zinc-400">
          {trackedRepositories} repos
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {milestones.map(({ title, detail, progress, complete, icon: Icon, color }) => (
          <div key={title}>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/[0.08] bg-white/[0.03]">
                <Icon className={`h-4 w-4 ${complete ? color : "text-zinc-500"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-200">{title}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">{detail}</p>
              </div>
              {complete && <span className="text-[10px] text-emerald-300">Complete</span>}
            </div>
            <div className="ml-11 mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className={`h-full rounded-full transition-[width] ${complete ? "bg-emerald-300" : "bg-cyan-300/70"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}