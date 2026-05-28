import { Layers, ClipboardCheck, CheckCircle2, XCircle, Clock } from "lucide-react";

type CapabilityStatus = "pass" | "missing" | "incomplete";

interface Capability {
  name: string;
  status: CapabilityStatus;
}

interface TechStackAndCapabilitiesProps {
  techStack: string[];
  capabilities: Capability[];
}

const STATUS_CONFIG: Record<
  CapabilityStatus,
  { icon: React.ElementType; iconColor: string; label: string; labelColor: string; bg: string }
> = {
  pass: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    label: "Pass",
    labelColor: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  missing: {
    icon: XCircle,
    iconColor: "text-red-500",
    label: "Missing",
    labelColor: "text-red-400",
    bg: "bg-red-500/10",
  },
  incomplete: {
    icon: Clock,
    iconColor: "text-amber-500",
    label: "Incomplete",
    labelColor: "text-amber-400",
    bg: "bg-amber-500/10",
  },
};

export default function TechStackAndCapabilities({
  techStack,
  capabilities,
}: TechStackAndCapabilitiesProps) {
  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Tech Stack */}
      <div className="col-span-12 lg:col-span-5 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-7 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
        {/* Animated gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-lg md:text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Layers size={18} className="text-white" />
            Tech Stack
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-white/[0.08] border border-white/15 rounded-lg text-xs font-medium text-white hover:bg-white/[0.12] transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Core Capabilities */}
      <div className="col-span-12 lg:col-span-7 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-7 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
        {/* Animated gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-lg md:text-xl font-bold text-white mb-5 flex items-center gap-2">
            <ClipboardCheck size={18} className="text-white" />
            Core Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {capabilities.map((cap) => {
              const config = STATUS_CONFIG[cap.status];
              const Icon = config.icon;
              return (
                <div
                  key={cap.name}
                  className="group flex items-center justify-between gap-3 p-3.5 bg-white/[0.04] border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={config.iconColor} />
                    <span className="text-sm text-white font-medium truncate">{cap.name}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${config.labelColor}`}
                  >
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}