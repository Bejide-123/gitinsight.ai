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
  isLoading?: boolean;
  initialMessages?: Message[];
}

export default function ChatContent({
  children,
  isLoading,
  initialMessages = [],
}: ChatContentProps) {
  return (
    <>
      <div className="hide-scrollbar flex-1 overflow-y-auto bg-[#07090c] px-4 py-6 pb-56 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
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
