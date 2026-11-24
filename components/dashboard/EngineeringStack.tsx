interface EngineeringStackProps {
  technologies: string[];
}

export function EngineeringStack({ technologies }: EngineeringStackProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0c0f16] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">Detected technologies</h2>
          <p className="mt-0.5 text-xs text-zinc-500">From your repository reports</p>
        </div>
        <span className="shrink-0 text-xs font-mono text-zinc-400">
          {technologies.length}
        </span>
      </div>

      {technologies.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {technologies.map((technology) => (
            <li
              key={technology}
              className="max-w-full truncate rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300 font-mono"
            >
              {technology}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-white/10 px-3 py-4 text-xs leading-5 text-zinc-500">
          Technology signals will appear here after your first repository analysis.
        </p>
      )}
    </section>
  );
}
