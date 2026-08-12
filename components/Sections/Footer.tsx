"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedinIn, 
  FaYoutube,
  FaTerminal,
  FaShareAlt,
  FaHubspot
} from "react-icons/fa";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] border-t border-white/5 w-screen overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="max-w-[1280px] mx-auto px-8 pt-20 pb-8">

        {/* TOP GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16"
        >

          {/* BRAND */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl tracking-tight text-white font-bold">
                GitInsight<span className="text-purple-400">AI</span>
              </h2>
            </div>

            <p className="text-zinc-400 max-w-xs leading-relaxed mb-8 text-sm">
              Engineering intelligence for the modern stack. Autonomous analysis for high-performance teams.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mb-8">
              {[
                { icon: FaGithub, label: "GitHub" },
                { icon: FaTwitter, label: "Twitter" },
                { icon: FaLinkedinIn, label: "LinkedIn" },
                { icon: FaYoutube, label: "YouTube" },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300 group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </motion.a>
                );
              })}
            </div>

            {/* NEWSLETTER */}
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.15em] text-zinc-500 uppercase font-semibold">
                Subscribe to updates
              </p>

              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/5 border border-white/10 text-white px-4 py-2.5 w-full focus:outline-none focus:border-purple-500/30 focus:bg-white/10 placeholder:text-zinc-600 rounded-l-lg transition-all duration-300 text-sm"
                />
                <button className="group bg-purple-500 text-white text-[10px] px-5 py-2.5 hover:bg-purple-600 transition-all rounded-r-lg uppercase tracking-widest font-medium flex items-center gap-1.5 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  Join
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* LINKS */}
          {[
            {
              title: "Product",
              links: ["Features", "Integrations", "Changelog", "Roadmap"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "Press", "Contact"],
            },
            {
              title: "Resources",
              links: ["Documentation", "API Reference", "Community", "Security"],
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Cookie Policy"],
            },
          ].map((group, i) => (
            <motion.div key={i} variants={item}>
              <h4 className="text-[10px] mb-5 tracking-[0.15em] uppercase text-zinc-500 font-semibold">
                {group.title}
              </h4>

              <ul className="space-y-3">
                {group.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href="#"
                      className="text-zinc-400 hover:text-white transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-6" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* ICONS */}
          <div className="flex items-center gap-5 text-zinc-500">
            <motion.div
              whileHover={{ scale: 1.2, color: "#a855f7" }}
              className="cursor-pointer transition-all duration-300 hover:text-purple-400"
            >
              <FaTerminal className="w-4 h-4" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, color: "#a855f7" }}
              className="cursor-pointer transition-all duration-300 hover:text-purple-400"
            >
              <FaShareAlt className="w-4 h-4" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, color: "#a855f7" }}
              className="cursor-pointer transition-all duration-300 hover:text-purple-400"
            >
              <FaHubspot className="w-4 h-4" />
            </motion.div>
          </div>

          {/* STATUS + COPYRIGHT */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[9px] tracking-[0.15em] text-zinc-500 uppercase font-medium">
                All Systems Operational
              </span>
            </div>

            <div className="hidden md:block w-px h-4 bg-white/5" />

            <div className="flex items-center gap-2 text-[9px] tracking-[0.15em] text-zinc-500">
              <span>© {new Date().getFullYear()}</span>
              <span className="text-white/20">·</span>
              <span>GitInsight AI</span>
              <span className="text-white/20">·</span>
              <span className="text-zinc-600">Precision Engineering</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-purple-400/40" />
              <span className="text-[8px] tracking-[0.2em] text-zinc-600 uppercase font-mono">
                v2.4.0
              </span>
            </div>
          </div>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
      </div>
    </footer>
  );
}