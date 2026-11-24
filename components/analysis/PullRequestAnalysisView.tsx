"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  GitPullRequest,
  GitCommit,
  GitBranch,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Sparkles,
  FileCode,
  Layers,
} from "lucide-react";
import type { PullRequestAnalysisResult, ClassifiedPRFinding } from "@/types/pr";
import { RemediationDrawer } from "./RemediationDrawer";

interface PullRequestAnalysisViewProps {
  analysis: PullRequestAnalysisResult;
}

type TabType = "introduced" | "resolved" | "worsened" | "persistent" | "improved";

export function PullRequestAnalysisView({ analysis }: PullRequestAnalysisViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("introduced");
  const [selectedFinding, setSelectedFinding] = useState<ClassifiedPRFinding | null>(null);

  const verdictConfig = {
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      cardBorder: "border-emerald-500/20",
    },
    needs_work: {
      label: "Needs Attention",
      icon: AlertTriangle,
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      cardBorder: "border-amber-500/20",
    },
    blocked: {
      label: "Blocked",
      icon: AlertOctagon,
      badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      cardBorder: "border-rose-500/20",
    },
  }[analysis.verdict];

  const VerdictIcon = verdictConfig.icon;

  const tabs: Array<{
    id: TabType;
    label: string;
    count: number;
    badgeStyle: string;
  }> = [
    {
      id: "introduced",
      label: "Newly Introduced",
      count: analysis.counts.introduced,
      badgeStyle:
        analysis.counts.introduced > 0
          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
          : "bg-white/[0.04] text-zinc-400 border-white/5",
    },
    {
      id: "resolved",
      label: "Resolved by PR",
      count: analysis.counts.resolved,
      badgeStyle:
        analysis.counts.resolved > 0
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-white/[0.04] text-zinc-400 border-white/5",
    },
    {
      id: "worsened",
      label: "Worsened",
      count: analysis.counts.worsened,
      badgeStyle:
        analysis.counts.worsened > 0
          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
          : "bg-white/[0.04] text-zinc-400 border-white/5",
    },
    {
      id: "persistent",
      label: "Persistent",
      count: analysis.counts.persistent,
      badgeStyle: "bg-white/[0.04] text-zinc-400 border-white/5",
    },
    {
      id: "improved",
      label: "Improved",
      count: analysis.counts.improved,
      badgeStyle:
        analysis.counts.improved > 0
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-white/[0.04] text-zinc-400 border-white/5",
    },
  ];

  const activeFindings =
    activeTab === "introduced"
      ? analysis.introducedIssues
      : activeTab === "resolved"
      ? analysis.resolvedIssues
      : activeTab === "worsened"
      ? analysis.worsenedIssues
      : activeTab === "persistent"
      ? analysis.persistentIssues
      : analysis.improvedIssues;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-16">
      {/* Verdict Header Banner */}
      <div
        className={`rounded-2xl border ${verdictConfig.cardBorder} bg-[#090d12] p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${verdictConfig.badgeClass}`}
              >
                <VerdictIcon className="w-4 h-4" />
                {verdictConfig.label}
              </span>

              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-zinc-500" />
                PR #{analysis.prNumber} by{" "}
                <span className="text-zinc-200 font-medium">{analysis.prAuthor}</span>
              </span>

              <span className="text-xs text-zinc-500 font-mono">
                {analysis.baseBranch} <ArrowRight className="inline w-3 h-3" /> {analysis.headBranch}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              {analysis.prTitle}
            </h1>

            <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed">
              {analysis.verdictReason}
            </p>

            <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
              <span>
                <strong className="text-white">{analysis.changedFilesCount}</strong> files changed
              </span>
              <span>
                <strong className="text-emerald-400">+{analysis.additions}</strong> additions
              </span>
              <span>
                <strong className="text-rose-400">-{analysis.deletions}</strong> deletions
              </span>
              <span className="font-mono text-zinc-500">
                {analysis.baseSha.slice(0, 7)}...{analysis.headSha.slice(0, 7)}
              </span>
            </div>
          </div>

          {/* Health Score Metric Card */}
          <div className="flex-shrink-0 flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="text-center px-2">
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                PR Health
              </div>
              <div className="text-3xl font-extrabold text-white mt-1">
                {analysis.headScore}
                <span className="text-sm text-zinc-500 font-normal">/100</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/10" />

            <div className="text-center px-2">
              <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Score Delta
              </div>
              <div
                className={`text-xl font-bold mt-1 flex items-center justify-center gap-1 ${
                  analysis.scoreDelta > 0
                    ? "text-emerald-400"
                    : analysis.scoreDelta < 0
                    ? "text-rose-400"
                    : "text-zinc-400"
                }`}
              >
                {analysis.scoreDelta > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : analysis.scoreDelta < 0 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : null}
                {analysis.scoreDelta > 0 ? `+${analysis.scoreDelta}` : analysis.scoreDelta} pts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                activeTab === tab.id
                  ? "bg-zinc-200 text-zinc-900 border-zinc-300"
                  : tab.badgeStyle
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {activeFindings.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-white/5 bg-[#090d12]/50 text-zinc-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No {activeTab} findings</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {activeTab === "introduced"
                ? "Excellent! No new vulnerabilities or quality regressions were introduced in this PR."
                : `There are currently 0 issues in the ${activeTab} category.`}
            </p>
          </div>
        ) : (
          activeFindings.map((finding, idx) => {
            const sevColor =
              finding.issue.severity === "critical"
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : finding.issue.severity === "high"
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : finding.issue.severity === "medium"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20";

            return (
              <div
                key={idx}
                className="group p-5 rounded-xl border border-white/10 bg-[#090d12] hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${sevColor}`}
                    >
                      {finding.issue.severity}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/5">
                      {finding.issue.category}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                      {finding.issue.file || "unknown"}
                      {finding.issue.lineNumber ? `:${finding.issue.lineNumber}` : ""}
                    </span>
                    {finding.introducedInLineRange && (
                      <span className="text-[10px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded">
                        Diff addition
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {finding.issue.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {finding.issue.impact || finding.issue.description}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedFinding(finding)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
                    <span>View Remediation</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Remediation Modal Drawer */}
      <RemediationDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
}
