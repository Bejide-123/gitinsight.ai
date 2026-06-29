import { Schema, model, models } from "mongoose";
import { ProjectContextSchema } from "./ProjectContext";
import { CategoryScoreSchema } from "./CategoryScore";
import { IssueSchema } from "./Issue";
import { AIInsightsDataSchema } from "./AIInsightsData";

const ReportSchema = new Schema({
  repoUrl: { type: String, required: true },
  repoName: { type: String, required: true },
  analyzedAt: { type: Date, default: Date.now },
  projectContext: ProjectContextSchema,
  maturityScore: { type: Number, required: true },
  level: { type: String, required: true },
  isProductionReady: { type: Boolean, required: true },
  techStack: [{ type: String }],
  categoryScores: {
    security: CategoryScoreSchema,
    architecture: CategoryScoreSchema,
    errorHandling: CategoryScoreSchema,
    performance: CategoryScoreSchema,
    testing: CategoryScoreSchema,
    documentation: CategoryScoreSchema,
    devops: CategoryScoreSchema,
    codeQuality: CategoryScoreSchema,
    functionality: CategoryScoreSchema,
    completeness: CategoryScoreSchema,
    readiness: CategoryScoreSchema,
    maintainability: CategoryScoreSchema,
  },
  dangerousIssues: [IssueSchema],
  missingImprovements: [IssueSchema],
  strengths: [{ type: String }],
  fileTreeStructure: { type: Schema.Types.Mixed },
  selectedFilesCount: { type: Number },
  criticalBlockers: [{ type: String }],
  nextSteps: [{ type: String }],
  aiInsights: AIInsightsDataSchema,
});

const Report = models.Report || model("Report", ReportSchema);

export default Report;
