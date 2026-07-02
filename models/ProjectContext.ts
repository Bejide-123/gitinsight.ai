import { Schema } from "mongoose";
import { ProjectIntent } from "@/types/analysis";

export const ProjectContextSchema = new Schema({
  intent: {
    type: String,
    enum: [
      "portfolio",
      "learning",
      "mvp",
      "startup",
      "production-saas",
      "enterprise",
      "open-source-library",
    ] as ProjectIntent[],
    required: true,
  },
  confidence: { type: Number, required: true },
  signals: [{ type: String }],
  expectedFeatures: [{ type: String }],
  notRequiredFeatures: [{ type: String }],
});
