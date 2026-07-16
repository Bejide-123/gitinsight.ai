import { Layers, ClipboardCheck, CheckCircle2, XCircle, Clock, Sparkles, Tag } from "lucide-react";

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
  { icon: React.ElementType; iconColor: string; label: string; labelColor: string; bg: string; border: string }
> = {
  pass: {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    label: "Pass",
    labelColor: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  missing: {
    icon: XCircle,
    iconColor: "text-red-400",
    label: "Missing",
    labelColor: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  incomplete: {
    icon: Clock,
    iconColor: "text-amber-400",
    label: "Incomplete",
    labelColor: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
};

export default function TechStackAndCapabilities({
  techStack,
  capabilities,
}: TechStackAndCapabilitiesProps) {
  const passCount = capabilities.filter(c => c.status === "pass").length;
  const totalCount = capabilities.length;

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Tech Stack */}
      <div className="col-span-12 lg:col-span-5 relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-7 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)]">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Decorative glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
              <Layers size={17} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tech Stack</h3>
              <p className="text-[10px] text-zinc-500 font-medium">{techStack.length} technologies detected</p>
            </div>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="group/tag inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-300"
              >
                <Tag size={12} className="text-zinc-500 group-hover/tag:text-purple-400 transition-colors" />
                {tech}
              </span>
            ))}
          </div>

          {/* Tech count indicator */}
          {techStack.length > 0 && (
            <div className="mt-5 flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="w-1 h-1 rounded-full bg-purple-400" />
              <span>Diverse tech stack detected</span>
            </div>
          )}
        </div>
      </div>

      {/* Core Capabilities */}
      <div className="col-span-12 lg:col-span-7 relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-7 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)]">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Decorative glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          {/* Header with stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
                <ClipboardCheck size={17} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Core Capabilities</h3>
                <p className="text-[10px] text-zinc-500 font-medium">{passCount}/{totalCount} passing</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={11} className="text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">{passCount}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                <XCircle size={11} className="text-red-400" />
                <span className="text-[9px] font-bold text-red-400">{capabilities.filter(c => c.status === "missing").length}</span>
              </div>
            </div>
          </div>

          {/* Capabilities grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {capabilities.map((cap) => {
              const config = STATUS_CONFIG[cap.status];
              const Icon = config.icon;
              return (
                <div
                  key={cap.name}
                  className={`group/cap flex items-center justify-between gap-3 p-3.5 rounded-xl border ${config.border} ${config.bg} hover:bg-white/[0.06] transition-all duration-300 cursor-default`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={15} className={`${config.iconColor} flex-shrink-0`} />
                    <span className="text-sm text-white font-medium truncate">{cap.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-[8px] font-bold uppercase tracking-[0.15em] ${config.labelColor}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status legend */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-emerald-400" />
              <span className="text-[9px] text-zinc-500">Pass</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-amber-400" />
              <span className="text-[9px] text-zinc-500">Incomplete</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle size={11} className="text-red-400" />
              <span className="text-[9px] text-zinc-500">Missing</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[9px] text-zinc-600">
              <Sparkles size={10} className="text-purple-400" />
              <span>AI detected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}