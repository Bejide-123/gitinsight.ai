"use client";

import BottomInput from "@/components/chat/BottomInput";

interface ChatContentProps {
  children: React.ReactNode;
  chatId: string;
  isLoading: boolean;
}

export default function ChatContent({
  children,
  chatId,
  isLoading,
}: ChatContentProps) {
  return (
    <>
      <div className="flex-1 overflow-y-auto px-8 py-8 pb-48">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {children}
        </div>
      </div>
      {!isLoading && <BottomInput />}
    </>
  );
}