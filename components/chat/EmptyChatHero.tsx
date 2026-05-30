"use client";

import {
  ArrowRight,
  Link as LinkIcon,
  Bolt,
  Palette,
  Component,
} from "lucide-react";
import { SiVercel } from "react-icons/si";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ExampleCard = {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  logo: React.ReactNode;
};

const examples: ExampleCard[] = [
  {
    title: "vercel/next.js",
    subtitle: "The React Framework",
    description:
      "Analyze performance bottlenecks and hydration strategy in the world's most popular React framework.",
    icon: <Bolt size={18} />,
    logo: <SiVercel size={22} />,
  },
  {
    title: "shadcn/ui",
    subtitle: "Beautifully Designed Components",
    description:
      "Map the architectural structure of accessible component primitives and Radix-based patterns.",
    icon: <Palette size={18} />,
    logo: <Component size={22} />,
  },
];

export default function EmptyChatHero() {
  const [ repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

 const handleAnalyze = () => {
    if (repoUrl.trim()) {
      const id = crypto.randomUUID(); // Using crypto.randomUUID()
      router.push(`/chat/${id}?repoUrl=${encodeURIComponent(repoUrl)}`);
    }
  };
  
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-16">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {/* HERO */}
      <div className="z-10 max-w-2xl text-center">
        <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent" />
          <span className="text-3xl text-white">⟡</span>
        </div>

        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white">
          Analyze Any GitHub Repository
        </h1>

        <p className="mb-12 text-lg leading-relaxed text-zinc-400">
          Instant engineering intelligence from your codebase. Audit security,
          map dependencies, and optimize performance in seconds.
        </p>
      </div>

      {/* INPUT */}
      <div className="z-10 w-full max-w-3xl">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
          <div className="flex flex-1 items-center gap-2 px-3">
            <LinkIcon size={16} className="text-zinc-500" />

            <input
               value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              placeholder="https://github.com/vercel/next.js"
            />
          </div>

          <button
              onClick={handleAnalyze}
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-black transition hover:bg-zinc-200">
            Analyze Free
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex gap-1">
            <span className="h-1 w-4 rounded-full bg-cyan-400" />
            <span className="h-1 w-4 rounded-full bg-cyan-400" />
            <span className="h-1 w-4 rounded-full bg-cyan-400" />
            <span className="h-1 w-4 rounded-full bg-zinc-800" />
            <span className="h-1 w-4 rounded-full bg-zinc-800" />
          </div>

          <p className="text-[11px] uppercase tracking-widest text-zinc-500">
            3 free analyses remaining
          </p>
        </div>
      </div>

      {/* EXAMPLE CARDS */}
      <div className="z-10 mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {examples.map((item, i) => (
          <div
            key={i}
            className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white">
                  {item.logo}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-zinc-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <span className="text-zinc-500">{item.icon}</span>
            </div>

            <p className="text-xs leading-relaxed text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}