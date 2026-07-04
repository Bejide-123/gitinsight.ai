"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check, Sparkles, ArrowRight } from "lucide-react";

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
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-[180px] rounded-full" />
      
      {/* Floating orbs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
              Simple, Transparent Pricing
            </h2>

            <p className="mt-6 text-zinc-400 text-lg max-w-xl mx-auto">
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
            <span className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
              !isAnnual ? 'text-white' : 'text-zinc-400'
            }`}>
              Monthly
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 bg-white/10 rounded-full p-1 transition-colors duration-300 hover:bg-white/15"
            >
              <motion.div
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>

            <span className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
              isAnnual ? 'text-white' : 'text-zinc-400'
            }`}>
              Annual
            </span>

            <span className="text-[10px] uppercase px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 font-medium">
              Save 20%
            </span>
          </motion.div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">

          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl p-8 transition-all duration-300
              ${plan.featured
                ? "border-cyan-400/30 bg-white/[0.06] shadow-[0_0_100px_rgba(34,211,238,0.08)] hover:shadow-[0_0_120px_rgba(34,211,238,0.15)]"
                : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >

              {plan.featured && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent" />
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-[10px] uppercase tracking-widest font-medium">
                    Popular
                  </div>
                </>
              )}

              <div className="relative z-10">

                <h3 className="text-3xl font-semibold text-white mb-2 tracking-tight">
                  {plan.name}
                </h3>

                <p className="text-zinc-400 text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-10">
                  <span className="text-5xl text-white font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-zinc-500 ml-2 text-sm">/mo</span>
                  )}
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-zinc-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 rounded-2xl text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 group
                  ${plan.featured
                    ? "bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    : "border border-white/10 text-white hover:bg-white hover:text-black"
                  } ${plan.name === "Free" ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {plan.button}
                  {plan.featured && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>

              </div>
            </motion.div>
          ))}

        </div>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-24">

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold text-white text-center mb-14 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4">

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 transition-all duration-300"
                >

                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center px-6 py-5 hover:bg-white/[0.02] transition-colors duration-300 group"
                  >
                    <span className="text-white text-left font-medium group-hover:text-white/90 transition-colors">
                      {faq.question}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                      <AnimatePresence mode="wait">
                        {!isOpen ? (
                          <motion.div
                            key="plus"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                          >
                            <Plus className="w-4 h-4 text-zinc-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="minus"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                          >
                            <Minus className="w-4 h-4 text-cyan-300" />
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
                        className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed"
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
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] py-16 px-10 text-center hover:border-white/20 transition-all duration-500"
        >

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-transparent" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">

            <Sparkles className="w-10 h-10 text-cyan-400/40 mx-auto mb-4" />

            <h2 className="text-4xl font-semibold text-white mb-6 tracking-tight">
              Still have questions?
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Our engineering experts are here to help you choose the perfect setup for your team.
            </p>

            <button className="group inline-flex items-center gap-2 text-white border-b border-white/30 uppercase tracking-[0.2em] text-sm hover:text-cyan-300 hover:border-cyan-300 transition-all duration-300 font-medium">
              Contact our team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </motion.section>

      </div>
    </section>
  );
}