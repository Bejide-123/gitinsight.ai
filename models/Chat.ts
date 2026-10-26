import { Schema, model, models } from "mongoose";

const SourceSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["file", "finding"],
      required: true,
    },
    path: { type: String },
    startLine: { type: Number },
    endLine: { type: Number },
    findingId: { type: String },
    title: { type: String },
  },
  { _id: false }
);

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sources: [SourceSchema],
  suggestedFollowUps: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  report: {
    type: Schema.Types.ObjectId,
    ref: "Report",
    index: true,
  },
  repositoryFullName: {
    type: String,
  },
  title: {
    type: String,
  },
  suggestedQuestions: [{ type: String }],
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ChatSchema.index({ userId: 1, report: 1 });
ChatSchema.index({ userId: 1, updatedAt: -1 });

const Chat = models.Chat || model("Chat", ChatSchema);

export default Chat;
