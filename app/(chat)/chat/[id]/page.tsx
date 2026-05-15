import MessageBubble from "@/components/chat/MessageBubble";
import AnalysisResults from "@/components/chat/AnalysisResult";
import BottomInput from "@/components/chat/BottomInput";

type ChatPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChatPage({
  params,
}: ChatPageProps) {

  const { id } = await params;

  return (
    <section className="relative flex h-full flex-col overflow-hidden">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-8 py-8 pb-48">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">

          <p className="text-sm text-zinc-500 hidden">
            Chat ID: {id}
          </p>

          <MessageBubble
            message="Analyze vercel/next.js"
          />

          <AnalysisResults />

        </div>
      </div>

      {/* INPUT */}
      <BottomInput />
    </section>
  );
}