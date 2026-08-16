import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  JWT_SECRET: z.string().min(32).optional(),
  MONGODB_URI: z.string().min(10).optional(),
  GITHUB_TOKEN: z.string().min(10).optional(),
  GEMINI_API_KEY: z.string().min(10).optional(),
});

export function getValidatedEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');

    throw new Error(`Invalid environment configuration: ${issues}`);
  }

  return parsed.data;
}

export function requireEnv(keys: string[]) {
  const env = getValidatedEnv();
  const missing = keys.filter((key) => !env[key as keyof typeof env]);

  const shouldRequire = process.env.NODE_ENV === 'production' || keys.includes('JWT_SECRET');

  if (missing.length > 0 && shouldRequire) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return env;
}

export function getJwtSecret(): string {
  const { JWT_SECRET } = requireEnv(['JWT_SECRET']);

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return JWT_SECRET;
}
