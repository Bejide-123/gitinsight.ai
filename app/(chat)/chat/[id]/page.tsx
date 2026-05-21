import BottomInput from "@/components/chat/BottomInput";
import ChatContent from "@/components/chat/ChatContent";

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

      <div className="flex-1 overflow-y-auto px-8 py-8 pb-48">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">

          <p className="hidden text-sm text-zinc-500">
            Chat ID: {id}
          </p>

          <ChatContent repoUrl="https://github.com/Bejide-123/healthbridge" />

        </div>
      </div>

      <BottomInput />
    </section>
  );
}