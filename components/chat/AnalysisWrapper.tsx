"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/chat/Loader";
import ChatContent from "@/components/chat/ChatContent";
import AnalysisResult from "@/components/chat/AnalysisResult";
import type { Analysis } from "@/types/analysis";

interface AnalysisWrapperProps {
  repoUrl: string;
  chatId: string;
}

export default function AnalysisWrapper({ repoUrl, chatId }: AnalysisWrapperProps) {
  const {
    mutate,
    isPending,
    isError,
    data: analysisData,
    error,
  } = useMutation<Analysis, Error, string>({
    mutationFn: async (url: string) => {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze repository");
      }

      const result = await response.json();
      return result.data; // Extract the actual analysis data
    },
  });

  useEffect(() => {
    if (repoUrl) {
      mutate(repoUrl);
    }
  }, [repoUrl, mutate]);

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return (
      <ChatContent chatId={chatId} isLoading={isPending}>
        <div className="flex items-center justify-center h-full text-red-500">
          Error: {error?.message || "Failed to analyze repository."}
        </div>
      </ChatContent>
    );
  }

  if (analysisData) {
    return (
      <ChatContent chatId={chatId} isLoading={isPending}>
        <AnalysisResult analysis={analysisData} />
      </ChatContent>
    );
  }

  return null;
}

