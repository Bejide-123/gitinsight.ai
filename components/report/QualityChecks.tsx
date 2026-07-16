import {
  CheckCircle2,
  XCircle,
  GitMerge,
  Code2,
  TestTube2,
  RefreshCw,
  Shield,
  Terminal,
  Sparkles,
  ListChecks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CheckStatus = "passed" | "partial" | "missing";

interface QualityCheck {
  name: string;
  icon: LucideIcon;
  status: CheckStatus;
  detail: string;
}

interface QualityChecksProps {
  checks: QualityCheck[];
}

const STATUS_CONFIG: Record<
  CheckStatus,
  { label: string; icon: LucideIcon; color: string; bg: string; border: string; dotColor: string; accentGlow: string }
> = {
  passed: {
    label: "Passed",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dotColor: "bg-emerald-400",
    accentGlow: "rgba(52,211,153,0.3)",
  },
  partial: {
    label: "Partial",
    icon: GitMerge,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dotColor: "bg-amber-400",
    accentGlow: "rgba(245,158,11,0.3)",
  },
  missing: {
    label: "Missing",
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dotColor: "bg-red-400",
    accentGlow: "rgba(239,68,68,0.3)",
  },
};

export default function QualityChecks({ checks }: QualityChecksProps) {
  const passedCount = checks.filter(c => c.status === "passed").length;
  const totalCount = checks.length;

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Left: Card style */}
      <div className="col-span-12 lg:col-span-6 relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-7 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)]">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Decorative glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
                <ListChecks size={17} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Quality Gateways</h3>
                <p className="text-[10px] text-zinc-500 font-medium">
                  {passedCount}/{totalCount} checks passed
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 size={11} className="text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">{passedCount}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                <XCircle size={11} className="text-red-400" />
                <span className="text-[9px] font-bold text-red-400">{totalCount - passedCount}</span>
              </div>
            </div>
          </div>

          {/* Checks list */}
          <div className="space-y-2.5">
            {checks.map((check) => {
              const config = STATUS_CONFIG[check.status];
              const StatusIcon = config.icon;
              const CheckIcon = check.icon;

              return (
                <div
                  key={check.name}
                  className="group/check flex items-center justify-between gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center shrink-0 transition-all duration-300 group-hover/check:scale-110`}>
                      <CheckIcon size={15} className={config.color} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white group-hover/check:text-white/90 transition-colors">
                        {check.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">{check.detail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                    <span
                      className={`text-[8px] font-bold uppercase tracking-[0.15em] ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3 text-[9px] text-zinc-500">
            <Sparkles size={11} className="text-purple-400" />
            <span>Quality checks completed</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{checks.length} total checks</span>
          </div>
        </div>
      </div>

      {/* Right: Table style */}
      <div className="col-span-12 lg:col-span-6 relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)]">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Decorative glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 p-6 md:p-7 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
              <Terminal size={17} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Engineering Checks</h3>
              <p className="text-[10px] text-zinc-500 font-medium">Detailed view</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-5 py-3.5 font-bold text-[9px] text-zinc-500 uppercase tracking-[0.15em]">Check</th>
                  <th className="px-5 py-3.5 font-bold text-[9px] text-zinc-500 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-5 py-3.5 font-bold text-[9px] text-zinc-500 uppercase tracking-[0.15em]">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {checks.map((check) => {
                  const config = STATUS_CONFIG[check.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={check.name} className="hover:bg-white/[0.02] transition-colors duration-200">
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-white">{check.name}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 ${config.color} text-xs font-bold`}>
                          <StatusIcon size={14} />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-500">{check.detail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
            <span className="text-[9px] text-zinc-500">Showing {checks.length} checks</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-zinc-500">{passedCount} passed</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-[9px] text-zinc-500">{totalCount - passedCount} failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}