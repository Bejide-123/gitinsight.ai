import { Schema, model, models } from "mongoose";

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatSchema = new Schema({
  report: {
    type: Schema.Types.ObjectId,
    ref: "Report",
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = models.Chat || model("Chat", ChatSchema);

export default Chat;
