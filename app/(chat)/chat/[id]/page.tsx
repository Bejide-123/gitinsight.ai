import AnalysisWrapper from "@/components/chat/AnalysisWrapper";
import ChatContent from "@/components/chat/ChatContent";
import NotFoundHero from "@/components/chat/ErrorComponent";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import mongoose from "mongoose";

type ChatPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ repoUrl?: string }>;
};

async function getChat(id: string) {
  await dbConnect();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  // Find by chat ID first, or report ID
  let chat = await Chat.findById(id).populate("report").lean();
  if (!chat) {
    chat = await Chat.findOne({ report: id }).populate("report").lean();
  }
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

  const serializedMessages = (chat.messages || []).map((msg: any) => ({
    _id: msg._id ? msg._id.toString() : undefined,
    role: msg.role,
    content: msg.content,
    sources: msg.sources || [],
    suggestedFollowUps: msg.suggestedFollowUps || [],
    createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : undefined,
  }));

  return (
    <section className="hide-scrollbar relative flex h-full flex-col overflow-hidden">
      <p className="hidden text-sm text-zinc-500">Chat ID: {id}</p>
      <ChatContent
        chatId={chat._id.toString()}
        initialMessages={serializedMessages}
        suggestedQuestions={chat.suggestedQuestions || []}
      />
    </section>
  );
}
