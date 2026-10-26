"use client";

import { useEffect, useRef } from "react";
import BottomInput from "@/components/chat/BottomInput";
import MessageBubble from "./MessageBubble";
import { useChat } from "@/hooks/useChat";
import type { ChatMessage } from "@/types/chat";
import { Bot, AlertCircle } from "lucide-react";

interface ChatContentProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  initialMessages?: ChatMessage[];
  chatId?: string;
  suggestedQuestions?: string[];
}

export default function ChatContent({
  children,
  isLoading,
  initialMessages = [],
  chatId,
  suggestedQuestions: propSuggestedQuestions,
}: ChatContentProps) {
  const {
    messages,
    suggestedQuestions,
    isSending,
    error,
    sendMessage,
  } = useChat({
    chatId,
    initialMessages,
    initialSuggestedQuestions: propSuggestedQuestions,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages or loading changes
  useEffect(() => {
    if (messages.length > 0 || isSending) {
      bottomAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isSending]);

  return (
    <>
      <div
        ref={scrollRef}
        className="hide-scrollbar flex-1 overflow-y-auto bg-[#07090c] px-4 py-6 pb-60 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {/* Top Report or Child Content */}
          {children}

          {/* Conversation Stream */}
          {messages.map((message, index) => (
            <MessageBubble
              key={message._id || index}
              role={message.role}
              content={message.content}
              sources={message.sources}
            />
          ))}

          {/* Assistant Thinking Indicator */}
          {isSending && (
            <div className="flex items-start gap-3 justify-start animate-pulse">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cyan-200/15 bg-cyan-200/[0.05] text-cyan-100">
                <Bot className="h-4 w-4 animate-spin text-cyan-300" />
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-[#0d1115] px-4 py-3 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Examining repository code and analysis findings...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={bottomAnchorRef} />
        </div>
      </div>

      {!isLoading && (
        <BottomInput
          chatId={chatId}
          suggestedQuestions={suggestedQuestions}
          onSendMessage={chatId ? sendMessage : undefined}
          isSending={isSending}
        />
      )}
    </>
  );
}
