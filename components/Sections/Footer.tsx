"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
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
    <footer className="bg-gradient-to-b from-[#050505] to-[#020202] border-t border-white/5 w-screen">
      <div className="max-w-[1280px] mx-auto px-8 pt-24 pb-6">

        {/* TOP GRID */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20"
        >

          {/* BRAND */}
          <motion.div variants={item} className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white/60" />
              </div>
              <h2 className="text-2xl tracking-[0.1em] text-white font-light">
                GITINSIGHT<span className="font-bold">AI</span>
              </h2>
            </div>

            <p className="text-white/40 max-w-xs leading-relaxed mb-8 text-sm">
              Engineering intelligence for the modern stack. Autonomous analysis for high-performance teams.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mb-8">
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.05 }}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <FaGithub className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.05 }}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <FaTwitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.05 }}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -2, scale: 1.05 }}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-300"
              >
                <FaYoutube className="w-4 h-4" />
              </motion.a>
            </div>

            {/* NEWSLETTER */}
            <div className="space-y-4">
              <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium">
                Subscribe to updates
              </p>

              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/5 border border-white/10 text-white px-4 py-2.5 w-full focus:outline-none focus:border-white/30 focus:bg-white/10 placeholder:text-white/20 rounded-l-lg transition-all duration-300"
                />
                <button className="bg-white text-black text-[10px] px-5 py-2.5 hover:bg-white/90 transition-all rounded-r-lg uppercase tracking-widest font-medium">
                  Join
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
              <h4 className="text-xs mb-6 tracking-[0.2em] uppercase text-white/60 font-medium">
                {group.title}
              </h4>

              <ul className="space-y-3.5">
                {group.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href="#"
                      className="text-white/40 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">

          {/* ICONS - Using react-icons/fa */}
          <div className="flex items-center gap-6 text-white/30">
            <motion.div
              whileHover={{ scale: 1.2, color: "#22d3ee" }}
              className="cursor-pointer transition-all duration-300"
            >
              <FaTerminal className="w-5 h-5" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, color: "#22d3ee" }}
              className="cursor-pointer transition-all duration-300"
            >
              <FaShareAlt className="w-5 h-5" />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, color: "#22d3ee" }}
              className="cursor-pointer transition-all duration-300"
            >
              <FaHubspot className="w-5 h-5" />
            </motion.div>
          </div>

          {/* STATUS + COPYRIGHT */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-medium">
                All Systems Operational
              </span>
            </div>

            <div className="text-[10px] tracking-[0.2em] uppercase text-white/20">
              © {new Date().getFullYear()} GITINSIGHT AI. Precision Engineering for the Modern Stack.
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}