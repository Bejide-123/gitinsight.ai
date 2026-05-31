import type { GitHubRepo, GitHubRepoData, FileTreeItem } from "@/types/github";
import { octokit } from "../lib/github";
import type { GitHubApiError } from "@/types/error";

// ============================================================
// FILE TREE TYPES
// ============================================================

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  size?: number;
  extension?: string;
  children?: FileTreeNode[];
  status?: "clean" | "warning" | "critical" | "none";
  annotation?: string;
}

// ============================================================
// URL PARSING
// ============================================================

export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);

  if (!match) {
    throw new Error("Invalid GitHub URL format");
  }

  return {
    owner: match[1],
    repo: match[2].replace(".git", ""),
  };
}

// ============================================================
// FETCH REPOSITORY METADATA
// ============================================================

export async function fetchRepository(
  owner: string,
  repo: string
): Promise<GitHubRepo> {
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return data as GitHubRepo;
  } catch (error: unknown) {
    const err = error as GitHubApiError;
    if (err.status === 404) throw new Error("Repository not found");
    if (err.status === 403) throw new Error("Rate limit exceeded or private repository");
    throw new Error(`Failed to fetch repository: ${err.message}`);
  }
}

// ============================================================
// FETCH FILE TREE
// ============================================================

export async function fetchFileTree(
  owner: string,
  repo: string,
  branch: string = "main"
): Promise<FileTreeItem[]> {
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "1",
    });
    return data.tree as FileTreeItem[];
  } catch (error: any) {
    if (branch === "main") {
      try {
        return await fetchFileTree(owner, repo, "master");
      } catch {
        throw new Error("Could not fetch file tree");
      }
    }
    throw new Error(`Failed to fetch file tree: ${error.message}`);
  }
}

// ============================================================
// FETCH README
// ============================================================

export async function fetchReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getReadme({ owner, repo });
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch (error) {
    console.warn(error, "README not found, skipping README analysis");
    return null;
  }
}

// ============================================================
// FETCH PACKAGE.JSON
// ============================================================

export async function fetchPackageJson(
  owner: string,
  repo: string
): Promise<Record<string, unknown> | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: "package.json",
    });

    if ("content" in data) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return JSON.parse(content);
    }

    return null;
  } catch (error) {
    console.warn(error, "package.json not found, skipping package.json analysis");
    return null;
  }
}

// ============================================================
// FETCH SINGLE FILE CONTENT
// ============================================================

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });

    if ("content" in data) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }

    return null;
  } catch (error) {
    console.warn(`Could not fetch file: ${path}`, error);
    return null;
  }
}

// ============================================================
// FETCH MULTIPLE FILES IN PARALLEL
// ============================================================

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
    if (result.status === "fulfilled" && result.value.content) {
      files[result.value.path] = result.value.content;
    }
  });

  console.log(`Successfully fetched ${Object.keys(files).length} files`);
  return files;
}

// ============================================================
// SMART FILE SELECTION — TIERED STRATEGY
// ============================================================

export function selectFilesToAnalyze(fileTree: FileTreeItem[]): string[] {
  const selected: Set<string> = new Set();
  const CODE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

  const isCodeFile = (path: string) =>
    CODE_EXTENSIONS.some((ext) => path.endsWith(ext));

  // TIER 1 — Config & entry points
  const CONFIG_FILES = [
    "package.json",
    "tsconfig.json",
    "jsconfig.json",
    ".env.example",
    ".env.local.example",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "vite.config.js",
    "vite.config.ts",
    "tailwind.config.js",
    "tailwind.config.ts",
    ".eslintrc.js",
    ".eslintrc.json",
    ".eslintrc.ts",
    "jest.config.js",
    "jest.config.ts",
    "vitest.config.ts",
    "playwright.config.ts",
    "docker-compose.yml",
    "Dockerfile",
    ".github/workflows/main.yml",
    ".github/workflows/ci.yml",
    "vercel.json",
    "railway.json",
  ];

  CONFIG_FILES.forEach((file) => {
    const found = fileTree.find(
      (f) => f.path === file || f.path.endsWith(`/${file}`)
    );
    if (found) selected.add(found.path);
  });

  const ENTRY_PATTERNS = [
    "src/main",
    "src/index",
    "src/App",
    "app/layout",
    "app/page",
    "pages/_app",
    "pages/index",
    "pages/_document",
  ];

  ENTRY_PATTERNS.forEach((pattern) => {
    const found = fileTree.find((f) =>
      CODE_EXTENSIONS.some((ext) => f.path === pattern + ext)
    );
    if (found) selected.add(found.path);
  });

  // TIER 2 — Business logic
  const BUSINESS_LOGIC_PATTERNS = [
    (f: FileTreeItem) => f.path.includes("/services/"),
    (f: FileTreeItem) =>
      f.path.includes("/api/") ||
      f.path.includes("/pages/api/") ||
      f.path.includes("/app/api/"),
    (f: FileTreeItem) => f.path.includes("/hooks/"),
    (f: FileTreeItem) =>
      f.path.includes("/context/") ||
      f.path.includes("/store/") ||
      f.path.includes("/state/") ||
      f.path.includes("/zustand/") ||
      f.path.includes("/redux/") ||
      f.path.includes("/slices/"),
    (f: FileTreeItem) =>
      f.path.includes("/utils/") ||
      f.path.includes("/helpers/") ||
      f.path.includes("/lib/"),
    (f: FileTreeItem) =>
      f.path.includes("middleware") || f.path.includes("/middleware/"),
  ];

  BUSINESS_LOGIC_PATTERNS.forEach((matcher) => {
    fileTree
      .filter((f) => matcher(f) && isCodeFile(f.path) && f.type === "blob")
      .forEach((f) => selected.add(f.path));
  });

  // TIER 3 — Pages & routes (up to 15)
  fileTree
    .filter(
      (f) =>
        (f.path.includes("/pages/") ||
          f.path.startsWith("pages/") ||
          f.path.includes("/app/") ||
          f.path.startsWith("app/")) &&
        isCodeFile(f.path) &&
        f.type === "blob" &&
        !f.path.includes("/api/")
    )
    .slice(0, 15)
    .forEach((f) => selected.add(f.path));

  // TIER 4 — Components (strategic mix)
  const componentFiles = fileTree.filter(
    (f) =>
      (f.path.includes("/components/") ||
        f.path.includes("/Components/") ||
        f.path.includes("/ui/")) &&
      isCodeFile(f.path) &&
      f.type === "blob"
  );

  // Small components — likely clean, still worth sampling
  componentFiles
    .filter((f) => f.size !== undefined && f.size < 5000)
    .slice(0, 10)
    .forEach((f) => selected.add(f.path));

  // Large components — most likely to have issues
  componentFiles
    .filter((f) => f.size !== undefined && f.size >= 5000)
    .sort((a, b) => (b.size ?? 0) - (a.size ?? 0))
    .slice(0, 8)
    .forEach((f) => selected.add(f.path));

  // TIER 5 — Test files (up to 5)
  fileTree
    .filter(
      (f) =>
        (f.path.includes(".test.") ||
          f.path.includes(".spec.") ||
          f.path.includes("/__tests__/") ||
          f.path.includes("/tests/") ||
          f.path.includes("/test/") ||
          f.path.includes("/e2e/")) &&
        isCodeFile(f.path) &&
        f.type === "blob"
    )
    .slice(0, 5)
    .forEach((f) => selected.add(f.path));

  // TIER 6 — Database & schema (up to 5)
  fileTree
    .filter(
      (f) =>
        (f.path.includes("/prisma/") ||
          f.path.includes("schema.prisma") ||
          f.path.includes("schema.sql") ||
          f.path.includes("/migrations/") ||
          f.path.includes("/models/") ||
          f.path.includes("/db/") ||
          f.path.includes("/database/")) &&
        f.type === "blob"
    )
    .slice(0, 5)
    .forEach((f) => selected.add(f.path));

  // Cap at 50
  return [...selected].slice(0, 50);
}

// ============================================================
// BUILD VISUAL FILE TREE (flat → nested)
// ============================================================

export function buildFileTree(flatTree: FileTreeItem[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  const map: Record<string, FileTreeNode> = {};

  // Sort folders before files
  const sorted = [...flatTree].sort((a, b) => {
    if (a.type === "tree" && b.type === "blob") return -1;
    if (a.type === "blob" && b.type === "tree") return 1;
    return a.path.localeCompare(b.path);
  });

  sorted.forEach((item) => {
    const parts = item.path.split("/");
    const name = parts[parts.length - 1];
    const extension = name.includes(".") ? name.split(".").pop() : undefined;

    const node: FileTreeNode = {
      name,
      path: item.path,
      type: item.type === "tree" ? "folder" : "file",
      size: item.size,
      extension,
      children: item.type === "tree" ? [] : undefined,
    };

    map[item.path] = node;

    if (parts.length === 1) {
      root.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join("/");
      const parent = map[parentPath];
      if (parent?.children) {
        parent.children.push(node);
      }
    }
  });

  return root;
}

// ============================================================
// ANNOTATE FILE TREE WITH ANALYSIS FINDINGS
// ============================================================

export function annotateFileTree(
  tree: FileTreeNode[],
  issuesByFile: Record<string, Array<{ severity: string }>>
): FileTreeNode[] {
  function annotate(nodes: FileTreeNode[]): FileTreeNode[] {
    return nodes.map((node) => {
      const fileIssues = issuesByFile[node.path] ?? [];
      const hasCritical = fileIssues.some((i) => i.severity === "critical");
      const hasHigh = fileIssues.some((i) => i.severity === "high");

      let status: FileTreeNode["status"] = "none";
      let annotation = "";

      if (hasCritical) {
        status = "critical";
        annotation = `${fileIssues.length} critical issue(s)`;
      } else if (hasHigh) {
        status = "warning";
        annotation = `${fileIssues.length} issue(s)`;
      } else if (node.size && node.size > 50_000) {
        status = "warning";
        annotation = `${Math.round(node.size / 1000)}KB — large file`;
      } else if (fileIssues.length === 0 && node.type === "file") {
        status = "clean";
      }

      return {
        ...node,
        status,
        annotation,
        children: node.children ? annotate(node.children) : undefined,
      };
    });
  }

  return annotate(tree);
}

// ============================================================
// FETCH BASE REPOSITORY DATA
// ============================================================

export async function fetchRepositoryData(
  repoUrl: string
): Promise<GitHubRepoData> {
  const { owner, repo } = parseGitHubUrl(repoUrl);

  const [metadata, fileTree, readme, packageJson] = await Promise.all([
    fetchRepository(owner, repo),
    fetchFileTree(owner, repo, "main"),
    fetchReadme(owner, repo),
    fetchPackageJson(owner, repo),
  ]);

  return { metadata, fileTree, readme, packageJson };
}

// ============================================================
// FETCH REPOSITORY WITH CODE FILES + TREE
// ============================================================

export interface FullRepositoryData extends GitHubRepoData {
  codeFiles: Record<string, string>;
  fileTreeStructure: FileTreeNode[];
  selectedFilesCount: number;
}

export async function fetchRepositoryWithCode(
  repoUrl: string
): Promise<FullRepositoryData> {
  // 1. Fetch base data
  const repoData = await fetchRepositoryData(repoUrl);

  // 2. Build visual tree from full flat list
  const fileTreeStructure = buildFileTree(repoData.fileTree);

  // 3. Select files smartly
  const selectedFiles = selectFilesToAnalyze(repoData.fileTree);

  console.log(`📁 Total files in repo: ${repoData.fileTree.length}`);
  console.log(`🎯 Selected for analysis: ${selectedFiles.length} files`);

  // 4. Fetch actual code content
  const { owner, repo } = parseGitHubUrl(repoUrl);
  const codeFiles = await fetchMultipleFiles(owner, repo, selectedFiles);

  console.log(`✅ Successfully fetched: ${Object.keys(codeFiles).length} files`);

  return {
    ...repoData,
    codeFiles,
    fileTreeStructure,
    selectedFilesCount: Object.keys(codeFiles).length,
  };
}