import { Schema } from "mongoose";
import { IssueSeverity } from "@/types/analysis";

export const IssueSchema = new Schema({
  category: { type: String, required: true },
  severity: {
    type: String,
    enum: ["critical", "high", "medium", "low"] as IssueSeverity[],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isDangerous: { type: Boolean, required: true },
  impact: { type: String, required: true },
  recommendation: { type: String, required: true },
  evidence: [{ type: String }],
  file: { type: String },
  lineNumber: { type: Number },
});
