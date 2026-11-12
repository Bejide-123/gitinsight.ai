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

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be no more than 72 characters')
  .refine(
    (password) => new TextEncoder().encode(password).length <= 72,
    'Password must be no more than 72 bytes'
  );

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(254),
  password: z.string().min(1, 'Password is required').refine(
    (password) => new TextEncoder().encode(password).length <= 72,
    'Password must be no more than 72 bytes'
  ),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email address').max(254),
  password: passwordSchema,
});

export type AnalyzeRepoInput = z.infer<typeof analyzeRepoSchema>;