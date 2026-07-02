import AnalysisWrapper from "@/components/chat/AnalysisWrapper";
import ChatContent from "@/components/chat/ChatContent";
import NotFoundHero from "@/components/chat/ErrorComponent";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";

type ChatPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ repoUrl?: string }>;
};

async function getChat(id: string) {
  await dbConnect();
  const chat = await Chat.findById(id).populate("report").lean();
  return chat;
}

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const { id } = await params;
  const { repoUrl } = await searchParams;

  if (repoUrl) {
    return (
      <section className="hide-scrollbar relative flex h-full flex-col overflow-hidden">
        <p className="hidden text-sm text-zinc-500">Chat ID: {id}</p>
        <AnalysisWrapper repoUrl={decodeURIComponent(repoUrl)} chatId={id} />
      </section>
    );
  }

  const chat = await getChat(id);

  if (!chat) {
    return <NotFoundHero />;
  }

  return (
    <section className="hide-scrollbar relative flex h-full flex-col overflow-hidden">
      <p className="hidden text-sm text-zinc-500">Chat ID: {id}</p>
      <ChatContent chatId={id} initialMessages={chat.messages} />
    </section>
  );
}