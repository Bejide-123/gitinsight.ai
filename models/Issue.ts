import { Schema } from "mongoose";
import type { IssueSeverity } from "@/types/analysis";

export const SuggestedPatchSchema = new Schema(
  {
    diffHunk: { type: String },
    beforeCode: { type: String },
    afterCode: { type: String },
    fileName: { type: String },
    startLine: { type: Number },
    endLine: { type: Number },
  },
  { _id: false }
);

export const RemediationSchema = new Schema(
  {
    whyItMatters: { type: String },
    exploitScenario: { type: String },
    steps: [{ type: String }],
    suggestedPatch: SuggestedPatchSchema,
    tradeoffs: [{ type: String }],
    confidence: { type: Number, default: 1.0 },
    ruleId: { type: String },
    autoFixable: { type: Boolean, default: false },
  },
  { _id: false }
);

export const IssueSchema = new Schema({
  fingerprint: { type: String },
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
  startLine: { type: Number },
  endLine: { type: Number },
  ruleId: { type: String },
  remediation: RemediationSchema,
});
