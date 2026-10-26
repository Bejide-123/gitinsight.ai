"use client";

import { useState, useCallback, useEffect } from "react";
import { getAuthToken } from "@/services/auth-service";
import type { ChatMessage } from "@/types/chat";

interface UseChatProps {
  chatId?: string;
  initialMessages?: ChatMessage[];
  initialSuggestedQuestions?: string[];
}

export function useChat({
  chatId,
  initialMessages = [],
  initialSuggestedQuestions = [],
}: UseChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(initialSuggestedQuestions);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial messages when they change
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (initialSuggestedQuestions && initialSuggestedQuestions.length > 0) {
      setSuggestedQuestions(initialSuggestedQuestions);
    }
  }, [initialSuggestedQuestions]);

  // Fetch latest chat messages and suggestions if chatId is provided and messages are empty
  useEffect(() => {
    if (!chatId) return;

    let isMounted = true;
    async function loadChat() {
      try {
        const token = getAuthToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          headers["x-auth-token"] = token;
        }

        const res = await fetch(`/api/chat/${chatId}`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!res.ok) return;

        const result = await res.json();
        if (result.success && isMounted) {
          if (result.data?.messages && result.data.messages.length > 0) {
            setMessages(result.data.messages);
          }
          if (result.suggestedQuestions && result.suggestedQuestions.length > 0) {
            setSuggestedQuestions(result.suggestedQuestions);
          }
        }
      } catch (err) {
        console.warn("[USE CHAT] Failed to load initial chat history:", err);
      }
    }

    if (messages.length === 0 || suggestedQuestions.length === 0) {
      loadChat();
    }

    return () => {
      isMounted = false;
    };
  }, [chatId]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      const text = messageText.trim();
      if (!text || isSending) return;

      const targetChatId = chatId;
      if (!targetChatId) {
        setError("No active chat session found.");
        return;
      }

      setError(null);
      setIsSending(true);

      // Optimistically append user message
      const optimisticUserMsg: ChatMessage = {
        role: "user",
        content: text,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, optimisticUserMsg]);

      try {
        const token = getAuthToken();
        const csrfToken = typeof window !== "undefined" ? localStorage.getItem("csrfToken") : null;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
          headers["x-auth-token"] = token;
        }
        if (csrfToken) {
          headers["x-csrf-token"] = csrfToken;
        }

        const res = await fetch(`/api/chat/${targetChatId}`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({ message: text }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to send message");
        }

        const assistantMsg = data.data.assistantMessage;
        const newSuggestions = data.data.suggestedFollowUps;

        setMessages((prev) => [...prev, assistantMsg]);

        if (Array.isArray(newSuggestions) && newSuggestions.length > 0) {
          setSuggestedQuestions(newSuggestions);
        }
      } catch (err: unknown) {
        console.error("[USE CHAT] Error sending chat message:", err);
        const errMsg = err instanceof Error ? err.message : "Failed to generate answer. Please try again.";
        setError(errMsg);

        // Append assistant error message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ ${errMsg}`,
            createdAt: new Date(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [chatId, isSending]
  );

  return {
    messages,
    suggestedQuestions,
    isSending,
    error,
    sendMessage,
    setMessages,
  };
}
