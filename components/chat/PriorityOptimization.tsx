'use client';

import {
  Zap,
  ChevronRight,
  Shield,
  Building2,
  TestTube2,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface PriorityOptimizationProps {
  nextSteps: string[];
}

const getIconForStep = (step: string) => {
  const lowerStep = step.toLowerCase();

  if (lowerStep.includes('security') || lowerStep.includes('🔒')) return <Shield size={20} />;
  if (lowerStep.includes('architecture') || lowerStep.includes('🏗')) return <Building2 size={20} />;
  if (lowerStep.includes('testing') || lowerStep.includes('🧪')) return <TestTube2 size={20} />;
  if (lowerStep.includes('critical') || lowerStep.includes('⚠')) return <AlertCircle size={20} />;
  if (lowerStep.includes('improve') || lowerStep.includes('📈')) return <Lightbulb size={20} />;
  if (lowerStep.includes('fix')) return <CheckCircle size={20} />;

  return <Zap size={20} />;
};

const getPriorityColor = (step: string): { bg: string; border: string; icon: string; text: string } => {
  const lowerStep = step.toLowerCase();

  if (lowerStep.includes('critical') || lowerStep.startsWith('🔒')) {
    return {
      bg: 'bg-red-500/5 hover:bg-red-500/10',
      border: 'border-red-500/20 hover:border-red-500/40',
      icon: 'text-red-400',
      text: 'text-red-300',
    };
  }

  if (lowerStep.includes('security') || lowerStep.includes('⚠')) {
    return {
      bg: 'bg-orange-500/5 hover:bg-orange-500/10',
      border: 'border-orange-500/20 hover:border-orange-500/40',
      icon: 'text-orange-400',
      text: 'text-orange-300',
    };
  }

  if (lowerStep.includes('architecture') || lowerStep.includes('🏗')) {
    return {
      bg: 'bg-cyan-500/5 hover:bg-cyan-500/10',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      icon: 'text-cyan-400',
      text: 'text-cyan-300',
    };
  }

  if (lowerStep.includes('testing') || lowerStep.includes('🧪')) {
    return {
      bg: 'bg-purple-500/5 hover:bg-purple-500/10',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      icon: 'text-purple-400',
      text: 'text-purple-300',
    };
  }

  return {
    bg: 'bg-blue-500/5 hover:bg-blue-500/10',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    icon: 'text-blue-400',
    text: 'text-blue-300',
  };
};

export default function PriorityOptimization({ nextSteps }: PriorityOptimizationProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="col-span-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.03] to-transparent backdrop-blur-xl md:col-span-6 overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
            Priority Optimization
          </h3>
          <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
        </div>

        <div className="space-y-3">
          {nextSteps.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-zinc-400">
                No priority optimizations identified. Your project is in excellent shape! 🎉
              </p>
            </div>
          ) : (
            nextSteps.map((step, index) => {
              const colors = getPriorityColor(step);
              const isHovered = hoveredIndex === index;
              const icon = getIconForStep(step);

              return (
                <button
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group relative w-full flex items-center justify-between rounded-2xl border transition-all duration-300 overflow-hidden
                    ${colors.bg} ${colors.border}
                    ${isHovered ? 'translate-x-1' : 'translate-x-0'}
                  `}
                  style={{
                    animation: mounted ? `slideInLeft 0.5s ease-out ${index * 80}ms forwards` : 'none',
                    opacity: mounted ? 1 : 0,
                  }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative flex items-center gap-4 flex-1 p-4">
                    <div className={`flex-shrink-0 ${colors.icon} transition-all duration-300 ${isHovered ? 'scale-110 -translate-y-0.5' : 'scale-100'}`}>
                      {icon}
                    </div>

                    <span className={`text-sm font-medium text-left leading-relaxed ${colors.text} transition-colors duration-300`}>
                      {step}
                    </span>
                  </div>

                  <div className="relative flex-shrink-0 pr-4">
                    <ChevronRight
                      size={20}
                      className={`text-zinc-600 transition-all duration-300 ${isHovered ? 'translate-x-1 text-white' : 'translate-x-0'}`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}