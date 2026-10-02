import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const octokit = new Octokit(GITHUB_TOKEN ? { auth: GITHUB_TOKEN } : {});

export function createGitHubClient(accessToken?: string) {
  return accessToken ? new Octokit({ auth: accessToken }) : octokit;
}