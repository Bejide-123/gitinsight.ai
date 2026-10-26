"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, GitFork, Star, Sparkles, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAnalyzeRepo, extractRepoMetadata } from "@/hooks/useFetchRepo";

interface BottomInputProps {
  chatId?: string;
  suggestedQuestions?: string[];
  onSendMessage?: (message: string) => Promise<void> | void;
  isSending?: boolean;
}

export default function BottomInput({
  chatId,
  suggestedQuestions = [],
  onSendMessage,
  isSending = false,
}: BottomInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: analyzeRepo, isPending, data: repoData } = useAnalyzeRepo();

  const initialRepo = searchParams.get("repoUrl") || "";
  const [repoUrl, setRepoUrl] = useState(initialRepo);
  const [chatMessage, setChatMessage] = useState("");

  const isChatMode = Boolean(onSendMessage || chatId);

  const extractRepoName = (url: string): string => {
    try {
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        return `${match[1]}/${match[2]}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const metadata = extractRepoMetadata(repoData);

  const handleFetchMetadata = () => {
    if (!repoUrl.trim()) return;
    analyzeRepo({ repoUrl });
  };

  const chatWithAI = () => {
    if (!repoUrl.trim()) return;
    analyzeRepo({ repoUrl });
  };

  const goToReport = () => {
    if (!repoUrl.trim()) return;

    const id = crypto.randomUUID();
    const repoName = extractRepoName(repoUrl);
    const params = new URLSearchParams();
    params.set("repoUrl", repoUrl);
    params.set("repoName", repoName);
    if (metadata?.stars != null) params.set("stars", String(metadata.stars));
    if (metadata?.forks != null) params.set("forks", String(metadata.forks));
    if (metadata?.language && metadata.language !== "Unknown") params.set("language", metadata.language);

    router.push(`/chat/ReportPage/${id}?${params.toString()}`);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatMessage.trim();
    if (!trimmed || isSending) return;

    if (onSendMessage) {
      onSendMessage(trimmed);
      setChatMessage("");
    }
  };

  const handleQuestionPillClick = (question: string) => {
    if (isSending) return;
    if (onSendMessage) {
      onSendMessage(question);
    } else {
      setChatMessage(question);
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-[#090c0f]/95 px-4 py-3.5 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-2.5">
        {/* Recommended Questions Section (Chat Mode) */}
        {isChatMode && suggestedQuestions.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-cyan-200/80">
              <Sparkles className="h-3 w-3 text-cyan-300" />
              <span>Recommended follow-ups:</span>
            </div>
            <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isSending}
                  onClick={() => handleQuestionPillClick(question)}
                  className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-200/20 bg-cyan-950/30 px-3 py-1.5 text-xs text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-900/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="truncate max-w-[min(26rem,70vw)]">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metadata Preview if analyzing a URL */}
        {!isChatMode && metadata && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-white/[0.08] bg-[#0d1115] px-3 py-2.5 text-xs text-zinc-400">
            <span className="font-medium text-zinc-100">{metadata.name}</span>
            {metadata.language !== "Unknown" && <span>{metadata.language}</span>}
            <span className="inline-flex items-center gap-1">
              <Star size={13} />
              {metadata.stars.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork size={13} />
              {metadata.forks.toLocaleString()}
            </span>
            {metadata.description && <span className="min-w-0 flex-1 truncate">{metadata.description}</span>}
          </div>
        )}

        {/* Input Form */}
        {isChatMode ? (
          <form
            onSubmit={handleChatSubmit}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0d1115] p-1.5 shadow-sm focus-within:border-cyan-200/40"
          >
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={isSending}
              placeholder="Ask a question about this repository's code or findings..."
              aria-label="Repository chat question"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!chatMessage.trim() || isSending}
              className="inline-flex h-9 items-center gap-2 rounded bg-cyan-300 px-4 text-xs font-semibold text-[#071013] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              goToReport();
            }}
            className="flex items-center gap-3 rounded-md border border-white/10 bg-[#0d1115] p-1.5 focus-within:border-cyan-200/30"
          >
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onBlur={handleFetchMetadata}
              placeholder="Paste a GitHub repository URL"
              aria-label="GitHub repository URL"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={chatWithAI}
              disabled={!repoUrl.trim() || isPending}
              className="hidden h-9 items-center gap-2 rounded border border-white/10 px-3 text-xs text-zinc-300 transition hover:bg-white/[0.04] disabled:opacity-40 sm:inline-flex"
            >
              {isPending ? "Checking..." : "Chat with AI"}
            </button>
            <button
              type="submit"
              disabled={!repoUrl.trim() || isPending}
              className="inline-flex h-9 items-center gap-2 rounded bg-cyan-300 px-3.5 text-xs font-semibold text-[#071013] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Full report
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
