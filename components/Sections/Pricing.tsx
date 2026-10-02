"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check, Sparkles, ArrowRight, Zap, Shield, Rocket } from "lucide-react";

type FaqIndex = number | null;

export default function PricingSection() {
  const [openFaq, setOpenFaq] = useState<FaqIndex>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: isAnnual ? "$0" : "$0",
      description: "For individuals and small open source projects.",
      button: "Current Plan",
      featured: false,
      icon: Zap,
      features: [
        "Up to 3 repositories",
        "Basic analytics dashboard",
        "Weekly email reports",
      ],
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
    },
  ];

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

  return (
    <section id="pricing" className="relative overflow-hidden border-b border-white/[0.08] bg-[#07090c] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded border border-cyan-200/15 bg-cyan-200/[0.04] px-3 py-2">
              <Sparkles size={14} className="text-cyan-200" />
              <span className="text-xs text-cyan-100">
                Pricing
              </span>
            </div>

            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Plans for your workflow
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Choose a plan that fits your engineering workflow.
            </p>
          </motion.div>

          {/* TOGGLE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <span className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
              !isAnnual ? 'text-white' : 'text-zinc-500'
            }`}>
              Monthly
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              aria-label="Toggle annual pricing"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-7 w-12 rounded-full border border-white/10 bg-[#151a1e] p-1 transition-colors hover:bg-white/[0.08]"
            >
              <motion.div
                animate={{ x: isAnnual ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-[18px] w-[18px] rounded-full bg-cyan-200"
              />
            </button>

            <span className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
              isAnnual ? 'text-white' : 'text-zinc-500'
            }`}>
              Annual
            </span>

            <span className="rounded border border-emerald-200/15 bg-emerald-200/[0.04] px-2.5 py-1 text-[10px] font-medium text-emerald-100">
              Save 20%
            </span>
          </motion.div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-28">

          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className={`relative overflow-hidden rounded-lg border bg-[#0d1115] p-6 transition-colors duration-200 sm:p-7
                ${plan.featured
                  ? "border-cyan-200/25"
                  : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="absolute inset-x-0 top-0 h-px bg-cyan-200/40" />
                    <div className="absolute right-4 top-4 rounded border border-cyan-200/15 bg-cyan-200/[0.04] px-2 py-1 text-[10px] font-medium text-cyan-100">
                      Popular
                    </div>
                  </>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-md border ${
                    plan.featured 
                      ? "border-cyan-200/15 bg-cyan-200/[0.04]" 
                      : "border-white/10 bg-white/5"
                  }`}>
                    <Icon className={`h-5 w-5 ${plan.featured ? "text-cyan-100" : "text-zinc-400"}`} />
                  </div>

                  <h3 className="mb-1 text-xl font-semibold text-white">
                    {plan.name}
                  </h3>

                  <p className="text-zinc-400 text-sm mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-3xl font-semibold text-white">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-zinc-500 ml-1.5 text-sm">/mo</span>
                    )}
                  </div>

                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors ${
                          plan.featured 
                            ? "bg-cyan-200/[0.06] group-hover:bg-cyan-200/[0.1]" 
                            : "bg-white/5 group-hover:bg-white/10"
                        }`}>
                          <Check className={`h-3 w-3 ${plan.featured ? "text-cyan-100" : "text-zinc-400"}`} />
                        </div>
                        <span className={`text-sm ${plan.featured ? "text-zinc-300" : "text-zinc-400"} group-hover:text-white transition-colors`}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`flex w-full items-center justify-center gap-2 rounded py-3 text-sm font-medium transition
                    ${plan.featured
                      ? "bg-cyan-300 text-[#071013] hover:bg-cyan-200"
                      : "border border-white/10 text-zinc-200 hover:bg-white/[0.05] hover:text-white"
                    } ${plan.name === "Free" ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {plan.button}
                    {plan.featured && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <section className="mx-auto mb-16 max-w-3xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded border border-white/10 bg-white/[0.03] px-3 py-2">
              <Sparkles size={12} className="text-cyan-100" />
              <span className="text-xs text-zinc-300">
                FAQ
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d1115] transition-colors hover:border-white/20"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/[0.03] sm:px-5"
                  >
                    <span className="text-sm font-medium text-white">
                      {faq.question}
                    </span>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-white/[0.03]">
                      <AnimatePresence mode="wait">
                        {!isOpen ? (
                          <motion.div
                            key="plus"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                          >
                            <Plus className="w-3.5 h-3.5 text-zinc-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="minus"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                          >
                            <Minus className="h-3.5 w-3.5 text-cyan-200" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-5 text-sm leading-6 text-zinc-400 sm:px-5"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d1115] px-6 py-10 text-center transition-colors hover:border-cyan-200/20 sm:px-8 sm:py-12"
        >
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-cyan-200/15 bg-cyan-200/[0.04]">
              <Sparkles className="h-5 w-5 text-cyan-100" />
            </div>

            <h2 className="mb-2 text-2xl font-semibold text-white sm:text-3xl">
              Still have questions?
            </h2>

            <p className="mx-auto mb-6 max-w-xl text-sm leading-6 text-zinc-400">
              Our engineering experts are here to help you choose the perfect setup for your team.
            </p>

            <a href="mailto:hello@gitinsight.ai" className="group inline-flex items-center gap-2 rounded bg-cyan-300 px-4 py-2.5 text-sm font-medium text-[#071013] transition hover:bg-cyan-200">
              Contact our team
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </motion.section>

      </div>
    </section>
  );
}