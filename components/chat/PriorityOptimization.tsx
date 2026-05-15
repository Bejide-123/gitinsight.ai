import {
  Bolt,
  ChevronRight,
  Shield,
} from "lucide-react";

const items = [
  {
    icon: <Bolt size={18} />,
    label: "Tree-shaking optimization",
  },
  {
    icon: <Shield size={18} />,
    label: "Upgrade middleware pattern",
  },
];

export default function PriorityOptimization() {
  return (
    <div className="col-span-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:col-span-6">
      
      <h3 className="mb-4 text-2xl font-semibold text-white">
        Priority Optimization
      </h3>

      <div className="space-y-4">
        
        {items.map((item) => (
          <button
            key={item.label}
            className="group flex w-full items-center justify-between rounded-xl bg-white/5 p-4 transition hover:bg-white/10"
          >
            <div className="flex items-center gap-4">
              <span className="text-zinc-400 group-hover:text-white">
                {item.icon}
              </span>

              <span className="text-sm text-zinc-300">
                {item.label}
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-zinc-600"
            />
          </button>
        ))}
      </div>
    </div>
  );
}