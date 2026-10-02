"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { logout as logoutUser } from "@/services/auth-service";

export default function ChatHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout: clearAuthUser } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuthUser();
      setDropdownOpen(false);
      router.push("/login");
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "No email available";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const pageTitle = pathname.startsWith("/dashboard")
    ? "Dashboard"
    : pathname === "/chat"
      ? "New analysis"
      : pathname.startsWith("/chat/")
        ? "Repository analysis"
        : "Workspace";

  return (
    <header className="relative z-30 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0a0d10] px-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-[11px] text-zinc-500">GitInsight / Workspace</p>
        <h1 className="truncate text-sm font-semibold text-white">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        {user?.githubConnected && (
          <div className="hidden items-center gap-2 text-xs text-emerald-200 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            GitHub connected
          </div>
        )}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            aria-label="Open account menu"
            className="flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 transition hover:border-white/10 hover:bg-white/[0.04]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-[#151a1e] text-xs font-semibold text-cyan-100">
              {initials || "GI"}
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`} />
          </motion.button>

          {/* DROPDOWN MENU */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                role="menu"
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-white/10 bg-[#0d1115] shadow-xl shadow-black/30"
              >
                <div className="border-b border-white/[0.08] px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded border border-white/10 bg-[#151a1e] text-sm font-semibold text-cyan-100">
                      {initials || "GI"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{displayName}</p>
                      <p className="truncate text-xs text-zinc-500">{displayEmail}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-300">
                        <ShieldCheck className="h-3 w-3" />
                        Signed in
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-1.5">
                  <MenuItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    onClick={() => router.push("/dashboard")}
                  />
                  <MenuItem
                    icon={LogOut}
                    label="Logout"
                    onClick={handleLogout}
                    className="text-rose-300 hover:bg-rose-300/[0.06] hover:text-rose-200"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// Menu Item Component
interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  className?: string;
}

const MenuItem = ({ icon: Icon, label, onClick, className = "" }: MenuItemProps) => (
  <motion.button
    role="menuitem"
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-zinc-300 transition hover:bg-white/[0.04] hover:text-white ${className}`}
  >
    <Icon className="h-4 w-4" />
    <span className="text-sm">{label}</span>
  </motion.button>
);