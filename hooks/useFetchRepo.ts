// src/hooks/useAnalyzeRepo.ts
import { useMutation } from '@tanstack/react-query';
import type { FileTreeItem } from '@/types/github'

interface AnalyzeRepoInput {
  repoUrl: string;
}

interface RepoMetadata {
  stars: number;
  forks: number;
  language: string | null;
  name: string;
  description: string | null;
  url: string;
}

export interface AnalyzeRepoResponse {
  success: boolean;
  data: {
    metadata: {
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      [key: string]: any;
    };
    fileTree: FileTreeItem[];
    readme: string | null;
    packageJson: any;
  };
}

export function useAnalyzeRepo() {
  return useMutation({
    mutationFn: async (input: AnalyzeRepoInput) => {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze repository');
      }

      return response.json() as Promise<AnalyzeRepoResponse>;
    },
  });
}

export function useExtractRepoMetadata(repoData: AnalyzeRepoResponse | null): RepoMetadata | null {
  if (!repoData?.data?.metadata) return null;

  const metadata = repoData.data.metadata;
  return {
    stars: metadata.stargazers_count,
    forks: metadata.forks_count,
    language: metadata.language,
    name: metadata.name,
    description: metadata.description,
    url: metadata.html_url,
  };
}