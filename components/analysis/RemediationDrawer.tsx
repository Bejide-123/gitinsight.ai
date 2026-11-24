"use client";

import { useState } from "react";
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Code2,
  ExternalLink,
  ChevronRight,
  Info,
  GitBranch,
} from "lucide-react";
import type { ClassifiedPRFinding, RemediationGuidance } from "@/types/pr";

interface RemediationDrawerProps {
  finding: ClassifiedPRFinding | null;
  onClose: () => void;
}

export function RemediationDrawer({ finding, onClose }: RemediationDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!finding) return null;

  const { issue, remediation, state, changeSummary } = finding;
  const patch = remediation?.suggestedPatch;

  const copyPatchToClipboard = () => {
    if (!patch?.diffHunk) return;
    navigator.clipboard.writeText(patch.diffHunk);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityColor =
    issue.severity === "critical"
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : issue.severity === "high"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : issue.severity === "medium"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      : "bg-blue-500/10 text-blue-400 border-blue-500/20";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl h-full bg-[#090d12] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-white/[0.02]">
          <div className="space-y-1.5 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${severityColor}`}
              >
                {issue.severity}
              </span>
              <span className="text-[11px] font-medium text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                {issue.category}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-zinc-500" />
                {issue.file || "unknown"}:{issue.lineNumber || 1}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              {issue.title}
            </h2>
            <p className="text-xs text-zinc-400">{changeSummary}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-zinc-300 hide-scrollbar">
          {/* Why It Matters */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-medium text-xs tracking-wider uppercase">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Why This Matters</span>
            </div>
            <p className="text-zinc-300 text-xs leading-relaxed">
              {remediation?.whyItMatters || issue.impact}
            </p>
          </div>

          {/* Exploit or Failure Scenario */}
          {remediation?.exploitScenario && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-medium text-xs tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Risk & Failure Scenario</span>
              </div>
              <p className="text-rose-200/90 text-xs leading-relaxed">
                {remediation.exploitScenario}
              </p>
            </div>
          )}

          {/* Concrete Resolution Steps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-medium text-xs tracking-wider uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Actionable Resolution Checklist</span>
            </div>
            <div className="space-y-2">
              {(remediation?.steps || [issue.recommendation]).map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.01]"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-zinc-300 leading-normal">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Diff / Suggested Patch */}
          {patch && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-medium text-xs tracking-wider uppercase">
                  <Code2 className="w-4 h-4 text-zinc-400" />
                  <span>Suggested Code Patch</span>
                </div>
                <button
                  onClick={copyPatchToClipboard}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-zinc-300 bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy Unified Diff</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#06080b] p-4 font-mono text-xs overflow-x-auto space-y-1">
                <div className="text-zinc-500 pb-2 border-b border-white/5 mb-2">
                  --- a/{patch.fileName}
                  <br />
                  +++ b/{patch.fileName}
                </div>
                {patch.diffHunk.split("\n").map((line, idx) => {
                  const isAdd = line.startsWith("+");
                  const isDel = line.startsWith("-");
                  const isHeader = line.startsWith("@@");

                  const lineClass = isAdd
                    ? "text-emerald-400 bg-emerald-500/10 px-1 rounded"
                    : isDel
                    ? "text-rose-400 bg-rose-500/10 px-1 rounded line-through decoration-rose-500/40"
                    : isHeader
                    ? "text-blue-400 font-semibold"
                    : "text-zinc-400";

                  return (
                    <div key={idx} className={lineClass}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trade-offs & Side Effects */}
          {remediation?.tradeoffs && remediation.tradeoffs.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.02] p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-medium text-xs tracking-wider uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Trade-offs & Considerations</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300">
                {remediation.tradeoffs.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Confidence and Rule Details */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
            <span>Rule ID: {remediation?.ruleId || issue.ruleId || "CUSTOM"}</span>
            <span>
              Recommendation Confidence:{" "}
              {Math.round((remediation?.confidence || 0.85) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
