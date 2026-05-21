"use client";

import { useRepositoryAnalysis } from "@/hooks/useAnalyseRepo";

import MessageBubble from "@/components/chat/MessageBubble";
import AnalysisResults from "@/components/chat/AnalysisResult";

interface ChatContentProps {
  repoUrl: string;
}

export default function ChatContent({
  repoUrl,
}: ChatContentProps) {

  const { data, isPending } = useRepositoryAnalysis();

  // Example trigger later
  // useEffect(() => {
  //   mutate({ repoUrl });
  // }, []);

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <MessageBubble
        message={`Analyze ${repoUrl}`}
      />

      {data && (
        <AnalysisResults analysis={data.data} />
      )}
    </>
  );
}