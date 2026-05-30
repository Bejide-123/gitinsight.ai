import { TriangleAlert } from "lucide-react";
import type { Issue } from "@/types/analysis";

interface IdentifiedGapsProps {
  dangerousIssues: Issue[];
  missingImprovements: Issue[];
}

export default function IdentifiedGaps({ dangerousIssues, missingImprovements }: IdentifiedGapsProps) {
  const allGaps = [...dangerousIssues, ...missingImprovements];

  return (
    <div className="relative col-span-12 rounded-3xl border border-orange-500/20 bg-orange-500/5 p-8 md:col-span-6">
      
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-20" />

      <div className="relative">
        
        <div className="mb-4 flex items-center gap-3 text-orange-400">
          <TriangleAlert size={20} />

          <h3 className="text-2xl font-semibold">
            Identified Gaps
          </h3>
        </div>

        <ul className="space-y-4 text-sm text-zinc-300">
          {allGaps.length === 0 ? (
            <li className="flex gap-3">
              <p>No significant gaps identified.</p>
            </li>
          ) : (
            allGaps.map((gap, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-orange-500">•</span>
                <p>{gap.description}</p> {/* Displaying the description of the issue */}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}