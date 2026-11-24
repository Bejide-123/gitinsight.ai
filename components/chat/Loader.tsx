"use client";

import { useEffect, useState } from "react";
import { Sparkles, Zap, GitBranch, Cpu, Shield } from "lucide-react";

const loadingSteps = [
  { icon: GitBranch, label: "Scanning repository structure", progress: 20 },
  { icon: Cpu, label: "Analyzing code quality & architecture", progress: 40 },
  { icon: Shield, label: "Running security & vulnerability audit", progress: 60 },
  { icon: Zap, label: "Evaluating test coverage & readiness", progress: 80 },
  { icon: Sparkles, label: "Synthesizing engineering scorecard", progress: 95 },
];

export default function AnalysisLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080b] overflow-hidden">
      {/* Subtle grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Icon & Progress Circle */}
        <div className="relative mb-8">
          <svg className="w-32 h-32 -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2.5"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="351.86"
              strokeDashoffset={351.86 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Icon */}
          <div className="absolute inset-2 rounded-full border border-white/10 bg-[#0c0f16] flex items-center justify-center shadow-xl">
            <CurrentIcon className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Analyzing Repository
        </h2>

        {/* Current Step Label */}
        <p className="mt-2 text-xs text-zinc-400 font-mono">
          {loadingSteps[currentStep].label}
          <span className="text-white">{dots}</span>
        </p>

        {/* Progress Bar */}
        <div className="mt-8 w-full space-y-2">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>{progress}%</span>
            <span>{currentStep + 1} / {loadingSteps.length}</span>
          </div>
        </div>

        {/* Step Dots */}
        <div className="mt-6 flex items-center gap-3">
          {loadingSteps.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-1.5 transition-all duration-500 ${
                idx <= currentStep ? "opacity-100" : "opacity-30"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  idx <= currentStep ? "bg-white" : "bg-zinc-700"
                }`}
              />
              {idx < loadingSteps.length - 1 && (
                <div
                  className={`w-3 h-px ${
                    idx < currentStep ? "bg-white/40" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
          ~{Math.max(1, Math.round((loadingSteps.length - currentStep) * 1.5))}s remaining
        </p>
      </div>
    </div>
  );
}
