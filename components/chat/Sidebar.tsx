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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentRepos } from "@/hooks/useHistory";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { getRepoAnalysis } from "@/services/getRepoAnalysis-service";
import { cn } from "@/lib/utils";

// SidebarItem Component
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isOpen: boolean;
  className?: string;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  isOpen,
  className = "" 
}: SidebarItemProps) => (
  <motion.button
    whileHover={{ x: isOpen ? 4 : 0 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "w-full flex items-center rounded-lg transition-all duration-300",
      isOpen ? "px-5 py-2.5 gap-3 justify-start" : "px-2 py-3 justify-center",
      active
        ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        : "text-zinc-400 hover:text-white hover:bg-white/5",
      className
    )}
  >
    <Icon className={cn("w-5 h-5 flex-shrink-0", active ? "text-cyan-400" : "")} />
    
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm font-medium whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>

    {active && isOpen && (
      <motion.div
        layoutId="sidebar-indicator"
        className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    )}
  </motion.button>
);

// Skeleton loader for repo items while history is fetching
function RepoSkeleton({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={cn(
      "px-5 py-3 rounded-lg animate-pulse",
      !isOpen && "px-2 flex justify-center"
    )}>
      {isOpen ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 w-32 bg-zinc-800 rounded" />
            <div className="h-4 w-10 bg-zinc-800 rounded-full" />
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full" />
          <div className="h-2 w-20 bg-zinc-800 rounded mt-2" />
        </>
      ) : (
        <div className="w-8 h-8 bg-zinc-800 rounded-full" />
      )}
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { recentRepos, isLoading } = useRecentRepos();
  const [loadingReportId, setLoadingReportId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Emit sidebar state changes to parent
  useEffect(() => {
    const event = new CustomEvent('sidebar-toggle', { 
      detail: { isOpen } 
    });
    window.dispatchEvent(event);
  }, [isOpen]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  // Handle click on a repo item
  // In Sidebar.tsx, update the handleRepoClick function:

const handleRepoClick = async (reportId: string, repoName: string, repoUrl?: string) => {
  try {
    setLoadingReportId(reportId);
    const result = await getRepoAnalysis(reportId);
    console.log("Analysis data:", result);
    
    // Use the stored repoUrl if available, otherwise construct it from repoName
    // or use a default fallback
    const urlParam = repoUrl || `https://github.com/${repoName}`;
    
    // Navigate with the same pattern as EmptyChatHero
    router.push(`/chat/${reportId}?repoUrl=${encodeURIComponent(urlParam)}`);
    
  } catch (error) {
    console.error("Failed to fetch analysis:", error);
  } finally {
    setLoadingReportId(null);
  }
};

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

  // Handle logo click - toggle sidebar when collapsed, navigate home when expanded
  const handleLogoClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      // router.push("/");
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{
          width: isOpen ? 320 : 72,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="fixed inset-y-0 left-0 overflow-hidden bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-r border-white/10 flex flex-col text-white shadow-2xl shadow-black/50 z-50"
      >
        {/* LOGO - Clickable to toggle/collapse */}
        <motion.div
          className={cn(
            "flex items-center h-16 mb-4 cursor-pointer flex-shrink-0",
            isOpen ? "px-4 justify-between" : "px-2 justify-center"
          )}
          onClick={handleLogoClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-lg group-hover:bg-cyan-400/30 transition-all duration-500" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-white to-white/90 rounded-xl flex items-center justify-center shadow-lg shadow-white/10 group-hover:shadow-white/20 transition-all duration-300">
                <Terminal className="w-5 h-5 text-black" />
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent whitespace-nowrap">
                    GitInsight
                  </h1>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-semibold whitespace-nowrap">
                    Intelligence Platform
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle Chevron - Only show when expanded */}
          {isOpen && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all duration-300 flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* NAV */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
          <div className={cn(
            "space-y-1",
            isOpen ? "px-2" : "px-1"
          )}>
            <SidebarItem
              icon={PlusCircle}
              label="New Analysis"
              active={isActive("/chat")}
              onClick={() => router.push("/chat")}
              isOpen={isOpen}
            />
            <SidebarItem
              icon={History}
              label="Chat History"
              active={isActive("/history")}
              onClick={() => router.push("/history")}
              isOpen={isOpen}
            />
          </div>

          {/* Recent Repositories - Only show when expanded */}
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 overflow-hidden flex-shrink-0"
              >
                <div className="flex items-center justify-between px-2 pb-3">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
                    Recent Repositories
                  </p>
                  <button
                    onClick={() => router.push("/history")}
                    className="text-[9px] text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-1">
                  {isLoading ? (
                    <>
                      <RepoSkeleton isOpen={true} />
                      <RepoSkeleton isOpen={true} />
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
                      const isLoadingItem = loadingReportId === repo._id;

                      return (
                        <motion.button
                          key={repo._id}
                          whileHover={{ x: 4 }}
                          onClick={() => handleRepoClick(repo._id, repo.repoName, repo.repoUrl)}
                          disabled={isLoadingItem}
                          className={cn(
                            "w-full text-left px-5 py-3 rounded-lg transition-all duration-300",
                            isFirst
                              ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 hover:bg-white/5"
                              : "hover:bg-white/5",
                            isLoadingItem ? "opacity-50 cursor-wait" : ""
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={cn(
                              "text-xs font-mono flex items-center gap-2 truncate",
                              isFirst ? "text-white/90" : "text-white/70"
                            )}>
                              <GitBranch className={cn(
                                "w-3 h-3 flex-shrink-0",
                                isFirst ? "text-cyan-400" : "text-zinc-500"
                              )} />
                              <span className="truncate">{repo.repoName}</span>
                            </span>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2",
                              color
                            )}>
                              {repo.maturityScore}/100
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: progressWidth(repo.maturityScore) }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={cn(
                                  "h-full bg-gradient-to-r rounded-full",
                                  bar
                                )}
                              />
                            </div>
                            {isFirst && !isLoadingItem && <TrendingUp className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                            {isLoadingItem && (
                              <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[9px] text-zinc-500">{timeAgo}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                            <span className="text-[9px] text-zinc-500 capitalize truncate">
                              {repo.projectContext?.intent?.replace(/-/g, " ") || "unknown"}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Documentation - Only show when expanded */}
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 overflow-hidden flex-shrink-0"
              >
                <SidebarItem
                  icon={FileText}
                  label="Documentation"
                  active={isActive("/docs")}
                  onClick={() => router.push("/docs")}
                  isOpen={isOpen}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spacer to push footer down */}
          <div className="flex-1" />
        </div>

        {/* FOOTER - Always visible with consistent positioning */}
        <div className="flex-shrink-0 pt-6 border-t border-white/5">
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="px-4">
                <div className="relative p-4 bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/10 rounded-xl overflow-hidden group cursor-pointer">
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
                </div>
              </div>

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
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2 py-2"
            >
              {[
                { icon: Settings, label: "Settings", path: "/settings" },
                { icon: BookOpen, label: "Docs", path: "/docs" },
                { icon: User, label: "Profile", path: "/profile" },
              ].map((item) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(item.path)}
                  className="text-zinc-500 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/5"
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
}