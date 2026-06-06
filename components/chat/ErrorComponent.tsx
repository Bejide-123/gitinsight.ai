'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeft,
  Search,
  History,
  CircleHelp,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotFoundHero() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    // Avoid synchronous setState in effect to prevent cascading renders
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCardClick = (action: () => void) => {
    action();
  };

  const cards = [
    {
      icon: Search,
      title: 'Search Repos',
      description: 'Find the specific repository you were looking for.',
      action: () => router.push('/?search=true'),
      color: 'from-indigo-500/20 to-indigo-600/10',
      iconColor: 'text-indigo-400',
      borderColor: 'hover:border-indigo-500/40',
    },
    {
      icon: History,
      title: 'Recent Activity',
      description: 'View your latest commits and active pull requests.',
      action: () => router.push('/dashboard'),
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
      borderColor: 'hover:border-purple-500/40',
    },
    {
      icon: CircleHelp,
      title: 'Support Docs',
      description: 'Browse our documentation for troubleshooting.',
      action: () => window.open('/docs', '_blank'),
      color: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400',
      borderColor: 'hover:border-cyan-500/40',
    },
  ];

  return (
    <main className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden hide-scrollbar">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      {/* Content */}
      <div className="w-full max-w-2xl space-y-5 md:space-y-6 lg:space-y-5 text-center relative z-10 flex flex-col items-center">
        {/* Animated 404 */}
        <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative inline-block mb-4">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            {/* Main 404 text */}
            <h1 className="relative bg-gradient-to-br from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-[100px] md:text-[120px] lg:text-[160px] font-black leading-none tracking-tighter text-transparent select-none">
              404
            </h1>
          </div>

          {/* Decorative line */}
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full mb-2"></div>
        </div>

        {/* Message */}
        <div className={`space-y-3 md:space-y-4 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Repository Not Found
          </h2>

          <p className="mx-auto max-w-xl text-sm md:text-base text-zinc-400 leading-relaxed">
              This page seems to have disappeared from our codebase. The repository you&apos;re looking for might have been archived, deleted, or moved to a different branch.
          </p>
        </div>

        {/* Actions */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => router.push('/dashboard')}
            className="group relative px-6 py-3 rounded-lg font-semibold text-black overflow-hidden transition-all duration-300"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-300 group-hover:from-cyan-300 group-hover:to-cyan-400"></div>

            {/* Glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300"></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">
              <LayoutDashboard size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="text-sm">Go to Dashboard</span>
              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-1 transition-all" />
            </div>

            {/* Active state */}
            <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-black/10 transition-opacity"></div>
          </button>

          <Link
            href="/"
            className="group flex items-center gap-2 px-5 py-3 font-medium text-sm text-zinc-400 transition-all duration-300 hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1.5"
            />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Suggestion Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pt-4 md:pt-8 transition-all duration-1000 delay-500 w-full ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isActive = activeCard === idx;

            return (
              <button
                key={idx}
                onClick={() => handleCardClick(card.action)}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
                className={`group relative rounded-xl p-4 text-left cursor-pointer transition-all duration-300 overflow-hidden
                  ${isActive ? 'scale-105' : 'scale-100'}
                `}
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} backdrop-blur-xl transition-all duration-300`}></div>

                {/* Border */}
                <div className={`absolute inset-0 rounded-xl border border-white/10 transition-all duration-300 ${card.borderColor}`}></div>

                {/* Hover glow */}
                <div className={`absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300
                  ${isActive ? 'blur-xl' : 'blur-2xl'}
                  ${card.color}
                `}></div>

                {/* Content */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-start justify-between">
                    <Icon
                      size={20}
                      className={`${card.iconColor} transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
                    />
                    <ChevronRight
                      size={16}
                      className="text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-white text-sm transition-colors duration-300 group-hover:text-cyan-300">
                      {card.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer text */}
        <div className={`pt-4 md:pt-8 text-xs text-zinc-600 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <p>
            Error Code: <span className="font-mono text-zinc-500">404_REPOSITORY_NOT_FOUND</span>
          </p>
        </div>
      </div>

      {/* Animated styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        button {
          outline: none;
        }

        button:active {
          transform: scale(0.98);
        }
      `}</style>
    </main>
  );
}