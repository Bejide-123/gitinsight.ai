"use client";

import { Search, Bell, Terminal, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function ChatHeader() {
  return (
    <header className="w-full h-16 border-b border-white/10 bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-8">
      
      {/* SEARCH */}
      <div className="flex items-center gap-4">
        <Search className="w-5 h-5 text-zinc-500" />
        <input
          className="bg-transparent border-none outline-none text-sm text-white w-64 placeholder:text-zinc-600"
          placeholder="Search Repository..."
        />
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-6">
        <Bell className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
        <Terminal className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
        <HelpCircle className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />

        {/* avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaVDXER3Tnc5juAuAyhfmdZwrbBjSoOl15g2EZ0bjGvYaz1GbhjryYUA-BcUJyVJD222ZLkRzjDLNkZqpvawMLv85fHHLQa5CHL3VL2RjVuvLYs5sC_7hJY2aqnhbhmZp7oswOpyqCCD4zwWthDSor6BW5cdXKKX2egRbv4fBvcmoJUjMKrODLjIk23SBbsS6BSrGojim89K-kanqTgG0gDw1QqMAVrDcelteOzjxvJVEphqgtZpgcQYWipGNBQSIJMbV5b2O3pJ-_"
            alt="profile"
            className="w-full h-full object-cover"
            width={32}
            height={32}
          />
        </div>
      </div>
    </header>
  );
}