interface HealthScoreCardProps {
  score: number;
  level: string;
}

export default function HealthScoreCard({ score, level }: HealthScoreCardProps) {
  return (
    <div className="relative col-span-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:col-span-4">
      
      <div className="absolute right-4 top-4 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
        {level}
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        
        <div className="relative flex h-40 w-40 items-center justify-center">
          
          <svg className="h-full w-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-zinc-800"
            />

            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="440"
              strokeDashoffset={440 - (score / 100) * 440}
              className="text-white"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white">
              {score}
            </span>

            <span className="text-xs text-zinc-500">
              / 100
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Repository Health Score
        </p>
      </div>
    </div>
  );
}