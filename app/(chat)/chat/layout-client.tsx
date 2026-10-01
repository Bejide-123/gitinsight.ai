import { ChatAppShell } from "@/components/chat/ChatAppShell";

export default function ChatLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatAppShell>{children}</ChatAppShell>;
}