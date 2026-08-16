import { describe, expect, it } from 'vitest';
import { analyzeRepoSchema } from '@/lib/validation';

describe('analyzeRepoSchema', () => {
  it('accepts a valid GitHub repo URL', () => {
    const result = analyzeRepoSchema.safeParse({ repoUrl: 'https://github.com/vercel/next.js' });

    expect(result.success).toBe(true);
  });

  it('rejects a non-GitHub URL', () => {
    const result = analyzeRepoSchema.safeParse({ repoUrl: 'https://example.com/project' });

    expect(result.success).toBe(false);
  });

  it('requires a repository URL field', () => {
    const result = analyzeRepoSchema.safeParse({ repoUrl: '' });

    expect(result.success).toBe(false);
  });
});
