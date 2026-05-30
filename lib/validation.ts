// src/lib/validations.ts
import { z } from 'zod';

export const analyzeRepoSchema = z.object({
  repoUrl: z
    .string()
    .min(1, 'Repository URL is required')
    .url('Must be a valid URL')
    .refine(
      (url) => url.includes('github.com'),
      'Must be a GitHub URL'
    ),
});

export type AnalyzeRepoInput = z.infer<typeof analyzeRepoSchema>;