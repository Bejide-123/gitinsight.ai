import { describe, expect, it } from 'vitest';
import { analyzeRepoSchema, loginSchema, registerSchema } from '@/lib/validation';

describe('analyzeRepoSchema', () => {
  it('accepts a valid GitHub repo URL', () => {
    const result = analyzeRepoSchema.safeParse({ repoUrl: 'https://github.com/vercel/next.js' });

    expect(result.success).toBe(true);
  });

  describe('auth input schemas', () => {
    it('accepts valid login and registration data', () => {
      expect(loginSchema.safeParse({
        email: 'jane@example.com',
        password: 'long-enough-password',
      }).success).toBe(true);
      expect(registerSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'long-enough-password',
      }).success).toBe(true);
    });

    it('rejects malformed email and passwords outside bcrypt limits', () => {
      expect(loginSchema.safeParse({ email: 'bad', password: 'pass' }).success).toBe(false);
      expect(registerSchema.safeParse({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'p'.repeat(73),
      }).success).toBe(false);
    });
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
