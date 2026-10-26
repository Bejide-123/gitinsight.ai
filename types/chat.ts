import { z } from "zod";

export interface ChatSource {
  type: "file" | "finding";
  path?: string;
  startLine?: number;
  endLine?: number;
  findingId?: string;
  title?: string;
}

export interface ChatMessage {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  suggestedFollowUps?: string[];
  createdAt?: Date | string;
}

export interface ChatConversation {
  _id: string;
  userId: string;
  report: string | Record<string, any>;
  repositoryFullName?: string;
  title?: string;
  suggestedQuestions?: string[];
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ChatResponsePayload {
  answer: string;
  sources: ChatSource[];
  suggestedFollowUps: string[];
}

export const chatSourceSchema = z.object({
  type: z.enum(["file", "finding"]),
  path: z.string().optional(),
  startLine: z.number().int().positive().optional(),
  endLine: z.number().int().positive().optional(),
  findingId: z.string().optional(),
  title: z.string().optional(),
});

export const chatResponseSchema = z.object({
  answer: z.string().min(1),
  sources: z.array(chatSourceSchema).default([]),
  suggestedFollowUps: z.array(z.string()).default([]),
});

export const sendChatMessageSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty").max(3000, "Message is too long"),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
