"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

type FaqIndex = number | null;

export default function PricingSection() {
  const [openFaq, setOpenFaq] = useState<FaqIndex>(null);

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals and small open source projects.",
      button: "Current Plan",
      featured: false,
      features: [
        "Up to 3 repositories",
        "Basic analytics dashboard",
        "Weekly email reports",
      ],
    },
    {
      name: "Pro",
      price: "$49",
      description: "For growing engineering teams.",
      button: "Start Pro Trial",
      featured: true,
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
    <section className="relative overflow-hidden bg-[#050505] py-28 px-6">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%)]" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-white/[0.03] blur-[180px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-semibold text-white">
            Simple, Transparent Pricing
          </h2>

          <p className="mt-6 text-zinc-400 text-lg">
            Choose a plan that fits your engineering workflow.
          </p>

          {/* TOGGLE */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="text-zinc-400 text-xs uppercase tracking-[0.2em]">
              Monthly
            </span>

            <div className="w-14 h-7 bg-white/10 rounded-full p-1 relative">
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full" />
            </div>

            <span className="text-white text-xs uppercase tracking-[0.2em]">
              Annual
            </span>

            <span className="text-[10px] uppercase px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
              Save 20%
            </span>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">

          {plans.map((plan, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl p-8
              ${plan.featured
                ? "border-cyan-400/30 bg-white/[0.06] shadow-[0_0_100px_rgba(34,211,238,0.08)]"
                : "border-white/10 bg-white/[0.03]"
              }`}
            >

              {plan.featured && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
              )}

              <div className="relative z-10">

                <h3 className="text-3xl font-semibold text-white mb-2">
                  {plan.name}
                </h3>

                <p className="text-zinc-400 text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-10">
                  <span className="text-5xl text-white font-semibold">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-zinc-500 ml-2">/mo</span>
                  )}
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-zinc-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 rounded-2xl text-sm uppercase tracking-[0.2em]
                  ${plan.featured
                    ? "bg-white text-black"
                    : "border border-white/10 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {plan.button}
                </button>

              </div>
            </motion.div>
          ))}

        </div>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-24">

          <h2 className="text-4xl font-semibold text-white text-center mb-14">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
                >

                  <button
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="w-full flex justify-between items-center px-6 py-5"
                  >
                    <span className="text-white">
                      {faq.question}
                    </span>

                    <div className="w-5 h-5 flex items-center justify-center">
                      <AnimatePresence mode="wait">

                        {!isOpen ? (
                          <motion.div
                            key="plus"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                          >
                            <Plus className="w-5 h-5 text-zinc-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="minus"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                          >
                            <Minus className="w-5 h-5 text-cyan-300" />
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
                        className="px-6 pb-6 text-zinc-400 text-sm"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}

          </div>
        </section>

        {/* CTA (FIXED — THIS WAS MISSING) */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] py-16 px-10 text-center">

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />

          <div className="relative z-10">

            <h2 className="text-4xl font-semibold text-white mb-6">
              Still have questions?
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto mb-10">
              Our engineering experts are here to help you choose the perfect setup for your team.
            </p>

            <button className="text-white border-b border-white uppercase tracking-[0.2em] text-sm hover:text-cyan-300 hover:border-cyan-300 transition-all">
              Contact our team
            </button>

          </div>

        </section>

      </div>
    </section>
  );
}