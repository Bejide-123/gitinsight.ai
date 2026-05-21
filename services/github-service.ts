import type { GitHubRepo, GitHubRepoData, FileTreeItem } from "@/types/github";
import { octokit } from "../lib/github";
import type { GitHubApiError } from "@/types/error";

export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  // Handles: https://github.com/vercel/next.js
  // Also handles: github.com/vercel/next.js (without https)
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }

  return {
    owner: match[1],
    repo: match[2].replace('.git', ''), // Remove .git if present
  };
}

/**
 * Fetch repository metadata from GitHub
 */
export async function fetchRepository(
  owner: string,
  repo: string
): Promise<GitHubRepo> {
  try {
    const { data } = await octokit.repos.get({
      owner,
      repo,
    });

    return data as GitHubRepo;
  } catch (error: unknown) {
    const err = error as GitHubApiError;
    if (err.status === 404) {
      throw new Error('Repository not found');
    }
    if (err.status === 403) {
      throw new Error('Rate limit exceeded or private repository');
    }
    throw new Error(`Failed to fetch repository: ${err.message}`);
  }
}

/**
 * Fetch file tree (all files and folders)
 */
export async function fetchFileTree(
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<FileTreeItem[]> {
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: '1', // Get all files recursively
    });

    return data.tree as FileTreeItem[];
  } catch (error: any) {
    // Try 'master' branch if 'main' fails
    if (branch === 'main') {
      try {
        return await fetchFileTree(owner, repo, 'master');
      } catch {
        throw new Error('Could not fetch file tree');
      }
    }
    throw new Error(`Failed to fetch file tree: ${error.message}`);
  }
}

/**
 * Fetch README content
 */
export async function fetchReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getReadme({
      owner,
      repo,
    });

    // README is base64 encoded
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.warn( error, 'README not found, skipping README analysis');
    // README doesn't exist
    return null;
  }
}

/**
 * Fetch package.json (for JavaScript/TypeScript projects)
 */
export async function fetchPackageJson(
  owner: string,
  repo: string
): Promise<any | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'package.json',
    });

    // Check if it's a file (not a directory)
    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return JSON.parse(content);
    }

    return null;
  } catch (error) {
    console.warn( error, 'package.json not found, skipping package.json analysis');
    // package.json doesn't exist
    return null;
  }
}

// services/github.service.ts

/**
 * Select files to analyze (handles .js, .jsx, .ts, .tsx)
 */
export function selectFilesToAnalyze(fileTree: FileTreeItem[]): string[] {
  const selected: string[] = [];

  // Code file extensions
  const CODE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
  
  const isCodeFile = (path: string) => 
    CODE_EXTENSIONS.some((ext) => path.endsWith(ext));

  // 1. Config files (any extension)
  const configFiles = [
    'package.json',
    'tsconfig.json',
    'jsconfig.json',
    '.env.example',
    'next.config.js',
    'next.config.mjs',
    'vite.config.js',
    'vite.config.ts',
    'tailwind.config.js',
    'tailwind.config.ts',
    '.eslintrc.js',
    '.eslintrc.json',
  ];
  
  configFiles.forEach((file) => {
    const found = fileTree.find((f) => f.path === file || f.path.endsWith(`/${file}`));
    if (found) selected.push(found.path);
  });

  // 2. Entry points (any code extension)
  const entryPointPatterns = [
    'src/main',
    'src/index',
    'src/App',
    'app/layout',
    'pages/_app',
    'pages/index',
  ];
  
  entryPointPatterns.forEach((pattern) => {
    const found = fileTree.find((f) => 
      CODE_EXTENSIONS.some((ext) => f.path.includes(pattern + ext))
    );
    if (found) selected.push(found.path);
  });

  // 3. Services folder (all code files)
  const serviceFiles = fileTree.filter((f) => 
    f.path.includes('/services/') && 
    isCodeFile(f.path) &&
    f.type === 'blob'
  );
  selected.push(...serviceFiles.map((f) => f.path));

  // 4. API routes (all code files)
  const apiFiles = fileTree.filter((f) => 
    (f.path.includes('/api/') || f.path.includes('/pages/api/')) &&
    isCodeFile(f.path) &&
    f.type === 'blob'
  );
  selected.push(...apiFiles.map((f) => f.path));

  // 5. Context/State files (all code files)
  const contextFiles = fileTree.filter((f) => 
    (f.path.includes('/context/') || 
     f.path.includes('/store/') ||
     f.path.includes('/hooks/')) &&
    isCodeFile(f.path) &&
    f.type === 'blob'
  );
  selected.push(...contextFiles.map((f) => f.path));

  // 6. Utils (all code files)
  const utilFiles = fileTree.filter((f) => 
    (f.path.includes('/utils/') || f.path.includes('/helpers/')) &&
    isCodeFile(f.path) &&
    f.type === 'blob'
  );
  selected.push(...utilFiles.map((f) => f.path));

  // 7. Lib folder (all code files)
  const libFiles = fileTree.filter((f) => 
    f.path.includes('/lib/') &&
    isCodeFile(f.path) &&
    f.type === 'blob'
  );
  selected.push(...libFiles.map((f) => f.path));

  // 8. Sample largest component files (2-3 files)
  const componentFiles = fileTree
    .filter((f) => 
      (f.path.includes('/components/') || 
       f.path.includes('/Pages/') || 
       f.path.includes('/pages/')) &&
      isCodeFile(f.path) &&
      f.type === 'blob' && 
      f.size && 
      f.size > 10000 // > 10KB
    )
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 3);
  selected.push(...componentFiles.map((f) => f.path));

  // Remove duplicates
  return [...new Set(selected)];
}

/**
 * Fetch all repository data at once
 */
export async function fetchRepositoryData(
  repoUrl: string
): Promise<GitHubRepoData> {
  // Parse URL
  const { owner, repo } = parseGitHubUrl(repoUrl);

  // Fetch all data in parallel
  const [metadata, fileTree, readme, packageJson] = await Promise.all([
    fetchRepository(owner, repo),
    fetchFileTree(owner, repo, 'main'),
    fetchReadme(owner, repo),
    fetchPackageJson(owner, repo),
  ]);

  return {
    metadata,
    fileTree,
    readme,
    packageJson,
  };
}

// services/github.service.ts (ADD THESE)

/**
 * Fetch specific file content from repository
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    return null;
  } catch (error) {
    console.warn(`Could not fetch file: ${path}`);
    return null;
  }
}

/**
 * Fetch multiple files in parallel
 */
export async function fetchMultipleFiles(
  owner: string,
  repo: string,
  paths: string[]
): Promise<Record<string, string>> {
  console.log(`Fetching ${paths.length} files...`);

  const results = await Promise.allSettled(
    paths.map(async (path) => {
      const content = await fetchFileContent(owner, repo, path);
      return { path, content };
    })
  );

  const files: Record<string, string> = {};
  
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.content) {
      files[result.value.path] = result.value.content;
    }
  });

  console.log(`Successfully fetched ${Object.keys(files).length} files`);
  return files;
}

/**
 * Fetch repository data with actual code files
 */
export async function fetchRepositoryWithCode(
  repoUrl: string
): Promise<GitHubRepoData & { codeFiles: Record<string, string> }> {
  // 1. Get basic repo data
  const repoData = await fetchRepositoryData(repoUrl);
  
  // 2. Select which files to analyze
  const selectedFiles = selectFilesToAnalyze(repoData.fileTree);
  
  console.log('Selected files for analysis:', selectedFiles);
  
  // 3. Fetch actual code content
  const { owner, repo } = parseGitHubUrl(repoUrl);
  const codeFiles = await fetchMultipleFiles(owner, repo, selectedFiles);
  
  return {
    ...repoData,
    codeFiles,
  };
}