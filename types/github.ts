// src/types/github.ts
import { FileTreeNode } from "@/utils/Filetreenode"


export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;

  homepage: string | null;

  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;

  language: string | null;
  topics: string[];

  license: {
    name: string;
    spdx_id: string;
  } | null;

  created_at: string;
  updated_at: string;
  pushed_at: string;

  default_branch: string;
}

export interface FileTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubRepoData {
  metadata: GitHubRepo;
  fileTree: FileTreeItem[];
  readme: string | null;
  packageJson: any | null; // Paths of files selected for analysis
  fileTreeStructure?: FileTreeNode[];
  selectedFilesCount?: number;
}