import { Schema, model, models } from "mongoose";
import { IssueSchema } from "./Issue";

const ClassifiedFindingSchema = new Schema(
  {
    state: {
      type: String,
      enum: [
        "introduced",
        "resolved",
        "persistent",
        "worsened",
        "improved",
        "collateral_introduced",
        "collateral_resolved",
      ],
      required: true,
    },
    issue: { type: IssueSchema, required: true },
    previousIssue: { type: IssueSchema },
    fingerprint: { type: String, required: true },
    changeSummary: { type: String, required: true },
    introducedInLineRange: { type: Boolean, default: false },
    fileStatus: { type: String },
  },
  { _id: false }
);

const PullRequestReportSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  repoUrl: { type: String, required: true },
  repoName: { type: String, required: true },
  prNumber: { type: Number, required: true },
  prTitle: { type: String, required: true },
  prAuthor: { type: String, required: true },
  prAuthorAvatar: { type: String },
  baseSha: { type: String, required: true },
  headSha: { type: String, required: true },
  baseBranch: { type: String, required: true },
  headBranch: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "closed", "merged"],
    default: "open",
  },
  verdict: {
    type: String,
    enum: ["approved", "needs_work", "blocked"],
    required: true,
  },
  verdictReason: { type: String },
  scoreDelta: { type: Number, required: true },
  baseScore: { type: Number, required: true },
  headScore: { type: Number, required: true },
  changedFilesCount: { type: Number, required: true },
  additions: { type: Number, required: true },
  deletions: { type: Number, required: true },
  counts: {
    introduced: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
    persistent: { type: Number, default: 0 },
    worsened: { type: Number, default: 0 },
    improved: { type: Number, default: 0 },
  },
  introducedIssues: [ClassifiedFindingSchema],
  resolvedIssues: [ClassifiedFindingSchema],
  persistentIssues: [ClassifiedFindingSchema],
  worsenedIssues: [ClassifiedFindingSchema],
  improvedIssues: [ClassifiedFindingSchema],
  summary: { type: String },
  analyzedAt: { type: Date, default: Date.now },
});

PullRequestReportSchema.index({ userId: 1, repoUrl: 1, prNumber: 1, headSha: 1 });
PullRequestReportSchema.index({ repoUrl: 1, prNumber: 1 });

const PullRequestReport =
  models.PullRequestReport || model("PullRequestReport", PullRequestReportSchema);

export default PullRequestReport;
