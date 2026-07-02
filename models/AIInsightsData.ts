import { Schema } from "mongoose";

export const AIInsightsDataSchema = new Schema({
  executiveSummary: { type: String, required: true },
  recommendations: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      impact: {
        type: String,
        enum: ["High Impact", "Medium Impact", "Low Impact"],
        required: true,
      },
      impactScore: { type: Number, required: true },
      difficulty: { type: Number, required: true },
      priority: { type: Number, enum: [1, 2, 3], required: true },
    },
  ],
  productionVerdict: { type: String, required: true },
  roadmapPhases: [
    {
      number: { type: Number, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      status: {
        type: String,
        enum: ["completed", "active", "upcoming", "future"],
        required: true,
      },
      tags: [{ type: String }],
    },
  ],
  architecturalStrengths: [{ type: String }],
  criticalWeaknesses: [{ type: String }],
  longTermOutlook: { type: String, required: true },
  sentimentScore: { type: Number, required: true },
  techStack: [{ type: String }],
  capabilities: [
    {
      name: { type: String, required: true },
      status: {
        type: String,
        enum: ["pass", "missing", "incomplete"],
        required: true,
      },
    },
  ],
  productionCategories: [
    {
      title: { type: String, required: true },
      items: [
        {
          label: { type: String, required: true },
          status: {
            type: String,
            enum: ["pass", "warn", "fail"],
            required: true,
          },
        },
      ],
    },
  ],
});
