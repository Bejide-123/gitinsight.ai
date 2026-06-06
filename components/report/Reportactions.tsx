"use client";

import { Download, Share2 } from "lucide-react";

interface ReportActionsProps {
  repoName: string;
  analyzedAt: Date;
}

export default function ReportActions({ repoName, analyzedAt }: ReportActionsProps) {
  const handleExportPDF = async () => {
    const element = document.querySelector("section");
    if (!element) return;

    // Dynamically import only on client, only when button is clicked
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

    html2pdf().set(options).from(element).save();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${repoName} - GitInsight Analysis Report`,
        text: "Check out this repository analysis report",
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      alert("Report link copied to clipboard");
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={handleShare}
          className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white text-zinc-950 font-semibold text-sm hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 active:scale-95"
        >
          <Share2 size={16} />
          Share Report
        </button>

        <button
          onClick={handleExportPDF}
          className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-zinc-900 text-white font-semibold text-sm hover:bg-black hover:border-white/20 hover:shadow-lg transition-all duration-300 active:scale-95"
        >
          <Download size={16} />
          Export as PDF
        </button>
      </div>

      <p className="text-xs text-zinc-600 text-center mt-4">
        Last analyzed on {new Date(analyzedAt).toLocaleDateString()} at{" "}
        {new Date(analyzedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}