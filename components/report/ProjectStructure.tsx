import { FolderCog, FolderOpen, Folder, FileText, AlertCircle } from "lucide-react";

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

const STATUS_BADGE: Record<string, string> = {
  clean: "text-emerald-400 bg-emerald-500/10",
  messy: "text-amber-400 bg-amber-500/10",
  warning: "text-orange-400 bg-orange-500/10",
};

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const paddingLeft = depth * 14;
  const isFolder = node.type === "folder";
  const FolderIcon = node.children?.length ? FolderOpen : Folder;

  return (
    <div>
      <div
        className="flex items-center justify-between text-zinc-400 py-0.5 text-xs hover:text-zinc-300 transition-colors"
        style={{ paddingLeft }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isFolder ? (
            <FolderIcon size={14} className="text-zinc-500 flex-shrink-0" />
          ) : (
            <FileText size={14} className="text-zinc-600 flex-shrink-0" />
          )}
          <span className={isFolder ? "text-zinc-300 font-medium" : "text-zinc-400 truncate"}>
            {node.name}
          </span>
          {node.comment && (
            <span className="text-[9px] text-zinc-600 tracking-tighter ml-auto flex-shrink-0">
              // {node.comment}
            </span>
          )}
        </div>

        {node.status && node.status !== "none" && (
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${STATUS_BADGE[node.status] ?? ""} flex-shrink-0 ml-2`}
          >
            {node.status}
          </span>
        )}
      </div>

      {node.children?.map((child) => (
        <FileTreeNode key={child.name} node={child} depth={depth + 1} />
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
      <div className="col-span-12 lg:col-span-6 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-7 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
        {/* Animated gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10">
          <h3 className="text-lg md:text-xl font-bold text-white mb-5 flex items-center gap-2">
            <FolderCog size={18} className="text-white" />
            Directory Architecture
          </h3>

          <div className="font-mono text-[12px] space-y-0.5 text-zinc-400 p-4 bg-black/30 rounded-2xl border border-white/5 overflow-x-auto">
            {fileTree.map((node) => (
              <FileTreeNode key={node.name} node={node} />
            ))}
          </div>
        </div>
      </div>

      {/* Health warning + stats */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
        {healthWarning && (
          <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent p-5 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle size={16} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white mb-1">
                  Health Warning
                </h4>
                <p className="text-xs text-zinc-400">
                  {healthWarning.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-7 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08]">
          {/* Animated gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-3 gap-4">
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">
                {stats.logicSeparation}%
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                Logic Separation
              </span>
            </div>

            <div className="h-10 w-px bg-white/10 mx-auto" />

            <div className="text-center">
              <span className="block text-2xl font-bold text-white">
                {stats.unusedModules}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                Unused Modules
              </span>
            </div>

            <div className="col-span-3 h-px bg-white/10 mt-2 pt-2" />

            <div className="col-span-3 text-center">
              <span className="block text-2xl font-bold text-white">
                {stats.bundleSize}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                Bundle Size
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}