"use client";

import { Download, Share2, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Analysis } from "@/types/analysis";

interface ReportActionsProps {
  analysis: Omit<Analysis, "analyzedAt"> & { analyzedAt: string };
}

function parseLabColor(labText: string): string {
  const normalized = labText.trim().replace(/\s+/g, " ");
  const [value, alphaPart] = normalized.split("/").map((part) => part.trim());
  const parts = value.replace(/lab\(|\)/g, "").trim().split(/\s+/);
  if (parts.length < 3) return labText;

  const l = parts[0].endsWith("%") ? parseFloat(parts[0]) : parseFloat(parts[0]);
  const a = parseFloat(parts[1]);
  const b = parseFloat(parts[2]);
  const alpha = alphaPart ? parseFloat(alphaPart) : 1;

  const xyz = labToXyz(l, a, b);
  const rgb = xyzToRgb(xyz.x, xyz.y, xyz.z);
  const clamped = rgb.map((value) => Math.round(Math.max(0, Math.min(255, value))));

  return `rgba(${clamped[0]}, ${clamped[1]}, ${clamped[2]}, ${alpha})`;
}

function parseOklabColor(oklabText: string): string {
  const normalized = oklabText.trim().replace(/\s+/g, " ");
  const [value, alphaPart] = normalized.split("/").map((part) => part.trim());
  const parts = value.replace(/oklab\(|\)/g, "").trim().split(/\s+/);
  if (parts.length < 3) return oklabText;

  const l = parts[0].endsWith("%") ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
  const a = parseFloat(parts[1]);
  const b = parseFloat(parts[2]);
  const alpha = alphaPart ? parseFloat(alphaPart) : 1;

  const [r, g, bVal] = oklabToSrgb(l, a, b);
  const clamped = [r, g, bVal].map((value) => Math.round(Math.max(0, Math.min(255, value))));

  return `rgba(${clamped[0]}, ${clamped[1]}, ${clamped[2]}, ${alpha})`;
}

function labToXyz(l: number, a: number, b: number) {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = fx ** 3 > 0.008856 ? fx ** 3 : (fx - 16 / 116) / 7.787;
  const yr = fy ** 3 > 0.008856 ? fy ** 3 : (fy - 16 / 116) / 7.787;
  const zr = fz ** 3 > 0.008856 ? fz ** 3 : (fz - 16 / 116) / 7.787;

  return {
    x: xr * 0.95047,
    y: yr * 1.0,
    z: zr * 1.08883,
  };
}

function oklabToSrgb(L: number, a: number, b: number) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bVal = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [r, g, bVal].map((channel) => {
    const clamped = Math.max(0, Math.min(1, channel));
    return (clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055) * 255;
  });
}

function xyzToRgb(x: number, y: number, z: number) {
  const r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  return [r, g, b].map((channel) => {
    const linear = channel <= 0.0031308 ? 12.92 * channel : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
    return linear * 255;
  });
}

function normalizeCssValue(value: string): string {
  return value.replace(/(?:lab|oklab)\([^\)]+\)/g, (match) => {
    try {
      if (match.startsWith("oklab(")) {
        return parseOklabColor(match);
      }
      return parseLabColor(match);
    } catch {
      return match;
    }
  });
}

function copyComputedStyles(source: HTMLElement, target: HTMLElement) {
  const computedStyle = window.getComputedStyle(source);

  for (let i = 0; i < computedStyle.length; i++) {
    const property = computedStyle.item(i);
    if (!property) continue;

    let value = computedStyle.getPropertyValue(property);
    if (!value) continue;

    const priority = computedStyle.getPropertyPriority(property);

    if (property === "background-image" && /url\(/.test(value)) {
      value = "none";
    }

    if (property === "background" && /url\(/.test(value)) {
      value = "none";
    }

    if (property === "mask-image" && /url\(/.test(value)) {
      value = "none";
    }

    if (property === "border-image-source" && /url\(/.test(value)) {
      value = "none";
    }

    if (property === "list-style-image" && /url\(/.test(value)) {
      value = "none";
    }

    value = normalizeCssValue(value);
    target.style.setProperty(property, value, priority);
  }
}

function removeCanvasElements(root: HTMLElement) {
  root.querySelectorAll("canvas").forEach((canvas) => canvas.remove());
}

function removeBackgroundImages(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.style.backgroundImage = "none";
    el.style.background = "none";
    el.style.maskImage = "none";
    el.style.borderImageSource = "none";
    el.style.listStyleImage = "none";
  });
}

function cloneNodeWithInlineStyles(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  const sourceElements = [source, ...Array.from(source.querySelectorAll<HTMLElement>("*"))];
  const cloneElements = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];

  sourceElements.forEach((sourceEl, index) => {
    const cloneEl = cloneElements[index];
    if (!cloneEl) return;

    copyComputedStyles(sourceEl, cloneEl);

    // Preserve size explicitly so the cloned tree renders at the same dimensions
    const computedStyle = window.getComputedStyle(sourceEl);
    cloneEl.style.width = computedStyle.width;
    cloneEl.style.height = computedStyle.height;
  });

  removeCanvasElements(clone);
  removeBackgroundImages(clone);
  return clone;
}

export default function ReportActions({ analysis }: ReportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const { jsPDF } = await import("jspdf");

      const normalizeText = (text: string) =>
        (text || "")
          .replace(/\r\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .replace(/[ \t]+/g, " ")
          .trim();

      const safeRepo = analysis.repoName || "Repository";
      const generatedAt = new Date(analysis.analyzedAt).toLocaleString();
      const executive =
        normalizeText(
          analysis.aiInsights?.executiveSummary?.trim() ||
            `The ${safeRepo} repository has been analyzed across architecture, security, performance, and engineering quality dimensions. Review the findings below for a structured summary of strengths, risks, and suggested next steps.`
        );

      const scoreSections = [
        { label: "Structure", score: analysis.categoryScores.architecture?.score ?? 0 },
        { label: "Completeness", score: analysis.categoryScores.completeness?.score ?? 0 },
        { label: "Readiness", score: analysis.categoryScores.readiness?.score ?? 0 },
        { label: "Maintainability", score: analysis.categoryScores.maintainability?.score ?? 0 },
        { label: "Security", score: analysis.categoryScores.security?.score ?? 0 },
        { label: "Testing", score: analysis.categoryScores.testing?.score ?? 0 },
      ];

      const formatScoreLine = ({ label, score }: { label: string; score: number }) => {
        const status = score >= 80 ? "GOOD" : score >= 60 ? "NEEDS WORK" : "NEEDS WORK";
        return `${label}: ${status} — ${score}%`;
      };

      const techStack = analysis.techStack?.length
        ? analysis.techStack.map((tech) => `• ${normalizeText(tech)}`).join("\n")
        : "No tech stack detected.";

      const capabilities = analysis.aiInsights?.capabilities?.length
        ? analysis.aiInsights.capabilities
            .map((cap) => `• ${normalizeText(`${cap.name} — ${cap.status}`)}`)
            .join("\n")
        : "No capabilities detected.";

      const issues = analysis.dangerousIssues?.length
        ? analysis.dangerousIssues
            .map((issue, index) =>
              normalizeText(
                `Issue ${index + 1}: ${issue.title}\nSeverity: ${issue.severity.toUpperCase()}\nCategory: ${issue.category}\nDescription: ${issue.description}\nRecommended Fix: ${issue.recommendation}`
              )
            )
            .join("\n\n")
        : "No vulnerability issues detected.";

      const recommendations = analysis.aiInsights?.recommendations?.length
        ? analysis.aiInsights.recommendations
            .map((rec, index) =>
              normalizeText(
                `Recommendation ${index + 1}: ${rec.title}\nImpact: ${rec.impact}\nDifficulty: ${rec.difficulty}%\nPriority: ${rec.priority}\n${rec.description}`
              )
            )
            .join("\n\n")
        : analysis.nextSteps?.length
        ? analysis.nextSteps
            .map((step, idx) => normalizeText(`Recommendation ${idx + 1}: ${step}`))
            .join("\n\n")
        : "No strategic recommendations available.";

      const roadmap = analysis.aiInsights?.roadmapPhases?.length
        ? analysis.aiInsights.roadmapPhases
            .map((phase) =>
              normalizeText(`Phase ${phase.number}: ${phase.title}\nStatus: ${phase.status}\n${phase.description}`)
            )
            .join("\n\n")
        : "No roadmap phases provided.";

      const strengths = analysis.aiInsights?.architecturalStrengths?.length
        ? analysis.aiInsights.architecturalStrengths.map((item) => `• ${normalizeText(item)}`).join("\n")
        : analysis.strengths?.length
        ? analysis.strengths.map((item) => `• ${normalizeText(item)}`).join("\n")
        : "No strengths listed.";

      const weaknesses = analysis.aiInsights?.criticalWeaknesses?.length
        ? analysis.aiInsights.criticalWeaknesses.map((item) => `• ${normalizeText(item)}`).join("\n")
        : analysis.dangerousIssues?.length
        ? analysis.dangerousIssues.slice(0, 5).map((item) => `• ${normalizeText(item.title)}`).join("\n")
        : "No weaknesses listed.";

      const projectOverview = [
        `Repository: ${safeRepo}`,
        `Detected intent: ${analysis.projectContext.intent}`,
        `Confidence: ${analysis.projectContext.confidence}%`,
        `Maturity score: ${analysis.maturityScore}%`,
        `Stage: ${analysis.level}`,
        `Production ready: ${analysis.isProductionReady ? "Yes" : "No"}`,
        analysis.selectedFilesCount ? `Files analyzed: ${analysis.selectedFilesCount}` : null,
      ]
        .filter((part): part is string => part !== null)
        .map(normalizeText)
        .join("\n");

      const productionVerdict = normalizeText(
        analysis.aiInsights?.productionVerdict ||
          "Further analysis needed to determine production readiness."
      );

      const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      const lineHeight = 7.5;
      let cursorY = margin;

      const addPageIfNeeded = (height: number) => {
        if (cursorY + height > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
      };

      const addText = (text: string, fontSize: number, fontStyle: "normal" | "bold" = "normal") => {
        const cleanText = normalizeText(text);
        doc.setFont("helvetica", fontStyle);
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(cleanText, contentWidth);
        const height = lines.length * lineHeight;
        addPageIfNeeded(height);
        doc.text(lines, margin, cursorY, { baseline: "top" });
        cursorY += height + 4;
      };

      const addSection = (title: string, body: string) => {
        addText(title, 14, "bold");
        addText(body, 11, "normal");
      };

      doc.setProperties({ title: `${safeRepo} Report` });
      addText(`Report for ${safeRepo}`, 18, "bold");
      addText(`Generated: ${generatedAt}`, 10, "normal");
      addText("—", 10, "normal");
      addSection("Executive Summary", executive);
      addSection("Project Overview", projectOverview);
      addSection("Engineering Dimensions", scoreSections.map(formatScoreLine).join("\n"));
      addSection("Tech Stack", techStack);
      addSection("Capabilities", capabilities);
      addSection("Production Readiness", productionVerdict);
      addSection("Vulnerability Findings", issues);
      addSection("Strategic Recommendations", recommendations);
      addSection("Roadmap", roadmap);
      addSection("Strengths", strengths);
      addSection("Weaknesses", weaknesses);

      doc.save(`${safeRepo}-report.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${analysis.repoName} - GitInsight Analysis Report`,
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
            <span>Updated {new Date(analysis.analyzedAt).toLocaleDateString()}</span>
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
        <span>Last analyzed on {new Date(analysis.analyzedAt).toLocaleDateString()} at {new Date(analysis.analyzedAt).toLocaleTimeString()}</span>
        <span className="w-px h-3 bg-white/10" />
        <span className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          {analysis.repoName}
        </span>
      </div>
    </div>
  );
}