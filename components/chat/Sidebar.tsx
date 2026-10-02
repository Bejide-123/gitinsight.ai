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
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentRepos } from "@/hooks/useHistory";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { getRepoAnalysis } from "@/services/getRepoAnalysis-service";
import { cn } from "@/lib/utils";

// SidebarItem Component with enhanced design
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isOpen: boolean;
  className?: string;
  variant?: "default" | "primary";
  showBadge?: boolean;
  badgeText?: string;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  isOpen,
  className = "",
  variant = "default",
  showBadge = false,
  badgeText = "NEW"
}: SidebarItemProps) => {
  const isPrimary = variant === "primary";
  
  return (
    <motion.button
      whileHover={{ x: isOpen ? 4 : 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center overflow-hidden rounded-md transition-colors duration-150",
        isOpen ? "justify-start gap-3 px-3 py-2.5" : "justify-center px-2 py-3",
        variant === "primary" && "bg-cyan-300 text-[#071013] hover:bg-cyan-200",
        variant === "default" && (active
          ? "bg-white/[0.07] text-white"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"),
        className
      )}
    >
      <Icon className={cn(
        "relative z-10 h-4 w-4 shrink-0",
        isPrimary ? "text-black" : active ? "text-cyan-400" : "",
      )} />
      
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative z-10 overflow-hidden whitespace-nowrap text-sm font-medium",
              isPrimary ? "text-black font-bold" : "",
            )}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Active indicator for default variant */}
      {active && isOpen && variant === "default" && (
        <motion.div
          layoutId="sidebar-indicator"
          className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
      
      {/* Badge for primary items */}
      {showBadge && isOpen && isPrimary && (
        <motion.div
          className="ml-auto flex items-center gap-1.5 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className={cn(
            "text-[9px] font-bold px-2 py-0.5 rounded-full",
            "bg-black/10 text-black"
          )}>
            {badgeText}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse" />
        </motion.div>
      )}
      
      {/* Collapsed state badge indicator */}
      {showBadge && !isOpen && isPrimary && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse" />
      )}
    </motion.button>
  );
};

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
  const handleRepoClick = async (reportId: string, repoName: string, repoUrl?: string) => {
    try {
      setLoadingReportId(reportId);
      const result = await getRepoAnalysis(reportId);
      console.log("Analysis data:", result);
      
      const urlParam = repoUrl || `https://github.com/${repoName}`;
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
    if (score >= 80) return "text-emerald-200 border-emerald-200/15 bg-emerald-200/[0.05]";
    if (score >= 60) return "text-cyan-100 border-cyan-100/15 bg-cyan-100/[0.05]";
    if (score >= 40) return "text-amber-100 border-amber-100/15 bg-amber-100/[0.05]";
    return "text-rose-200 border-rose-200/15 bg-rose-200/[0.05]";
  };

  const barColor = (score: number) => {
    if (score >= 80) return "bg-emerald-300";
    if (score >= 60) return "bg-cyan-300";
    if (score >= 40) return "bg-amber-300";
    return "bg-rose-300";
  };

  // Handle logo click - toggle sidebar when collapsed, navigate home when expanded
  const handleLogoClick = () => {
    if (!isOpen) {
      setIsOpen(true);
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
          width: isOpen ? 280 : 72,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-white/[0.08] bg-[#090c0f] text-white shadow-xl shadow-black/20"
      >
        {/* LOGO - Clickable to toggle/collapse */}
        <motion.div
          className={cn(
            "mb-3 flex h-16 shrink-0 cursor-pointer items-center border-b border-white/[0.08]",
            isOpen ? "px-4 justify-between" : "px-2 justify-center"
          )}
          onClick={handleLogoClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="relative flex h-9 w-9 items-center justify-center rounded border border-cyan-200/15 bg-cyan-200/[0.06]">
                <Terminal className="h-4 w-4 text-cyan-100" />
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
                  <h1 className="whitespace-nowrap text-sm font-semibold text-white">
                    GitInsight
                  </h1>
                  <p className="whitespace-nowrap text-[10px] text-zinc-500">
                    Engineering workspace
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
              aria-label="Collapse sidebar"
              className="shrink-0 rounded-md p-1.5 text-zinc-500 transition hover:bg-white/[0.05] hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* NAV */}
        <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
          <div className={cn(
            "space-y-1",
            isOpen ? "px-3" : "px-2"
          )}>
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={isActive("/dashboard")}
              onClick={() => router.push("/dashboard")}
              isOpen={isOpen}
            />

            {/* Redesigned New Analysis Button - Primary Variant with White Background */}
            <SidebarItem
              icon={PlusCircle}
              label="New Analysis"
              active={isActive("/chat")}
              onClick={() => router.push("/chat")}
              isOpen={isOpen}
              variant="primary"
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
                  <p className="text-[10px] font-medium text-zinc-500">
                    Recent Repositories
                  </p>
                  <button
                    onClick={() => router.push("/history")}
                    className="cursor-pointer text-[10px] text-zinc-500 transition-colors hover:text-zinc-200"
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
                      <p className="text-[11px] leading-relaxed text-zinc-500">
                        No analyses yet.{" "}
                        <button
                          onClick={() => router.push("/chat")}
                          className="text-cyan-200 transition-colors hover:text-cyan-100"
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
                            "w-full rounded-md border border-transparent px-3 py-2.5 text-left transition",
                            isFirst
                              ? "border-white/[0.08] bg-white/[0.03] hover:border-cyan-200/20"
                              : "hover:bg-white/[0.04]",
                            isLoadingItem ? "cursor-wait opacity-50" : ""
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={cn(
                              "flex items-center gap-2 truncate text-xs",
                              isFirst ? "text-white" : "text-zinc-300"
                            )}>
                              <GitBranch className={cn(
                                "h-3 w-3 shrink-0",
                                isFirst ? "text-cyan-200" : "text-zinc-500"
                              )} />
                              <span className="truncate">{repo.repoName}</span>
                            </span>
                            <span className={cn(
                              "ml-2 shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium",
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
                                className={cn("h-full rounded-full", bar)}
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
        <div className="shrink-0 border-t border-white/[0.08] pt-4">
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="px-3">
                <div className="rounded-md border border-white/[0.08] bg-white/[0.025] p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-cyan-200" />
                    <span className="text-xs font-medium text-zinc-200">Repository insights</span>
                  </div>
                  <p className="mb-3 text-[11px] leading-4 text-zinc-500">
                    Review your latest engineering reports.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="w-full rounded border border-white/10 px-2.5 py-2 text-xs font-medium text-zinc-200 transition hover:border-cyan-200/20 hover:bg-white/[0.04]"
                  >
                    Open dashboard
                  </button>
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
                    className="rounded-md p-2 text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
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
                  className="rounded-md p-2 text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
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