"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, Paperclip, Star, GitFork } from "lucide-react";
import { useState } from "react";
import { useAnalyzeRepo, extractRepoMetadata } from "@/hooks/useFetchRepo";

export default function BottomInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: analyzeRepo, isPending, data: repoData } = useAnalyzeRepo();

  const initialRepo = searchParams.get("repoUrl") || "";
  const [repoUrl, setRepoUrl] = useState(initialRepo);

  const extractRepoName = (url: string): string => {
    try {
      // Handle GitHub URLs: https://github.com/user/repo
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        return `${match[1]}/${match[2]}`;
      }
      // Fallback: return the URL as-is
      return url;
    } catch {
      return url;
    }
  };

  const metadata = extractRepoMetadata(repoData);
  console.log(metadata)

  const handleFetchMetadata = () => {
    if (!repoUrl.trim()) return;
    analyzeRepo({ repoUrl });
  };

  const goToReport = () => {
    if (!repoUrl.trim()) return;

    const id = crypto.randomUUID();
    const repoName = extractRepoName(repoUrl);
    const params = new URLSearchParams();
    params.set('repoUrl', repoUrl);
    params.set('repoName', repoName);
    if (metadata?.stars) params.set('stars', String(metadata.stars));
    if (metadata?.forks) params.set('forks', String(metadata.forks));
    if (metadata?.language && metadata.language !== 'Unknown') params.set('language', metadata.language);
    

    router.push(`/chat/ReportPage/${id}?${params.toString()}`);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-50">
      {/* Gradient backdrop */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pointer-events-none" />

      <div className="relative px-8 pb-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={goToReport}
              className="rounded-xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-zinc-200"
            >
              Full Report
            </button>

            <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-zinc-700 hover:bg-zinc-800">
              Deep Dive Security
            </button>

            <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-zinc-700 hover:bg-zinc-800">
              View Raw Data
            </button>
          </div>

          {/* Repo Metadata Display */}
          {metadata && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{metadata.name}</h3>
                  {metadata.language !== "Unknown" && (
                    <span className="inline-block px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-300">
                      {metadata.language}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-1">
                  <Star size={14} />
                  <span>{metadata.stars.toLocaleString()} stars</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork size={14} />
                  <span>{metadata.forks.toLocaleString()} forks</span>
                </div>
              </div>
              {metadata.description && (
                <p className="text-xs text-zinc-400 line-clamp-2">{metadata.description}</p>
              )}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            <button 
              onClick={handleFetchMetadata}
              disabled={isPending}
              className="flex h-11 w-11 items-center justify-center text-zinc-500 transition-colors hover:text-white disabled:opacity-50"
            >
              <Paperclip size={20} strokeWidth={2} />
            </button>

            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onBlur={handleFetchMetadata}
              placeholder="Paste GitHub URL to fetch repo metadata..."
              className="flex-1 bg-transparent text-base text-white outline-none placeholder:text-zinc-600"
            />

            <button
              onClick={goToReport}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black transition-all hover:bg-zinc-200"
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}