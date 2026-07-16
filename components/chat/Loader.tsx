"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, GitBranch, Cpu, Shield } from "lucide-react";

const loadingSteps = [
  { icon: GitBranch, label: "Scanning repository structure", progress: 20 },
  { icon: Cpu, label: "Analyzing code quality", progress: 40 },
  { icon: Shield, label: "Security audit in progress", progress: 60 },
  { icon: Zap, label: "Mapping dependencies", progress: 80 },
  { icon: Sparkles, label: "Generating insights", progress: 95 },
];

export default function AnalysisLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Animate loading steps
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < loadingSteps.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        setProgress(loadingSteps[stepIndex].progress);
      }
    }, 1800);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    // Animated dots
    const dotInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(dotInterval);
  }, []);

  const CurrentIcon = loadingSteps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/5 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Icon Container */}
        <div className="relative mb-8">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl animate-pulse" />
          
          {/* Rotating ring */}
          <svg className="absolute inset-0 w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(168,85,247,0.1)"
              strokeWidth="2"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#purpleGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="351.86"
              strokeDashoffset={351.86 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Icon */}
          <div className="relative w-32 h-32 rounded-full border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent backdrop-blur-xl flex items-center justify-center group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/5 to-transparent" />
            <div className="relative">
              <CurrentIcon className="w-12 h-12 text-purple-400 animate-pulse" />
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-purple-400/40 animate-ping" />
          <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-cyan-400/40 animate-ping delay-300" />
          <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 rounded-full bg-purple-500/30 animate-ping delay-700" />
          <div className="absolute top-1/3 -left-4 w-1.5 h-1.5 rounded-full bg-cyan-500/30 animate-ping delay-500" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Analyzing Repository
        </h2>

        {/* Current Step */}
        <div className="mt-4 flex items-center gap-2">
          <p className="text-sm text-zinc-400">
            {loadingSteps[currentStep].label}
            <span className="text-purple-400">{dots}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full space-y-2">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Glow on progress bar */}
            <div
              className="absolute top-0 h-full rounded-full bg-purple-500/50 blur-sm transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress percentage */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-mono">
              {progress}%
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">
              {currentStep + 1}/{loadingSteps.length}
            </span>
          </div>
        </div>

        {/* Status Steps */}
        <div className="mt-8 flex items-center gap-4">
          {loadingSteps.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 transition-all duration-500 ${
                idx <= currentStep ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  idx <= currentStep ? "bg-purple-400" : "bg-zinc-600"
                } ${idx === currentStep ? "scale-150 shadow-[0_0_12px_rgba(168,85,247,0.4)]" : ""}`}
              />
              {idx < loadingSteps.length - 1 && (
                <div
                  className={`w-4 h-px transition-all duration-500 ${
                    idx < currentStep ? "bg-purple-500/30" : "bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ETA / Status */}
        <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          <span className="h-px w-6 bg-zinc-700" />
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
            Processing
          </span>
          <span className="h-px w-6 bg-zinc-700" />
        </div>

        {/* Estimated time */}
        <p className="mt-2 text-[10px] text-zinc-600 font-mono tracking-wider">
          ~{Math.round((loadingSteps.length - currentStep) * 1.5)}s remaining
        </p>
      </div>
    </div>
  );
}