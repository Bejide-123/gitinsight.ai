"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Terminal, 
  HelpCircle, 
  User, 
  LogOut, 
  Shield,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { logout as logoutUser } from "@/services/auth-service";

export default function ChatHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "No email available";

  return (
    <header className="w-full h-16 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-8 shadow-[0_4px_30px_rgba(0,0,0,0.3)] z-50 relative">
      
      {/* LEFT - SEARCH */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className={`flex items-center gap-3 flex-1 transition-all duration-300 ${
          searchFocused ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5"
        } border rounded-lg px-3 py-2 group`}>
          <Search className={`w-4 h-4 transition-colors duration-300 ${
            searchFocused ? "text-cyan-400" : "text-zinc-500"
          }`} />
          <input
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-zinc-600 font-mono"
            placeholder="Search repositories, commits, or issues..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchFocused && (
            <kbd className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* RIGHT - ACTIONS */}
      <div className="flex items-center gap-2">
        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] text-emerald-400/70 font-mono tracking-wider">SYSTEM OK</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#050505] animate-pulse" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
        >
          <Terminal className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>

        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-cyan-400/50 transition-all duration-300">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaVDXER3Tnc5juAuAyhfmdZwrbBjSoOl15g2EZ0bjGvYaz1GbhjryYUA-BcUJyVJD222ZLkRzjDLNkZqpvawMLv85fHHLQa5CHL3VL2RjVuvLYs5sC_7hJY2aqnhbhmZp7oswOpyqCCD4zwWthDSor6BW5cdXKKX2egRbv4fBvcmoJUjMKrODLjIk23SBbsS6BSrGojim89K-kanqTgG0gDw1QqMAVrDcelteOzjxvJVEphqgtZpgcQYWipGNBQSIJMbV5b2O3pJ-_"
                alt="Profile"
                className="w-full h-full object-cover"
                width={32}
                height={32}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-300 ${
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
                className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
              >
                {/* User Info */}
                <div className="p-4 border-b border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaVDXER3Tnc5juAuAyhfmdZwrbBjSoOl15g2EZ0bjGvYaz1GbhjryYUA-BcUJyVJD222ZLkRzjDLNkZqpvawMLv85fHHLQa5CHL3VL2RjVuvLYs5sC_7hJY2aqnhbhmZp7oswOpyqCCD4zwWthDSor6BW5cdXKKX2egRbv4fBvcmoJUjMKrODLjIk23SBbsS6BSrGojim89K-kanqTgG0gDw1QqMAVrDcelteOzjxvJVEphqgtZpgcQYWipGNBQSIJMbV5b2O3pJ-_"
                        alt="Profile"
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{displayName}</p>
                      <p className="text-zinc-400 text-xs">{displayEmail}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400/70 font-mono">Pro Plan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items - Only Dashboard and Logout */}
                <div className="p-2">
                  <MenuItem
                    icon={User}
                    label="Dashboard"
                    onClick={() => router.push("/dashboard")}
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Logout */}
                <div className="p-2">
                  <MenuItem
                    icon={LogOut}
                    label="Logout"
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-300 ${className}`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm">{label}</span>
  </motion.button>
);