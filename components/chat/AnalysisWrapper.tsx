"use client";

import { useRepositoryAnalysis } from "@/hooks/useAnalyseRepo";
import Loader from "@/components/chat/Loader";
import ChatContent from "@/components/chat/ChatContent";
import AnalysisResult from "@/components/chat/AnalysisResult";

interface AnalysisWrapperProps {
  repoUrl: string;
  chatId: string;
}

export default function AnalysisWrapper({
  repoUrl,
  chatId,
}: AnalysisWrapperProps) {
  const {
    data: analysisData,
    isPending,
    isError,
    error,
  } = useRepositoryAnalysis(repoUrl);

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

  if (analysisData?.data) {
    return (
      <ChatContent
        chatId={analysisData.chatId || chatId}
        isLoading={isPending}
      >
        <AnalysisResult
          analysis={analysisData.data}
          reportId={analysisData.reportId || chatId}
          onRefresh={async () => {
    // Your refresh logic here
    // Update state with new data
    console.log("Refresh triggered for reportId:", analysisData.reportId);
  }}
        />
      </ChatContent>
    );
  }

  return null;
}


