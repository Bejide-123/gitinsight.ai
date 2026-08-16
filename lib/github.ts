import { Octokit } from '@octokit/rest';
import { requireEnv } from '@/lib/env';

const { GITHUB_TOKEN } = requireEnv(['GITHUB_TOKEN']);

export const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});