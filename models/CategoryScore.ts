import { Schema } from "mongoose";
import { IssueSchema } from "./Issue";

export const CategoryScoreSchema = new Schema({
  score: { type: Number, required: true },
  weight: { type: Number, required: true },
  issues: [IssueSchema],
  strengths: [{ type: String }],
});
