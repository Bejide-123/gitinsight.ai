import {
  CheckCircle2,
  XCircle,
  GitMerge,
  Code2,
  TestTube2,
  RefreshCw,
  Shield,
  Terminal,
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
  { label: string; icon: LucideIcon; color: string; bg: string; accentGlow: string }
> = {
  passed: {
    label: "Passed",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    accentGlow: "rgb(34, 197, 94)",
  },
  partial: {
    label: "Partial",
    icon: GitMerge,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    accentGlow: "rgb(245, 158, 11)",
  },
  missing: {
    label: "Missing",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    accentGlow: "rgb(239, 68, 68)",
  },
};

export { Code2, TestTube2, RefreshCw, Shield, Terminal, GitMerge };

export default function QualityChecks({ checks }: QualityChecksProps) {
  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Left: Card style */}
      <div className="col-span-12 lg:col-span-6 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-7 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
        {/* Animated gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-lg md:text-xl font-bold text-white mb-5">Quality Gateways</h3>

          <div className="space-y-3">
            {checks.map((check) => {
              const statusConfig = STATUS_CONFIG[check.status];
              const StatusIcon = statusConfig.icon;
              const CheckIcon = check.icon;

              return (
                <div
                  key={check.name}
                  className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg ${statusConfig.bg} flex items-center justify-center shrink-0 border border-white/10`}>
                      <CheckIcon size={15} className={statusConfig.color} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{check.name}</p>
                      <p className="text-[11px] text-zinc-500 truncate">{check.detail}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.color} px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Table style */}
      <div className="col-span-12 lg:col-span-6 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent backdrop-blur-md transition-all duration-500 hover:border-white/20">
        {/* Animated gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          <div className="p-6 md:p-7 border-b border-white/10">
            <h3 className="text-lg md:text-xl font-bold text-white">Engineering Checks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/[0.04] border-b border-white/10">
                <tr>
                  <th className="px-5 py-3 font-bold text-[10px] text-zinc-500 uppercase tracking-wider">Check</th>
                  <th className="px-5 py-3 font-bold text-[10px] text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 font-bold text-[10px] text-zinc-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {checks.map((check) => {
                  const statusConfig = STATUS_CONFIG[check.status];
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={check.name} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium text-white">{check.name}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`flex items-center gap-1.5 ${statusConfig.color} text-xs font-bold`}>
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-500">{check.detail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}