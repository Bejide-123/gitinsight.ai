interface EngineeringStackProps {
  technologies: string[];
}

export function EngineeringStack({ technologies }: EngineeringStackProps) {
  return (
    <section className="rounded-lg border border-white/[0.09] bg-[#0d1115] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Detected technologies</h2>
          <p className="mt-1 text-xs text-zinc-500">From your repository reports</p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-zinc-500">
          {technologies.length}
        </span>
      </div>

      {technologies.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {technologies.map((technology, index) => {
            const accents = [
              "border-cyan-200/15 bg-cyan-200/[0.06] text-cyan-100",
              "border-amber-200/15 bg-amber-200/[0.06] text-amber-100",
              "border-emerald-200/15 bg-emerald-200/[0.06] text-emerald-100",
              "border-rose-200/15 bg-rose-200/[0.06] text-rose-100",
            ];
            return (
              <li
                key={technology}
                className={`max-w-full truncate rounded border px-2.5 py-1.5 text-xs ${accents[index % accents.length]}`}
              >
                {technology}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded border border-dashed border-white/10 px-3 py-4 text-xs leading-5 text-zinc-500">
          Technology signals will appear here after your first repository analysis.
        </p>
      )}
    </section>
  );
}