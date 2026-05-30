type MessageBubbleProps = {
  message: string;
};

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-md rounded-2xl rounded-tr-none border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <p className="text-sm text-zinc-200">
          {message}
        </p>
      </div>
    </div>
  );
}