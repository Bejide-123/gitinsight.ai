import { Bot, UserRound } from "lucide-react";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAssistant = role === "assistant";
  const Icon = isAssistant ? Bot : UserRound;

  return (
    <div className={`flex items-start gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
      {isAssistant && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-cyan-200/15 bg-cyan-200/[0.05] text-cyan-100">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[min(42rem,88%)] rounded-md border px-4 py-3 ${
          isAssistant
            ? "border-white/[0.08] bg-[#0d1115] text-zinc-200"
            : "border-cyan-200/15 bg-cyan-200/[0.06] text-cyan-50"
        }`}
      >
        <p className="mb-1 text-[10px] font-medium text-zinc-500">
          {isAssistant ? "GitInsight" : "You"}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>
      </div>
      {!isAssistant && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 bg-[#151a1e] text-zinc-300">
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}