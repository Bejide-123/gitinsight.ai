"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
    <footer className="bg-[#050505] border-t border-white/10 w-screen shadow-[0_-20px_60px_rgba(0,0,0,0.8)]">
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
            <h2 className="text-2xl tracking-[0.3em] text-white mb-6">
              GITINSIGHT AI
            </h2>

            <p className="text-white/60 max-w-xs leading-relaxed mb-8">
              Engineering intelligence for the modern stack. Autonomous analysis for high-performance teams.
            </p>

            {/* NEWSLETTER */}
            <div className="space-y-4">
              <p className="text-[10px] tracking-widest text-white/40 uppercase">
                Subscribe to updates
              </p>

              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-white/5 border border-white/10 text-white px-4 py-2 w-full focus:outline-none focus:border-cyan-500/50 placeholder:text-white/20 rounded-l"
                />
                <button className="bg-white text-black text-[10px] px-4 py-2 hover:bg-cyan-400 transition-all rounded-r uppercase tracking-widest">
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
              <h4 className="text-xs mb-6 tracking-widest uppercase text-white">
                {group.title}
              </h4>

              <ul className="space-y-4">
                {group.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href="#"
                      className="text-white/60 hover:text-cyan-300 transition-colors duration-300"
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
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 pb-0 border-t border-white/5 gap-8">

          {/* ICONS */}
          <div className="flex items-center gap-6 text-white/40">
            {["terminal", "share", "hub"].map((icon, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.2, color: "#22d3ee" }}
                className="material-symbols-outlined cursor-pointer transition-colors"
              >
                {icon}
              </motion.span>
            ))}
          </div>

          {/* STATUS + COPYRIGHT */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[10px] tracking-widest text-white/40 uppercase">
                All Systems Operational
              </span>
            </div>

            <div className="text-[10px] tracking-widest uppercase text-white/20">
              © {new Date().getFullYear()} GITINSIGHT AI. PRECISION ENGINEERING FOR THE MODERN STACK.
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}