import type { Metadata } from "next";
import "@/app/globals.css";
import ChatLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "Chat",
  description: "GitInsight AI Chat Interface",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
}