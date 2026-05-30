// src/hooks/useAnalyzeRepo.ts
import { useMutation } from '@tanstack/react-query';

interface AnalyzeRepoInput {
  repoUrl: string;
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

      return response.json();
    },
  });
}