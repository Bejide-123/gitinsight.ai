import type { CategoryScore } from "@/types/analysis";

interface PerformanceMetricsProps {
  categoryScores: Record<string, CategoryScore>;
}

export default function PerformanceMetrics({ categoryScores }: PerformanceMetricsProps) {
  return (
    <div className="col-span-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:col-span-8">
      
      <h3 className="mb-8 text-2xl font-semibold text-white">
        Performance Metrics
      </h3>

      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        
        {Object.entries(categoryScores).map(([category, scoreData]) => (
          <div
            key={category}
            className="space-y-2"
          >
            <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-500">
              <span>{category}</span>
              <span className="text-white">
                {scoreData.score}%
              </span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                style={{ width: `${scoreData.score}%` }}
                className="h-full bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}