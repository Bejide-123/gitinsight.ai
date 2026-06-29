"use client";

import BottomInput from "@/components/chat/BottomInput";
import MessageBubble from "./MessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface ChatContentProps {
  children?: React.ReactNode;
  chatId: string;
  isLoading?: boolean;
  initialMessages?: Message[];
}

export default function ChatContent({
  children,
  chatId,
  isLoading,
  initialMessages = [],
}: ChatContentProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto px-8 py-8 pb-48 hide-scrollbar">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {initialMessages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          {children}
        </div>
      </div>
      {!isLoading && <BottomInput />}
    </>
  );
}
