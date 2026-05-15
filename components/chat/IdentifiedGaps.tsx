import { TriangleAlert } from "lucide-react";

export default function IdentifiedGaps() {
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
          
          <li className="flex gap-3">
            <span className="text-orange-500">•</span>

            <p>
              Incomplete API documentation for edge runtime hooks.
            </p>
          </li>

          <li className="flex gap-3">
            <span className="text-orange-500">•</span>

            <p>
              Unused dependencies detected in package.json (3 items).
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}