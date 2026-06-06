import AnalysisWrapper from "@/components/chat/AnalysisWrapper";
import NotFoundHero from "@/components/chat/ErrorComponent";

type ChatPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    repoUrl?: string;
  };
};

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const { id } = await params;
  const { repoUrl } = await searchParams;

  console.log("ChatPage received repoUrl:", repoUrl); // Added for debugging

  return (
    <section className="hide-scrollbar relative flex h-full flex-col overflow-hidden">
      <p className="hidden text-sm text-zinc-500">
        Chat ID: {id}
      </p>

      {repoUrl ? (
        <AnalysisWrapper repoUrl={decodeURIComponent(repoUrl)} chatId={id} />
      ) : (
          <NotFoundHero />
      )}
    </section>
  );
}