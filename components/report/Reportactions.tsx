"use client";

import { Download, Share2, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ReportActionsProps {
  repoName: string;
  analyzedAt: Date;
}

export default function ReportActions({ repoName, analyzedAt }: ReportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleExportPDF = async () => {
    const element = document.querySelector("section");
    if (!element) return;

    setIsExporting(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const options = {
        margin: 10,
        filename: `${repoName}-report.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          orientation: "portrait" as const,
          unit: "mm" as const,
          format: "a4" as const,
        },
      };

      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${repoName} - GitInsight Analysis Report`,
        text: "Check out this repository analysis report",
        url: window.location.href,
      });
      setIsShared(true);
      setTimeout(() => setIsShared(false), 3000);
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 3000);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-white/5">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Left side - Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400/50 animate-ping" />
            </div>
            <span className="text-xs font-medium text-zinc-400">Report Ready</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock size={12} className="text-zinc-600" />
            <span>Updated {new Date(analyzedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className={`group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 active:scale-95 overflow-hidden ${
              isShared
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <Share2 size={15} className="relative" />
            <span className="relative text-sm font-medium">
              {isShared ? "Copied!" : "Share"}
            </span>
            {isShared && (
              <CheckCircle2 size={14} className="relative text-emerald-400" />
            )}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`group relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border transition-all duration-300 active:scale-95 overflow-hidden ${
              isExporting
                ? "border-purple-500/30 bg-purple-500/10 text-purple-400 cursor-wait"
                : "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            }`}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                <span className="relative text-sm font-medium">Generating...</span>
              </>
            ) : (
              <>
                <Download size={15} className="relative" />
                <span className="relative text-sm font-medium">Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Sparkles size={10} className="text-purple-400" />
          AI-generated report
        </span>
        <span className="w-px h-3 bg-white/10" />
        <span>Last analyzed on {new Date(analyzedAt).toLocaleDateString()} at {new Date(analyzedAt).toLocaleTimeString()}</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          {repoName}
        </span>
      </div>
    </div>
  );
}