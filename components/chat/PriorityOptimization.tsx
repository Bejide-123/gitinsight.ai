import {
  Bolt,
  ChevronRight,
  Shield,
} from "lucide-react";

interface PriorityOptimizationProps {
  nextSteps: string[];
}

export default function PriorityOptimization({ nextSteps }: PriorityOptimizationProps) {
  return (
    <div className="col-span-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:col-span-6">
      
      <h3 className="mb-4 text-2xl font-semibold text-white">
        Priority Optimization
      </h3>

      <div className="space-y-4">
        
        {nextSteps.length === 0 ? (
          <p className="text-sm text-zinc-300">No priority optimizations identified.</p>
        ) : (
          nextSteps.map((step, index) => (
            <button
              key={index}
              className="group flex w-full items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                {/* You might want to add dynamic icons based on the step content if needed */}
                <span className="text-zinc-400 group-hover:text-white">
                  <Bolt size={18} /> {/* Placeholder icon */}
                </span>

                <span className="text-sm text-zinc-300">
                  {step}
                </span>
              </div>

              <ChevronRight
                size={18}
                className="text-zinc-600"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
}