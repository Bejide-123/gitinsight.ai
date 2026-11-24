"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Zap, Rocket, Users } from "lucide-react";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Hobby",
      price: "$0",
      cadence: "forever free",
      description: "For individual developers and open-source contributors.",
      button: "Start Free",
      featured: false,
      icon: Zap,
      features: [
        "Up to 3 active repositories",
        "Full 6-dimension engineering analysis",
        "Standard AI codebase interrogation",
        "Public GitHub repository support",
        "Community support",
      ],
      href: "/register",
    },
    {
      name: "Pro Developer",
      price: isAnnual ? "$15" : "$19",
      cadence: "per month, billed annually",
      description: "For active engineers who need continuous codebase insights.",
      button: "Get Pro Access",
      featured: true,
      badge: "Most Popular",
      icon: Rocket,
      features: [
        "Unlimited GitHub repositories",
        "Commit-to-commit comparison engine",
        "Unlimited grounded AI chat sessions",
        "Private repository access via GitHub OAuth",
        "Full finding lifecycle tracking & score attribution",
        "Priority analysis queue",
      ],
      href: "/register",
    },
    {
      name: "Team",
      price: isAnnual ? "$39" : "$49",
      cadence: "per month",
      description: "For engineering teams and tech leads maintaining code quality.",
      button: "Start Team Trial",
      featured: false,
      icon: Users,
      features: [
        "Everything in Pro Developer",
        "Shared team workspace & dashboard",
        "Pull Request readiness gatekeeping",
        "Automated branch & commit monitoring",
        "Exportable compliance & security summaries",
        "Priority team support",
      ],
      href: "/register",
    },
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#07080b] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
            Transparent Pricing
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Simple plans for every developer.
          </h2>
          <p className="mt-4 text-sm text-zinc-400 sm:text-base">
            Start analyzing for free. Upgrade when you need historical commit comparisons,
            private repositories, and unlimited codebase chat.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-[#0c0f16] p-1 text-xs">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                !isAnnual
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                isAnnual
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Annual <span className="text-[10px] text-emerald-600 font-semibold ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 sm:p-7 transition-all ${
                  plan.featured
                    ? "border-white/30 bg-[#0e121a] shadow-xl ring-1 ring-white/20"
                    : "border-white/10 bg-[#0c0f16] hover:border-white/20"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{plan.name}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-bold tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {plan.name === "Hobby" ? "" : isAnnual ? "/mo" : "/mo"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">{plan.cadence}</p>

                  <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="mt-6 border-t border-white/[0.08] pt-4 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href={plan.href}
                    className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition ${
                      plan.featured
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {plan.button}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
