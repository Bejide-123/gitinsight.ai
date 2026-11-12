"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

type FaqIndex = number | null;

const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately at the start of the next billing cycle.",
  },
  {
    question: "What kind of security protocols do you use?",
    answer:
      "We use encrypted infrastructure, secure repository access, role-based permissions, and enterprise-grade monitoring across all systems.",
  },
  {
    question: "Do you offer discounts for educational use?",
    answer:
      "Yes. We support students, educators, and open-source maintainers with special pricing options and extended access.",
  },
  {
    question: "Is there a limit on the number of team members?",
    answer:
      "No hard limits. Team scaling depends on your selected plan and infrastructure requirements.",
  },
];

export default function PricingSection() {
  const [openFaq, setOpenFaq] = useState<FaqIndex>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals and small open source projects.",
      button: "Current Plan",
      featured: false,
      icon: Zap,
      features: ["Up to 3 repositories", "Basic analytics dashboard", "Weekly email reports"],
      href: "/register",
    },
    {
      name: "Pro",
      price: isAnnual ? "$39" : "$49",
      description: "For growing engineering teams.",
      button: "Start Pro Trial",
      featured: true,
      icon: Rocket,
      features: [
        "Unlimited repositories",
        "Advanced velocity metrics",
        "AI code review insights",
        "Slack & Jira integration",
        "Priority support",
      ],
      href: "/register",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Custom solutions for large organizations.",
      button: "Contact Sales",
      featured: false,
      icon: Shield,
      features: [
        "Self-hosted option",
        "Custom security audits",
        "Dedicated success manager",
        "SSO & SAML Auth",
      ],
      href: "mailto:hello@gitinsight.ai",
    },
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-b border-white/[0.08] bg-[#080910] px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="pointer-events-none absolute -left-48 top-20 h-[32rem] w-[32rem] rounded-full bg-violet-500/[0.08] blur-[130px]" />
      <div className="pointer-events-none absolute -right-48 top-[28%] h-[34rem] w-[34rem] rounded-full bg-cyan-300/[0.07] blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="mb-12 grid gap-8 border-b border-white/[0.08] pb-10 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div>
            <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100">
              <span className="h-px w-7 bg-gradient-to-r from-violet-100 to-cyan-100" />
              Pricing
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
              Pick the room
              <span className="block bg-gradient-to-r from-violet-200 via-cyan-200 to-cyan-100 bg-clip-text pb-2 text-transparent">
                your workflow needs.
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              Start with the essentials, explore more for your team, or talk through a custom setup.
            </p>
          </div>

          <div className="flex items-center gap-3 lg:pb-2">
            <span className={`text-xs transition-colors ${!isAnnual ? "text-white" : "text-zinc-500"}`}>Monthly</span>
            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              aria-label="Toggle annual pricing"
              onClick={() => setIsAnnual((annual) => !annual)}
              className="relative h-7 w-12 rounded-full border border-white/10 bg-white/[0.05] p-1 transition-colors hover:bg-white/[0.09]"
            >
              <motion.span
                animate={{ x: isAnnual ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="block h-[18px] w-[18px] rounded-full bg-gradient-to-br from-cyan-100 to-violet-200 shadow-[0_0_14px_rgba(103,232,249,0.35)]"
              />
            </button>
            <span className={`text-xs transition-colors ${isAnnual ? "text-white" : "text-zinc-500"}`}>Annual</span>
            <span className="rounded-full border border-emerald-100/15 bg-emerald-100/[0.05] px-2.5 py-1 text-[9px] font-medium text-emerald-100">Save 20%</span>
          </div>
        </motion.div>

        <div className="grid items-stretch gap-4 lg:grid-cols-[0.84fr_1.24fr_0.92fr] lg:gap-5">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -7 }}
                className={`group relative flex flex-col overflow-hidden ${
                  plan.featured
                    ? "rounded-[1.75rem] border border-cyan-100/20 bg-[#10141e] shadow-[0_25px_90px_rgba(34,211,238,0.08)] lg:-mt-3 lg:mb-3"
                    : "rounded-[1.5rem] border border-white/[0.08] bg-[#0c0f17]/90"
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/70 to-transparent" />
                    <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-cyan-200/[0.10] blur-[90px]" />
                    <span className="absolute right-5 top-5 rounded-full border border-cyan-100/20 bg-cyan-100/[0.08] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-cyan-50">
                      Most popular
                    </span>
                  </>
                )}

                <div className="relative flex h-full flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      plan.featured
                        ? "border-cyan-100/20 bg-gradient-to-br from-cyan-100/[0.12] to-violet-200/[0.08] text-cyan-100"
                        : "border-white/10 bg-white/[0.035] text-zinc-300"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.16em] text-zinc-600">0{index + 1}</span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-1.5 min-h-10 text-xs leading-5 text-zinc-400">{plan.description}</p>
                  </div>

                  <div className="mt-5 border-y border-white/[0.08] py-5">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-semibold tracking-tight ${
                        plan.featured ? "bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent" : "text-white"
                      }`}>
                        {plan.price}
                      </span>
                      {plan.price !== "Custom" && <span className="text-xs text-zinc-500">/ month</span>}
                    </div>
                    {plan.featured && <p className="mt-1 text-[10px] text-zinc-500">{isAnnual ? "Billed annually" : "Billed monthly"}</p>}
                  </div>

                  <ul className="my-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs leading-5 text-zinc-300">
                        <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${plan.featured ? "text-cyan-100" : "text-zinc-500"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`group/cta inline-flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${
                      plan.featured
                        ? "bg-gradient-to-r from-cyan-200 to-cyan-300 text-[#071013] shadow-[0_6px_25px_rgba(34,211,238,0.12)] hover:shadow-[0_6px_35px_rgba(34,211,238,0.25)]"
                        : "border border-white/10 bg-white/[0.025] text-zinc-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {plan.button}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100">
              <Sparkles className="h-3.5 w-3.5" />
              A few details
            </p>
            <h3 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Good questions
              <span className="block text-zinc-500">deserve clear answers.</span>
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-400">
              Find a little more context about plans, access, and getting started.
            </p>
            <Link href="/register" className="group mt-7 inline-flex items-center gap-2 text-xs font-medium text-cyan-100 transition hover:text-white">
              Start exploring GitInsight
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-4 py-5 text-left"
                  >
                    <span className="w-7 shrink-0 font-mono text-[9px] text-zinc-600">0{index + 1}</span>
                    <span className="flex-1 text-sm font-medium text-zinc-200 transition-colors group-hover:text-white">{faq.question}</span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isOpen ? "border-cyan-100/20 bg-cyan-100/[0.06] text-cyan-100" : "border-white/10 text-zinc-500 group-hover:text-white"
                    }`}>
                      {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-5 pl-11 text-sm leading-6 text-zinc-400">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">Need a hand choosing a setup for your team?</p>
          <a
            href="mailto:hello@gitinsight.ai"
            className="group inline-flex items-center gap-2 text-xs font-medium text-cyan-100 transition hover:text-white"
          >
            Talk to the GitInsight team
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
