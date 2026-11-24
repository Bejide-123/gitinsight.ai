import { octokit } from "../lib/github";
import type { GitHubApiError } from "@/types/error";
import type {
  PullRequestItem,
  PullRequestDetails,
  PullRequestFile,
} from "@/types/pr";

const MAX_PR_FILES = 300;

export async function fetchPullRequests(
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
  client: typeof octokit = octokit,
  page = 1,
  perPage = 30
): Promise<PullRequestItem[]> {
  try {
    const { data } = await client.rest.pulls.list({
      owner,
      repo,
      state,
      page,
      per_page: perPage,
      sort: "updated",
      direction: "desc",
    });

    return data.map((pr) => ({
      number: pr.number,
      title: pr.title,
      author: pr.user?.login || "unknown",
      authorAvatar: pr.user?.avatar_url,
      state: pr.merged_at ? "merged" : (pr.state as "open" | "closed"),
      htmlUrl: pr.html_url,
      baseBranch: pr.base.ref,
      headBranch: pr.head.ref,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      isDraft: Boolean(pr.draft),
    }));
  } catch (error: unknown) {
    const err = error as GitHubApiError;
    if (err.status === 404) throw new Error("Repository not found or no pull requests available");
    if (err.status === 403) throw new Error("Rate limit exceeded or insufficient permissions");
    throw new Error(`Failed to fetch pull requests: ${err.message || "Unknown error"}`);
  }
}

export async function fetchPullRequestDetails(
  owner: string,
  repo: string,
  pullNumber: number,
  client: typeof octokit = octokit
): Promise<PullRequestDetails> {
  try {
    const { data } = await client.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    return {
      number: data.number,
      title: data.title,
      author: data.user?.login || "unknown",
      authorAvatar: data.user?.avatar_url,
      state: data.merged_at ? "merged" : (data.state as "open" | "closed"),
      htmlUrl: data.html_url,
      baseBranch: data.base.ref,
      headBranch: data.head.ref,
      baseSha: data.base.sha,
      headSha: data.head.sha,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isDraft: Boolean(data.draft),
      additions: data.additions,
      deletions: data.deletions,
      changedFilesCount: data.changed_files,
      body: data.body || "",
    };
  } catch (error: unknown) {
    const err = error as GitHubApiError;
    if (err.status === 404) throw new Error(`Pull request #${pullNumber} not found`);
    if (err.status === 403) throw new Error("Rate limit exceeded or private repository access needed");
    throw new Error(`Failed to fetch pull request #${pullNumber}: ${err.message || "Unknown error"}`);
  }
}

export async function fetchPullRequestFiles(
  owner: string,
  repo: string,
  pullNumber: number,
  client: typeof octokit = octokit
): Promise<PullRequestFile[]> {
  try {
    const allFiles: PullRequestFile[] = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore && allFiles.length < MAX_PR_FILES) {
      const { data } = await client.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
        page,
        per_page: perPage,
      });

      if (!data || data.length === 0) {
        hasMore = false;
        break;
      }

      for (const file of data) {
        allFiles.push({
          filename: file.filename,
          status: file.status as PullRequestFile["status"],
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
          patch: file.patch,
          previousFilename: file.previous_filename,
        });
      }

      if (data.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }

    // Check if any code files are missing patch due to GitHub size limits
    const missingPatch = allFiles.some(
      (f) => !f.patch && (f.status === "added" || f.status === "modified")
    );

    if (missingPatch) {
      try {
        const rawDiffResponse = await client.rest.pulls.get({
          owner,
          repo,
          pull_number: pullNumber,
          mediaType: {
            format: "diff",
          },
        });

        if (typeof rawDiffResponse.data === "string") {
          extractPatchesFromRawDiff(rawDiffResponse.data, allFiles);
        }
      } catch (diffErr) {
        console.warn("Could not fetch raw fallback diff:", diffErr);
      }
    }

    return allFiles;
  } catch (error: unknown) {
    const err = error as GitHubApiError;
    if (err.status === 404) throw new Error(`Files for pull request #${pullNumber} not found`);
    throw new Error(`Failed to fetch pull request files: ${err.message || "Unknown error"}`);
  }
}

function extractPatchesFromRawDiff(rawDiff: string, files: PullRequestFile[]): void {
  const fileDiffs = rawDiff.split(/^diff --git /m);

  for (const block of fileDiffs) {
    if (!block.trim()) continue;
    const headerMatch = block.match(/^[a-z]\/(.*?)\s+[b-z]\/(.*?)(?:\n|$)/);
    if (!headerMatch) continue;

    const targetPath = headerMatch[2] || headerMatch[1];
    const matchingFile = files.find((f) => f.filename === targetPath);

    if (matchingFile && !matchingFile.patch) {
      const patchStartIndex = block.indexOf("@@");
      if (patchStartIndex !== -1) {
        matchingFile.patch = block.substring(patchStartIndex);
      }
    }
  }
}
