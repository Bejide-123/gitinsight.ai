import {
  Terminal,
} from "lucide-react";

import HealthScoreCard from "./HealthScoreCard";
import PerformanceMetrics from "./PerformanceMetrics";
import IdentifiedGaps from "./IdentifiedGaps";
import PriorityOptimization from "./PriorityOptimization";

export default function AnalysisResults() {
  return (
    <div className="flex flex-col gap-4 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
          <Terminal size={14} className="text-black" />
        </div>

        <h2 className="text-xl font-semibold text-zinc-100">
          Analysis Complete 🎉
        </h2>
      </div>

      {/* GRID */}
      <div className="grid w-full grid-cols-12 gap-4">

        <HealthScoreCard />

        <PerformanceMetrics />

        <IdentifiedGaps />

        <PriorityOptimization />

      </div>
    </div>
  );
}