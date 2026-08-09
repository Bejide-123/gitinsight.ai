"use client";

import {
  FolderCog,
  FolderOpen,
  Folder,
  FileText,
  AlertCircle,
  GitBranch,
  Layers,
  Package,
  HardDrive,
  ChevronRight,
  Shield,
  Wrench,
  FileCode2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface FileNode {
  name: string;
  path: string;
  type: "folder" | "file";
  size?: number;
  status?: "clean" | "warning" | "critical" | "none";
  annotation?: string;
  children?: FileNode[];
}

interface StructureStats {
  logicSeparation: number;
  unusedModules: number;
  bundleSize: string;
  totalFiles?: number;
  totalFolders?: number;
  largestFile?: string;
  largestFileSize?: string;
  hasTests?: boolean;
  hasDocker?: boolean;
  hasCICD?: boolean;
  hasEnvExample?: boolean;
  typeSafetyScore?: number;
}

interface HealthWarning {
  folder: string;
  message: string;
}

interface ProjectStructureProps {
  fileTree: any[];
  stats: StructureStats;
  healthWarning?: HealthWarning;
  isLoading?: boolean;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string; label: string }> = {
  clean: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    label: "clean",
  },
  warning: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    label: "warning",
  },
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    label: "critical",
  },
};

// Transform flat GitHub file tree into nested structure
function buildFileTree(files: any[]): FileNode[] {
  if (!files || !Array.isArray(files)) return [];
  
  const root: FileNode[] = [];
  const map: Record<string, FileNode> = {};

  const sortedFiles = [...files].sort((a, b) => {
    if (a.type === 'tree' && b.type !== 'tree') return -1;
    if (a.type !== 'tree' && b.type === 'tree') return 1;
    return a.path.localeCompare(b.path);
  });

  sortedFiles.forEach((file) => {
    const pathParts = file.path.split('/');
    const fileName = pathParts.pop() || file.path;
    const currentPath = file.path;

    const node: FileNode = {
      name: fileName,
      path: currentPath,
      type: file.type === 'tree' ? 'folder' : 'file',
      size: file.size || 0,
      children: file.type === 'tree' ? [] : undefined,
    };

    map[currentPath] = node;

    if (pathParts.length === 0) {
      root.push(node);
    } else {
      const parentPath = pathParts.join('/');
      const parent = map[parentPath];
      if (parent && parent.children) {
        parent.children.push(node);
      } else {
        root.push(node);
      }
    }
  });

  return root;
}

// Count total files in tree
function countFiles(nodes: FileNode[]): number {
  let count = 0;
  nodes.forEach(node => {
    if (node.type === 'file') count++;
    if (node.children) count += countFiles(node.children);
  });
  return count;
}

// Count total folders in tree
function countFolders(nodes: FileNode[]): number {
  let count = 0;
  nodes.forEach(node => {
    if (node.type === 'folder') {
      count++;
      if (node.children) count += countFolders(node.children);
    }
  });
  return count;
}

// 🆕 Detect infrastructure files from file tree
function detectInfrastructure(fileTree: any[]): {
  hasTests: boolean;
  hasDocker: boolean;
  hasCICD: boolean;
  hasEnvExample: boolean;
} {
  const testPatterns = [
    /\.test\./,
    /\.spec\./,
    /\/tests?\//,
    /\/__tests__\//,
    /\/test\//,
    /\.test\.tsx?$/,
    /\.spec\.tsx?$/,
    /\/jest\.config/,
    /\/vitest\.config/,
    /\/cypress/,
  ];

  const dockerPatterns = [
    /dockerfile/i,
    /Dockerfile/i,
    /docker-compose/i,
    /\.dockerignore/,
  ];

  const cicdPatterns = [
    /\.github\/workflows\//,
    /\.gitlab-ci\.yml/,
    /\.circleci\//,
    /\.travis\.yml/,
    /azure-pipelines\.yml/,
    /bitbucket-pipelines\.yml/,
    /\.github\/workflows/,
  ];

  const envPatterns = [
    /\.env\.example/,
    /\.env\.sample/,
    /\.env\.local/,
    /\.env\.development/,
    /\.env\.template/,
  ];

  let hasTests = false;
  let hasDocker = false;
  let hasCICD = false;
  let hasEnvExample = false;

  if (fileTree && Array.isArray(fileTree)) {
    for (const file of fileTree) {
      const path = file.path || '';
      
      // Check for tests
      if (!hasTests && testPatterns.some(pattern => pattern.test(path))) {
        hasTests = true;
      }
      
      // Check for Docker
      if (!hasDocker && dockerPatterns.some(pattern => pattern.test(path))) {
        hasDocker = true;
      }
      
      // Check for CI/CD
      if (!hasCICD && cicdPatterns.some(pattern => pattern.test(path))) {
        hasCICD = true;
      }
      
      // Check for env example
      if (!hasEnvExample && envPatterns.some(pattern => pattern.test(path))) {
        hasEnvExample = true;
      }
      
      // Early exit if all found
      if (hasTests && hasDocker && hasCICD && hasEnvExample) break;
    }
  }

  return { hasTests, hasDocker, hasCICD, hasEnvExample };
}

// Map file extensions to subtle colors
function fileColor(name: string | undefined): string {
  if (!name) return "text-zinc-500";
  
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "text-blue-400",
    tsx: "text-blue-400",
    js: "text-yellow-400",
    jsx: "text-yellow-400",
    json: "text-orange-400",
    md: "text-zinc-300",
    css: "text-pink-400",
    scss: "text-pink-400",
    less: "text-pink-400",
    env: "text-emerald-400",
    yml: "text-purple-400",
    yaml: "text-purple-400",
    xml: "text-orange-400",
    html: "text-orange-400",
    htm: "text-orange-400",
    gitignore: "text-zinc-500",
    dockerfile: "text-blue-400",
    sh: "text-green-400",
    bash: "text-green-400",
    py: "text-yellow-400",
    rb: "text-red-400",
    go: "text-blue-400",
    rs: "text-orange-400",
    php: "text-purple-400",
    java: "text-red-400",
  };
  return map[ext ?? ""] ?? "text-zinc-500";
}

function FileTreeNode({
  node,
  depth = 0,
  searchTerm = "",
}: {
  node: FileNode;
  depth?: number;
  searchTerm?: string;
}) {
  const [open, setOpen] = useState(depth === 0);
  
  if (!node || typeof node !== 'object') {
    return null;
  }

  const isFolder = node.type === "folder";
  const hasChildren = isFolder && (node.children?.length ?? 0) > 0;
  const statusConfig = node.status && node.status !== "none" ? STATUS_BADGE[node.status] : null;
  const nodeName = node.name || "Untitled";
  
  const matchesSearch = searchTerm === "" || 
    nodeName.toLowerCase().includes(searchTerm.toLowerCase());

  if (searchTerm && !matchesSearch && !hasChildren) {
    return null;
  }

  return (
    <div>
      <div
        className={`flex items-center justify-between py-[3px] pr-2 rounded-md transition-colors ${
          isFolder ? "cursor-pointer hover:bg-white/[0.04]" : "cursor-default"
        }`}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
        onClick={() => isFolder && setOpen((o) => !o)}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isFolder ? (
            <ChevronRight
              size={12}
              className={`text-zinc-600 flex-shrink-0 transition-transform duration-200 ${
                open ? "rotate-90" : ""
              }`}
            />
          ) : (
            <span className="w-3 flex-shrink-0" />
          )}

          {isFolder ? (
            open ? (
              <FolderOpen size={13} className="text-purple-400 flex-shrink-0" />
            ) : (
              <Folder size={13} className="text-zinc-500 flex-shrink-0" />
            )
          ) : (
            <FileText size={12} className={`flex-shrink-0 ${fileColor(nodeName)}`} />
          )}

          <span
            className={`text-[12px] truncate ${
              isFolder ? "text-zinc-200 font-medium" : "text-zinc-400"
            }`}
          >
            {nodeName}
          </span>

          {node.annotation && (
            <span className="text-[9px] text-zinc-600 ml-2 flex-shrink-0 truncate">
              {node.annotation}
            </span>
          )}
        </div>

        {statusConfig && (
          <span
            className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex-shrink-0 ml-2`}
          >
            {statusConfig.label}
          </span>
        )}

        {!isFolder && node.size && (
          <span className="text-[9px] text-zinc-600 flex-shrink-0 ml-2">
            {node.size > 1000
              ? `${Math.round(node.size / 1000)}KB`
              : `${node.size}B`}
          </span>
        )}
      </div>

      {isFolder && open && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <FileTreeNode 
              key={`${child.name || 'unnamed'}-${i}`} 
              node={child} 
              depth={depth + 1}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-800 rounded" />
          <div className={`h-3 bg-zinc-800 rounded ${i % 2 === 0 ? 'w-32' : 'w-24'}`} />
        </div>
      ))}
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
  color = "text-white",
  subtext,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
  subtext?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-2.5">
        <Icon size={13} className="text-zinc-500 flex-shrink-0" />
        <div>
          <p className="text-[11px] text-zinc-400">{label}</p>
          {subtext && <p className="text-[9px] text-zinc-600 mt-0.5">{subtext}</p>}
        </div>
      </div>
      <span className={`text-[12px] font-bold ${color}`}>{value}</span>
    </div>
  );
}

function GateRow({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <div
        className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
          passed
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        <span>{passed ? "✓" : "✗"}</span>
        <span>{passed ? "Present" : "Missing"}</span>
      </div>
    </div>
  );
}

export default function ProjectStructure({
  fileTree,
  stats,
  healthWarning,
  isLoading = false,
}: ProjectStructureProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Build the nested tree from flat GitHub data
  const nestedTree = useMemo(() => {
    if (!fileTree || !Array.isArray(fileTree) || fileTree.length === 0) {
      return [];
    }
    return buildFileTree(fileTree);
  }, [fileTree]);

  // 🆕 Auto-detect infrastructure from file tree
  const infra = useMemo(() => {
    if (!fileTree || !Array.isArray(fileTree)) {
      return { hasTests: false, hasDocker: false, hasCICD: false, hasEnvExample: false };
    }
    return detectInfrastructure(fileTree);
  }, [fileTree]);

  // Calculate stats from tree
  const totalFiles = useMemo(() => countFiles(nestedTree), [nestedTree]);
  const totalFolders = useMemo(() => countFolders(nestedTree), [nestedTree]);

  // Merge stats with auto-detected infrastructure
  const mergedStats = useMemo(() => ({
    ...stats,
    hasTests: stats?.hasTests ?? infra.hasTests,
    hasDocker: stats?.hasDocker ?? infra.hasDocker,
    hasCICD: stats?.hasCICD ?? infra.hasCICD,
    hasEnvExample: stats?.hasEnvExample ?? infra.hasEnvExample,
    totalFiles: stats?.totalFiles ?? totalFiles,
    totalFolders: stats?.totalFolders ?? totalFolders,
  }), [stats, infra, totalFiles, totalFolders]);

  // Debug
  useEffect(() => {
    if (fileTree && fileTree.length > 0) {
      console.log("📁 FileTree:", fileTree.length, "items");
      console.log("📊 Nested tree:", nestedTree.length, "root nodes");
      console.log("📄 Total files:", totalFiles);
      console.log("📂 Total folders:", totalFolders);
      console.log("🔍 Infrastructure detected:", infra);
      setDebugInfo(`Root: ${nestedTree.length} nodes, Files: ${totalFiles}, Folders: ${totalFolders}`);
    } else {
      setDebugInfo("No file tree data received");
    }
  }, [fileTree, nestedTree, totalFiles, totalFolders, infra]);

  const rootCount = nestedTree.length;

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* ── Directory tree ──────────────────────────────────── */}
      <div className="col-span-12 lg:col-span-6 relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
                <FolderCog size={17} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Directory Architecture</h3>
                <p className="text-[10px] text-zinc-500">
                  {rootCount > 0 ? `${rootCount} root entries` : "No files found"}
                </p>
              </div>
            </div>
            
            {rootCount > 0 && (
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/30 transition-colors w-36"
              />
            )}
          </div>

          {/* Debug info - only in development */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div className="mb-3 text-[10px] text-zinc-500 bg-white/5 p-2 rounded-lg">
              Debug: {debugInfo}
            </div>
          )}

          {/* Tree */}
          <div className="font-mono bg-white/[0.02] rounded-xl border border-white/5 p-3 overflow-x-auto max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <TreeSkeleton />
            ) : !nestedTree || nestedTree.length === 0 ? (
              <div className="text-center py-8">
                <Folder size={32} className="mx-auto text-zinc-700 mb-3" />
                <p className="text-[11px] text-zinc-600">
                  No file structure available
                </p>
                <p className="text-[9px] text-zinc-700 mt-1">
                  {fileTree && fileTree.length > 0 
                    ? `${fileTree.length} files found but couldn't build tree` 
                    : "Files will appear here after analysis"}
                </p>
              </div>
            ) : (
              nestedTree.map((node, i) => (
                <FileTreeNode 
                  key={`${node.name || 'root'}-${i}`} 
                  node={node} 
                  depth={0}
                  searchTerm={searchTerm}
                />
              ))
            )}
          </div>

          {/* Footer meta */}
          <div className="mt-3 flex items-center gap-4 text-[10px] text-zinc-600">
            <span className="flex items-center gap-1.5">
              <GitBranch size={11} />
              {rootCount} root {rootCount === 1 ? "entry" : "entries"}
            </span>
            {totalFiles > 0 && (
              <span className="flex items-center gap-1.5">
                <FileText size={11} />
                {totalFiles} files total
              </span>
            )}
            {totalFolders > 0 && (
              <span className="flex items-center gap-1.5">
                <Folder size={11} />
                {totalFolders} folders
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Right column ────────────────────────────────────── */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        {/* Health Warning */}
        {healthWarning && (
          <div className="relative group overflow-hidden rounded-2xl border border-red-500/20 bg-[#0a0a0a] p-5 transition-all duration-500 hover:border-red-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle size={17} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-red-400 mb-0.5">Health Warning</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{healthWarning.message}</p>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  Folder:{" "}
                  <span className="text-zinc-400 font-mono">{healthWarning.folder}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Structure Statistics */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)] flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Layers size={15} className="text-purple-400" />
              <h4 className="text-sm font-bold text-white">Structure Statistics</h4>
            </div>

            {/* Logic separation bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                  Logic Separation
                </span>
                <span className="text-sm font-bold text-white">
                  {stats?.logicSeparation ?? 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, stats?.logicSeparation ?? 0))}%` }}
                />
              </div>
              <p className="text-[9px] text-zinc-600 mt-1">
                How well business logic is separated from UI
              </p>
            </div>

            {/* Stat rows */}
            <div className="mb-4">
              <StatRow
                icon={Package}
                label="Unused Modules"
                value={stats?.unusedModules ?? 0}
                color={(stats?.unusedModules ?? 0) > 5 ? "text-amber-400" : "text-emerald-400"}
                subtext="Detected dead dependencies"
              />
              <StatRow
                icon={HardDrive}
                label="Bundle Size"
                value={stats?.bundleSize ?? "—"}
                subtext="Estimated output size"
              />
              {totalFiles > 0 && (
                <StatRow
                  icon={FileText}
                  label="Total Files"
                  value={totalFiles}
                  subtext="Across all directories"
                />
              )}
              {totalFolders > 0 && (
                <StatRow
                  icon={Folder}
                  label="Total Folders"
                  value={totalFolders}
                  subtext="Directory structure"
                />
              )}
              {stats?.largestFile && (
                <StatRow
                  icon={FileCode2}
                  label="Largest File"
                  value={stats.largestFileSize ?? "—"}
                  color="text-amber-400"
                  subtext={stats.largestFile}
                />
              )}
              {stats?.typeSafetyScore !== undefined && (
                <StatRow
                  icon={Shield}
                  label="Type Safety Score"
                  value={`${stats.typeSafetyScore}%`}
                  color={
                    stats.typeSafetyScore >= 80
                      ? "text-emerald-400"
                      : stats.typeSafetyScore >= 50
                      ? "text-amber-400"
                      : "text-red-400"
                  }
                  subtext="TypeScript coverage signal"
                />
              )}
            </div>

            {/* 🆕 Infrastructure checks - Now with auto-detected values */}
            <div className="border-t border-white/[0.06] pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Wrench size={12} className="text-zinc-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                  Infrastructure
                </span>
              </div>
              <div className="space-y-0">
                <GateRow 
                  label="Test suite" 
                  passed={mergedStats.hasTests ?? false} 
                />
                <GateRow 
                  label="Docker config" 
                  passed={mergedStats.hasDocker ?? false} 
                />
                <GateRow 
                  label="CI/CD pipeline" 
                  passed={mergedStats.hasCICD ?? false} 
                />
                <GateRow 
                  label=".env.example" 
                  passed={mergedStats.hasEnvExample ?? false} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}