"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  GitPullRequest,
  GitBranch,
  ArrowRight,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PullRequestItem } from "@/types/pr";

interface PullRequestSelectorModalProps {
  repoUrl: string;
  repoFullName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function PullRequestSelectorModal({
  repoUrl,
  repoFullName,
  isOpen,
  onClose,
}: PullRequestSelectorModalProps) {
  const router = useRouter();
  const [pulls, setPulls] = useState<PullRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzingPr, setAnalyzingPr] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const [owner, repo] = repoFullName.split("/");
    if (!owner || !repo) return;

    setIsLoading(true);
    setError(null);

    fetch(`/api/github/repos/${owner}/${repo}/pulls?state=open`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load pull requests");
        }
        return res.json();
      })
      .then((data) => {
        setPulls(data.pullRequests || []);
      })
      .catch((err) => {
        setError(err.message || "Could not fetch pull requests");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, repoFullName]);

  if (!isOpen) return null;

  const handleAnalyze = async (prNumber: number) => {
    setAnalyzingPr(prNumber);
    setError(null);

    try {
      const res = await fetch("/api/pr/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          pullNumber: prNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Pull request analysis failed");
      }

      onClose();
      router.push(`/pr/${data.reportId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      setError(message);
      setAnalyzingPr(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#090d12] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Pull Requests
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono">{repoFullName}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
          {error && (
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isLoading ? (
            <div className="p-12 text-center text-zinc-400 space-y-3">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-white" />
              <p className="text-xs">Fetching open pull requests...</p>
            </div>
          ) : pulls.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 space-y-2 border border-white/5 rounded-xl bg-white/[0.01]">
              <GitPullRequest className="w-8 h-8 mx-auto text-zinc-600" />
              <h3 className="text-sm font-medium text-white">No Open Pull Requests</h3>
              <p className="text-xs text-zinc-500">
                This repository does not currently have any active pull requests.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pulls.map((pr) => {
                const isAnalyzing = analyzingPr === pr.number;

                return (
                  <div
                    key={pr.number}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-400">
                          #{pr.number}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                          {pr.baseBranch} <ArrowRight className="inline w-3 h-3" /> {pr.headBranch}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white tracking-tight">
                        {pr.title}
                      </h4>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                        <span>by {pr.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(pr.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleAnalyze(pr.number)}
                        disabled={analyzingPr !== null}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Analyzing PR...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Analyze PR</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
