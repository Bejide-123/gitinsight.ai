import { FolderCog, FolderOpen, Folder, FileText, AlertCircle, GitBranch, Layers, Package, HardDrive } from "lucide-react";

interface FileNode {
  name: string;
  type: "folder" | "file";
  status?: "clean" | "messy" | "warning" | "none";
  comment?: string;
  children?: FileNode[];
}

interface StructureStats {
  logicSeparation: number;
  unusedModules: number;
  bundleSize: string;
}

interface HealthWarning {
  folder: string;
  message: string;
}

interface ProjectStructureProps {
  fileTree: FileNode[];
  stats: StructureStats;
  healthWarning?: HealthWarning;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  clean: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  messy: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  warning: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
};

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const paddingLeft = depth * 16;
  const isFolder = node.type === "folder";
  const FolderIcon = node.children?.length ? FolderOpen : Folder;
  const statusConfig = node.status ? STATUS_BADGE[node.status] : null;

  return (
    <div>
      <div
        className="flex items-center justify-between text-zinc-400 py-1 text-xs hover:text-zinc-300 transition-colors group/file"
        style={{ paddingLeft }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isFolder ? (
            <FolderIcon size={14} className="text-zinc-500 flex-shrink-0 group-hover/file:text-purple-400 transition-colors" />
          ) : (
            <FileText size={14} className="text-zinc-600 flex-shrink-0" />
          )}
          <span className={isFolder ? "text-zinc-300 font-medium truncate" : "text-zinc-400 truncate"}>
            {node.name}
          </span>
          {node.comment && (
            <span className="text-[9px] text-zinc-600 tracking-tighter ml-auto flex-shrink-0">
              {node.comment}
            </span>
          )}
        </div>

        {node.status && node.status !== "none" && statusConfig && (
          <span
            className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-[0.1em] ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex-shrink-0 ml-2`}
          >
            {node.status}
          </span>
        )}
      </div>

      {node.children?.map((child, index) => (
        <FileTreeNode key={`${child.name}-${index}`} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function ProjectStructure({
  fileTree,
  stats,
  healthWarning,
}: ProjectStructureProps) {
  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Directory tree */}
      <div className="col-span-12 lg:col-span-6 relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-7 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)]">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        {/* Decorative glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
              <FolderCog size={17} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Directory Architecture</h3>
              <p className="text-[10px] text-zinc-500 font-medium">File tree structure</p>
            </div>
          </div>

          {/* Tree */}
          <div className="font-mono text-[12px] space-y-0.5 text-zinc-400 p-4 bg-white/[0.03] rounded-xl border border-white/5 overflow-x-auto">
            {fileTree.map((node, index) => (
              <FileTreeNode key={`${node.name}-${index}`} node={node} />
            ))}
          </div>

          {/* File count */}
          <div className="mt-4 flex items-center gap-2 text-[10px] text-zinc-500">
            <GitBranch size={12} className="text-zinc-600" />
            <span>{fileTree.length} root {fileTree.length === 1 ? 'directory' : 'directories'}</span>
          </div>
        </div>
      </div>

      {/* Right side - Stats + Health */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        {/* Health Warning */}
        {healthWarning && (
          <div className="relative group overflow-hidden rounded-2xl border border-red-500/20 bg-[#0a0a0a] p-5 transition-all duration-500 hover:border-red-500/30 hover:shadow-[0_0_40px_rgba(239,68,68,0.05)]">
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle size={17} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-red-400 mb-0.5">Health Warning</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{healthWarning.message}</p>
                <p className="text-[10px] text-zinc-500 mt-1.5">Folder: <span className="text-zinc-400 font-mono">{healthWarning.folder}</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(168,85,247,0.05)] flex-1">
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <Layers size={15} className="text-purple-400" />
              <h4 className="text-sm font-bold text-white">Structure Statistics</h4>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 flex-1 items-center">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {stats.logicSeparation}
                  </span>
                  <span className="text-sm text-zinc-500 ml-0.5">%</span>
                </div>
                <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-[0.15em] mt-1">
                  Logic Separation
                </p>
                <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.logicSeparation}%` }}
                  />
                </div>
              </div>

              <div className="text-center">
                <span className="text-3xl font-bold text-white">
                  {stats.unusedModules}
                </span>
                <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-[0.15em] mt-1">
                  Unused Modules
                </p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Package size={12} className="text-zinc-600" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-3xl font-bold text-white">
                  {stats.bundleSize}
                </span>
                <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-[0.15em] mt-1">
                  Bundle Size
                </p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <HardDrive size={12} className="text-zinc-600" />
                </div>
              </div>
            </div>

            {/* Bottom indicator */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[9px] text-zinc-500">
              <span className="w-1 h-1 rounded-full bg-purple-400" />
              <span>Project structure analyzed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}