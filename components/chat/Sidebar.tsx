"use client";

import {
  PlusCircle,
  History,
  FileText,
  Settings,
  BookOpen,
  User,
  Terminal,
  GitBranch,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useRecentRepos } from "@/hooks/useHistory";
import { formatDistanceToNow } from "date-fns";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, className = "" }: SidebarItemProps) => (
  <motion.button
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full text-left px-5 py-2.5 flex items-center gap-3 rounded-lg transition-all duration-300 ${
      active
        ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        : "text-zinc-400 hover:text-white hover:bg-white/5"
    } ${className}`}
  >
    <Icon className={`w-5 h-5 ${active ? "text-cyan-400" : ""}`} />
    <span className="text-sm font-medium">{label}</span>
    {active && (
      <motion.div
        layoutId="sidebar-indicator"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    )}
  </motion.button>
);

// Skeleton loader for repo items while history is fetching
function RepoSkeleton() {
  return (
    <div className="px-5 py-3 rounded-lg animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-32 bg-zinc-800 rounded" />
        <div className="h-4 w-10 bg-zinc-800 rounded-full" />
      </div>
      <div className="h-1 w-full bg-zinc-800 rounded-full" />
      <div className="h-2 w-20 bg-zinc-800 rounded mt-2" />
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { recentRepos, isLoading } = useRecentRepos();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  // Gauge progress bar width capped at 100%
  const progressWidth = (score: number) => `${Math.min(100, Math.max(0, score))}%`;

  // Score color — mirrors your maturity level logic
  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-400/10";
    if (score >= 60) return "text-cyan-400 bg-cyan-400/10";
    if (score >= 40) return "text-amber-400 bg-amber-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const barColor = (score: number) => {
    if (score >= 80) return "from-emerald-400 to-green-400";
    if (score >= 60) return "from-cyan-400 to-blue-400";
    if (score >= 40) return "from-amber-400 to-orange-400";
    return "from-red-400 to-red-500";
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-[320px] bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-r border-white/10 flex flex-col p-6 text-sm text-white shadow-2xl shadow-black/50">

      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 px-2 flex items-center gap-3 group cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-lg group-hover:bg-cyan-400/30 transition-all duration-500" />
          <div className="relative w-10 h-10 bg-gradient-to-br from-white to-white/90 rounded-xl flex items-center justify-center shadow-lg shadow-white/10 group-hover:shadow-white/20 transition-all duration-300">
            <Terminal className="w-5 h-5 text-black" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            GitInsight
          </h1>
          <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
            Intelligence Platform
          </p>
        </div>
      </motion.div>

      {/* NAV */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="space-y-1">
          <SidebarItem
            icon={PlusCircle}
            label="New Analysis"
            active={isActive("/chat")}
            onClick={() => router.push("/chat")}
          />
          <SidebarItem
            icon={History}
            label="Chat History"
            active={isActive("/history")}
            // onClick={() => router.push("/history")}
          />
        </div>

        {/* Recent Repositories */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-2 pb-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
              Recent Repositories
            </p>
            <button
              // onClick={() => router.push("/history")}
              className="text-[9px] text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-1">
            {isLoading ? (
              // Show skeletons while fetching
              <>
                <RepoSkeleton />
                <RepoSkeleton />
              </>
            ) : recentRepos.length === 0 ? (
              <div className="px-5 py-4 text-center">
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  No analyses yet.{" "}
                  <button
                    onClick={() => router.push("/chat")}
                    className="text-cyan-500 hover:text-cyan-400 transition-colors"
                  >
                    Start your first one.
                  </button>
                </p>
              </div>
            ) : (
              recentRepos.map((repo, index) => {
                const isFirst = index === 0;
                const timeAgo = formatDistanceToNow(new Date(repo.analyzedAt), { addSuffix: true });
                const color = scoreColor(repo.maturityScore);
                const bar = barColor(repo.maturityScore);

                return (
                  <motion.button
                    key={repo._id}
                    whileHover={{ x: 4 }}
                    onClick={() => router.push(`/report/${repo._id}`)}
                    className={`w-full text-left px-5 py-3 rounded-lg transition-all duration-300 ${
                      isFirst
                        ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 hover:bg-white/5"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-mono flex items-center gap-2 truncate ${isFirst ? "text-white/90" : "text-white/70"}`}>
                        <GitBranch className={`w-3 h-3 flex-shrink-0 ${isFirst ? "text-cyan-400" : "text-zinc-500"}`} />
                        <span className="truncate">{repo.repoName}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${color}`}>
                        {repo.maturityScore}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: progressWidth(repo.maturityScore) }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${bar} rounded-full`}
                        />
                      </div>
                      {isFirst && <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] text-zinc-500">{timeAgo}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                      <span className="text-[9px] text-zinc-500 capitalize truncate">
                        {repo.projectContext.intent.replace(/-/g, " ")}
                      </span>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8">
          <SidebarItem
            icon={FileText}
            label="Documentation"
            active={isActive("/docs")}
            onClick={() => router.push("/docs")}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="relative p-4 bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/10 rounded-xl overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white/90">Unlock Full Potential</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
              Unlimited private repo scans &amp; advanced AI insights
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 bg-gradient-to-r from-white to-white/90 text-black text-xs font-bold rounded-lg shadow-lg hover:shadow-white/20 transition-all duration-300"
            >
              Upgrade to Pro
            </motion.button>
          </div>
        </motion.div>

        <div className="flex items-center justify-around py-2">
          {[
            { icon: Settings, label: "Settings", path: "/settings" },
            { icon: BookOpen, label: "Docs", path: "/docs" },
            { icon: User, label: "Profile", path: "/profile" },
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(item.path)}
              className="text-zinc-500 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/5"
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>
      </div>
    </aside>
  );
}