"use client";

import { Bot, UserRound, FileCode, ShieldAlert, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { ChatSource } from "@/types/chat";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  createdAt?: Date | string;
};

// Formatted Code Block with Copy Button
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 overflow-hidden rounded-md border border-white/10 bg-[#07090c]">
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[11px] text-zinc-400">
        <span className="font-mono">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Inline Markdown Parser for bold, inline code, and links
function renderFormattedText(text: string) {
  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-cyan-200"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Handle bold: **text**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIndex) => {
      if (bPart.startsWith("**") && bPart.endsWith("**") && bPart.length > 4) {
        return (
          <strong key={`${index}-${bIndex}`} className="font-semibold text-white">
            {bPart.slice(2, -2)}
          </strong>
        );
      }
      return <span key={`${index}-${bIndex}`}>{bPart}</span>;
    });
  });
}

// Block Markdown Renderer
function MarkdownContent({ content }: { content: string }) {
  // Split into code block chunks: ```lang ... ```
  const chunks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-sm leading-6">
      {chunks.map((chunk, idx) => {
        if (chunk.startsWith("```") && chunk.endsWith("```")) {
          const firstLineEnd = chunk.indexOf("\n");
          const language = chunk.slice(3, firstLineEnd).trim();
          const code = chunk.slice(firstLineEnd + 1, -3);
          return <CodeBlock key={idx} code={code} language={language} />;
        }

        // Split regular text into paragraphs or bullet items
        const lines = chunk.split("\n");
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lineIdx} className="mt-3 text-sm font-semibold text-white">
                    {renderFormattedText(trimmed.slice(4))}
                  </h4>
                );
              }

              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lineIdx} className="mt-3 text-base font-semibold text-cyan-200">
                    {renderFormattedText(trimmed.slice(3))}
                  </h3>
                );
              }

              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-300" />
                    <span>{renderFormattedText(trimmed.slice(2))}</span>
                  </div>
                );
              }

              if (/^\d+\.\s/.test(trimmed)) {
                const match = trimmed.match(/^(\d+\.)\s(.*)/);
                if (match) {
                  return (
                    <div key={lineIdx} className="flex items-start gap-2 pl-2">
                      <span className="font-mono text-xs font-semibold text-cyan-300">
                        {match[1]}
                      </span>
                      <span>{renderFormattedText(match[2])}</span>
                    </div>
                  );
                }
              }

              return <p key={lineIdx}>{renderFormattedText(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function MessageBubble({
  role,
  content,
  sources = [],
}: MessageBubbleProps) {
  const isAssistant = role === "assistant";
  const Icon = isAssistant ? Bot : UserRound;

  return (
    <div className={`flex items-start gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
      {isAssistant && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cyan-200/15 bg-cyan-200/[0.05] text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[min(48rem,90%)] rounded-lg border px-4 py-3.5 shadow-sm ${
          isAssistant
            ? "border-white/[0.08] bg-[#0d1115] text-zinc-200"
            : "border-cyan-200/15 bg-cyan-200/[0.06] text-cyan-50"
        }`}
      >
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {isAssistant ? "GitInsight AI" : "You"}
        </p>

        {isAssistant ? (
          <MarkdownContent content={content} />
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>
        )}

        {/* Source Citations */}
        {isAssistant && sources && sources.length > 0 && (
          <div className="mt-4 border-t border-white/[0.08] pt-2.5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Referenced Sources & Evidence
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sources.map((src, sIdx) => {
                const isFile = src.type === "file";
                const label = isFile
                  ? `${src.path || "File"}${src.startLine ? `:${src.startLine}` : ""}${
                      src.endLine ? `-${src.endLine}` : ""
                    }`
                  : src.title || src.findingId || "Finding";

                return (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 rounded border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-300"
                  >
                    {isFile ? (
                      <FileCode className="h-3 w-3 text-cyan-300" />
                    ) : (
                      <ShieldAlert className="h-3 w-3 text-amber-300" />
                    )}
                    <span className="font-mono">{label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-[#151a1e] text-zinc-300">
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
