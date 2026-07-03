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

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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
      <div className="flex-1 flex flex-col">
        {/* Main nav items */}
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
            onClick={() => router.push("/history")}
          />
        </div>

        {/* Recent Repositories */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-2 pb-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
              Recent Repositories
            </p>
            <span className="text-[9px] text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
              View All
            </span>
          </div>

          {/* Repo 1 */}
          <motion.button
            whileHover={{ x: 4 }}
            className="w-full text-left px-5 py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-2 border-cyan-400 hover:bg-white/5"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono text-white/90 flex items-center gap-2">
                <GitBranch className="w-3 h-3 text-cyan-400" />
                vercel/next.js
              </span>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-400/10 px-2 py-0.5 rounded-full">
                94/100
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                />
              </div>
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[9px] text-zinc-500">Updated 2h ago</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-[9px] text-emerald-400/60">98% match</span>
            </div>
          </motion.button>

          {/* Repo 2 */}
          <motion.button
            whileHover={{ x: 4 }}
            className="w-full text-left px-5 py-3 rounded-lg transition-all duration-300 hover:bg-white/5 mt-1"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-white/70 flex items-center gap-2">
                <GitBranch className="w-3 h-3 text-zinc-500" />
                tailwindlabs/tailwindcss
              </span>
              <span className="text-[10px] text-zinc-500">87/100</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-zinc-400 to-zinc-300 w-[87%] rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[9px] text-zinc-500">Analyzed 2d ago</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-[9px] text-zinc-500">3 issues</span>
            </div>
          </motion.button>
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

      {/* FOOTER ACTIONS */}
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
            { icon: Settings, label: "Settings" },
            { icon: BookOpen, label: "Docs" },
            { icon: User, label: "Profile" },
          ].map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-zinc-500 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/5"
            >
              <item.icon className="w-5 h-5" />
            </motion.button>
          ))}
        </div>
      </div>
    </aside>
  );
}