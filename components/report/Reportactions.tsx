"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Download, Share2, Sparkles } from "lucide-react";
import type { Analysis, Issue, IssueSeverity } from "@/types/analysis";

type ExportableAnalysis = Omit<Analysis, "analyzedAt"> & { analyzedAt: Date | string };

interface ReportActionsProps {
  analysis: ExportableAnalysis;
  compact?: boolean;
}

const severityOrder: IssueSeverity[] = ["critical", "high", "medium", "low"];

const severityColors: Record<IssueSeverity, [number, number, number]> = {
  critical: [190, 45, 54],
  high: [210, 92, 40],
  medium: [191, 131, 30],
  low: [69, 117, 168],
};

function normalizeText(text: string | undefined | null): string {
  return (text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function collectIssues(
  analysis: Pick<Analysis, "categoryScores" | "dangerousIssues" | "missingImprovements">
): Issue[] {
  const categories = Object.values(analysis.categoryScores || {});
  const issues = [
    ...(analysis.dangerousIssues || []),
    ...(analysis.missingImprovements || []),
    ...categories.flatMap((category) => category?.issues || []),
  ];
  const unique = new Map<string, Issue>();

  for (const issue of issues) {
    const key = [
      issue.category,
      issue.title,
      issue.severity,
      issue.file || "",
      issue.lineNumber ?? "",
    ].join("::").toLowerCase();
    if (!unique.has(key)) unique.set(key, issue);
  }

  return Array.from(unique.values()).sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );
}

function safeFilename(repoName: string): string {
  return (repoName || "repository")
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || "repository";
}

export default function ReportActions({ analysis, compact = false }: ReportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 17;
      const contentWidth = pageWidth - margin * 2;
      const bottomLimit = pageHeight - 20;
      let cursorY = margin;

      const addPageIfNeeded = (height: number) => {
        if (cursorY + height > bottomLimit) {
          doc.addPage();
          cursorY = margin;
        }
      };

      const addBody = (
        text: string,
        options: { size?: number; color?: [number, number, number]; lineHeight?: number } = {}
      ) => {
        const cleanText = normalizeText(text);
        if (!cleanText) return;
        const { size = 10, color = [55, 65, 81], lineHeight = 5.2 } = options;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(size);
        doc.setTextColor(...color);

        for (const paragraph of cleanText.split("\n")) {
          if (!paragraph) {
            cursorY += lineHeight * 0.6;
            continue;
          }
          const lines = doc.splitTextToSize(paragraph, contentWidth);
          for (const line of lines) {
            addPageIfNeeded(lineHeight);
            doc.text(line, margin, cursorY);
            cursorY += lineHeight;
          }
        }
        cursorY += 2;
      };

      const addSection = (title: string) => {
        addPageIfNeeded(13);
        cursorY += 3;
        doc.setFillColor(239, 246, 255);
        doc.roundedRect(margin - 1, cursorY - 5, contentWidth + 2, 9, 1.5, 1.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 54, 76);
        doc.text(title, margin + 1, cursorY + 1);
        cursorY += 10;
      };

      const addLabel = (label: string, value: string) => {
        addPageIfNeeded(6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(75, 85, 99);
        doc.text(`${label}:`, margin, cursorY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(31, 41, 55);
        const labelWidth = doc.getTextWidth(`${label}: `);
        const lines = doc.splitTextToSize(value || "Not available", contentWidth - labelWidth);
        doc.text(lines[0] || "Not available", margin + labelWidth, cursorY);
        cursorY += Math.max(5, lines.length * 4.5);
        for (const line of lines.slice(1)) {
          addPageIfNeeded(4.5);
          doc.text(line, margin + labelWidth, cursorY);
          cursorY += 4.5;
        }
      };

      const safeRepo = normalizeText(analysis.repoName) || "Repository";
      const reportDate = new Date(analysis.analyzedAt);
      const analyzedAt = Number.isNaN(reportDate.getTime())
        ? "Date unavailable"
        : reportDate.toLocaleString();
      const generatedAt = new Date().toLocaleString();
      const commitSha = analysis.commitSha?.trim();
      const issues = collectIssues(analysis);
      const recommendations = analysis.aiInsights?.recommendations || [];
      const executiveSummary = normalizeText(analysis.aiInsights?.executiveSummary) ||
        `This audit reviews ${safeRepo} across repository maturity, security, architecture, testing, maintainability, and production readiness. Use the findings and prioritized actions below to guide further engineering review.`;
      const categoryScores = Object.entries(analysis.categoryScores || {})
        .filter((entry): entry is [string, NonNullable<(typeof entry)[1]>] => Boolean(entry[1]))
        .sort(([a], [b]) => a.localeCompare(b));

      doc.setProperties({
        title: `${safeRepo} - GitInsight Audit Report`,
        subject: "GitHub repository engineering audit",
        author: "GitInsight",
        creator: "GitInsight",
      });

      doc.setFillColor(9, 16, 29);
      doc.rect(0, 0, pageWidth, 54, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(103, 232, 249);
      doc.text("G I T I N S I G H T   /   ENGINEERING AUDIT", margin, 16);
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text(doc.splitTextToSize(safeRepo, contentWidth), margin, 29);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text("Repository analysis report", margin, 43);
      cursorY = 64;

      doc.setFillColor(240, 249, 255);
      doc.roundedRect(margin, cursorY, contentWidth, 26, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 54, 76);
      doc.text(`${Number.isFinite(analysis.maturityScore) ? analysis.maturityScore : 0}`, margin + 5, cursorY + 12);
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text("/ 100  OVERALL REPOSITORY SCORE", margin + 5, cursorY + 20);
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);
      doc.text(`${analysis.level || "Maturity level unavailable"} · ${analysis.isProductionReady ? "Production ready" : "Not production ready"}`, margin + 68, cursorY + 11);
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text(`Report generated: ${generatedAt}`, margin + 68, cursorY + 19);
      cursorY += 34;

      addSection("Executive Summary");
      addBody(executiveSummary);

      addSection("Repository Details");
      addLabel("Repository", safeRepo);
      addLabel("URL", analysis.repoUrl || "Not available");
      addLabel("Analysis date", analyzedAt);
      addLabel("Report generated", generatedAt);
      addLabel("Commit SHA", commitSha || "Not available");
      if (analysis.branch) addLabel("Branch", analysis.branch);
      if (analysis.commitMessage) addLabel("Commit message", normalizeText(analysis.commitMessage));
      if (analysis.projectContext?.intent) {
        addLabel("Detected project intent", analysis.projectContext.intent.replace(/-/g, " "));
      }

      if (categoryScores.length > 0) {
        addSection("Repository Score Breakdown");
        for (const [category, score] of categoryScores) {
          addLabel(category.replace(/([A-Z])/g, " $1").replace(/^\w/, (letter) => letter.toUpperCase()), `${score.score}/100`);
        }
      }

      addSection("Findings by Severity");
      if (issues.length === 0) {
        addBody("No findings were reported by this analysis.");
      } else {
        for (const severity of severityOrder) {
          const severityIssues = issues.filter((issue) => issue.severity === severity);
          if (severityIssues.length === 0) continue;

          addPageIfNeeded(12);
          const [red, green, blue] = severityColors[severity];
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(red, green, blue);
          doc.text(`${severity.toUpperCase()} (${severityIssues.length})`, margin, cursorY);
          cursorY += 7;

          for (const issue of severityIssues) {
            addPageIfNeeded(28);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(31, 41, 55);
            const titleLines = doc.splitTextToSize(issue.title, contentWidth);
            doc.text(titleLines, margin, cursorY);
            cursorY += titleLines.length * 4.8 + 1;

            addBody(`Category: ${issue.category || "Uncategorized"}`, { size: 8, color: [107, 114, 128], lineHeight: 4.2 });
            addBody(`Affected file: ${issue.file ? `${issue.file}${issue.lineNumber ? `:${issue.lineNumber}` : ""}` : "Not specified"}`, { size: 9 });
            addBody(`Description: ${issue.description || "No description provided."}`);
            if (issue.impact) addBody(`Impact: ${issue.impact}`);
            addBody(`Evidence:\n${issue.evidence?.length ? issue.evidence.map((item) => `• ${item}`).join("\n") : "No code evidence was attached to this finding."}`, {
              size: 9,
              color: [75, 85, 99],
            });
            addBody(`Recommendation / suggested fix:\n${issue.recommendation || "No specific remediation was provided; investigate the finding and define an appropriate fix."}`, {
              size: 9,
              color: [31, 41, 55],
            });
            cursorY += 3;
          }
        }
      }

      addSection("Prioritized Remediation Plan");
      const remediation: { priority: string; title: string; detail?: string }[] = [];
      const seenRemediation = new Set<string>();
      const addRemediation = (priority: string, title: string, detail?: string) => {
        const normalizedTitle = normalizeText(title);
        const key = normalizedTitle.toLowerCase();
        if (!normalizedTitle || seenRemediation.has(key)) return;
        seenRemediation.add(key);
        remediation.push({ priority, title: normalizedTitle, detail: normalizeText(detail) });
      };

      (analysis.criticalBlockers || []).forEach((item) => addRemediation("P0 · BLOCKER", item));
      [...recommendations]
        .sort((a, b) => a.priority - b.priority || b.impactScore - a.impactScore)
        .forEach((item) => addRemediation(`P${item.priority}`, item.title, item.description));
      (analysis.nextSteps || []).forEach((item, index) => addRemediation(`P${Math.min(index + 1, 3)}`, item));

      if (remediation.length === 0) {
        addBody("No remediation steps were supplied by this analysis.");
      } else {
        remediation.forEach((item, index) => {
          addPageIfNeeded(13);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(15, 54, 76);
          doc.text(`${String(index + 1).padStart(2, "0")}  ${item.priority}`, margin, cursorY);
          cursorY += 5;
          addBody(item.title, { size: 10, color: [31, 41, 55] });
          if (item.detail) addBody(item.detail, { size: 9, color: [75, 85, 99] });
        });
      }

      if (analysis.criticalBlockers?.length) {
        addSection("Critical Blockers");
        analysis.criticalBlockers.forEach((blocker) => addBody(`• ${blocker}`, { color: [153, 27, 27] }));
      }

      if (analysis.strengths?.length) {
        addSection("Strengths");
        analysis.strengths.forEach((strength) => addBody(`• ${strength}`));
      }

      for (let page = 1; page <= doc.getNumberOfPages(); page++) {
        doc.setPage(page);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text("GitInsight · Repository audit", margin, pageHeight - 8);
        doc.text(`${page} / ${doc.getNumberOfPages()}`, pageWidth - margin, pageHeight - 8, { align: "right" });
      }

      doc.save(`${safeFilename(safeRepo)}-audit-report.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      setExportError("Could not generate the PDF report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${analysis.repoName} - GitInsight Analysis Report`,
          text: "Check out this repository analysis report",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      setIsShared(true);
      setTimeout(() => setIsShared(false), 3000);
    } catch (error) {
      console.error("Failed to share report:", error);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={isExporting}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-cyan-100/20 bg-cyan-100/[0.07] px-3.5 py-2.5 text-xs font-medium text-cyan-50 transition hover:border-cyan-100/35 hover:bg-cyan-100/[0.12] disabled:cursor-wait disabled:opacity-60"
        >
          <Download className={`h-3.5 w-3.5 ${isExporting ? "animate-bounce" : ""}`} />
          {isExporting ? "Generating PDF..." : "Download report"}
        </button>
        {exportError && <p role="alert" className="max-w-48 text-right text-[10px] text-rose-300">{exportError}</p>}
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-white/5 pt-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative h-2 w-2 rounded-full bg-emerald-400">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />
            </span>
            <span className="text-xs font-medium text-zinc-400">Report Ready</span>
          </div>
          <span className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="h-3 w-3 text-zinc-600" />
            <span>Updated {new Date(analysis.analyzedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${
              isShared
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isShared ? <CheckCircle2 size={15} /> : <Share2 size={15} />}
            {isShared ? "Shared" : "Share"}
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-100/20 bg-cyan-100/[0.07] px-4 py-2.5 text-sm text-cyan-50 transition hover:bg-cyan-100/[0.12] disabled:cursor-wait disabled:opacity-60"
          >
            <Download className={`h-4 w-4 ${isExporting ? "animate-bounce" : ""}`} />
            {isExporting ? "Generating..." : "Download report"}
          </button>
        </div>
      </div>
      {exportError && <p role="alert" className="mt-3 text-right text-xs text-rose-300">{exportError}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-2.5 w-2.5 text-cyan-200" />
          Repository audit report
        </span>
        <span className="h-3 w-px bg-white/10" />
        <span>{analysis.repoName}</span>
      </div>
    </div>
  );
}
