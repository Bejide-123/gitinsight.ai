type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-md rounded-2xl p-4 backdrop-blur-xl ${
          isAssistant
            ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-50"
            : "rounded-tr-none border border-white/10 bg-white/5 text-zinc-200"
        }`}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}