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
    <section className="relative overflow-hidden bg-[#050505] py-24 px-6">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.06),transparent_40%)]" />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-purple-500/5 via-purple-500/5 to-blue-500/5 blur-[180px] rounded-full" />
      
      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 mb-6">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-purple-400">
                Pricing
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Simple, Transparent Pricing
            </h2>

            <p className="mt-4 text-zinc-400 text-lg max-w-xl mx-auto">
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
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 bg-white/10 rounded-full p-1 transition-colors duration-300 hover:bg-white/15"
            >
              <motion.div
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-lg shadow-purple-500/20"
              />
            </button>

            <span className={`text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
              isAnnual ? 'text-white' : 'text-zinc-500'
            }`}>
              Annual
            </span>

            <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
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
                whileHover={{ y: -6 }}
                className={`relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 bg-[#0a0a0a]
                ${plan.featured
                  ? "border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.08)] hover:shadow-[0_0_100px_rgba(168,85,247,0.15)]"
                  : "border-white/10 hover:border-white/20"
                }`}
              >
                {plan.featured && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent" />
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
                    <div className="absolute top-5 right-5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
                      Popular
                    </div>
                  </>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${
                    plan.featured 
                      ? "border-purple-500/30 bg-purple-500/10" 
                      : "border-white/10 bg-white/5"
                  }`}>
                    <Icon className={`w-6 h-6 ${plan.featured ? "text-purple-400" : "text-white/40"}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">
                    {plan.name}
                  </h3>

                  <p className="text-zinc-400 text-sm mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-bold text-white tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-zinc-500 ml-1.5 text-sm">/mo</span>
                    )}
                  </div>

                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          plan.featured 
                            ? "bg-purple-500/10 group-hover:bg-purple-500/20" 
                            : "bg-white/5 group-hover:bg-white/10"
                        }`}>
                          <Check className={`w-3 h-3 ${plan.featured ? "text-purple-400" : "text-white/40"}`} />
                        </div>
                        <span className={`text-sm ${plan.featured ? "text-zinc-300" : "text-zinc-400"} group-hover:text-white transition-colors`}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`w-full py-3.5 rounded-xl text-sm font-medium tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-2
                    ${plan.featured
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-[1.02]"
                      : "border border-white/10 text-white hover:bg-white hover:text-black"
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
        <section className="max-w-3xl mx-auto mb-24">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-4">
              <Sparkles size={12} className="text-white/40" />
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/40">
                FAQ
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
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
                  className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center px-5 py-4 hover:bg-white/[0.02] transition-colors duration-300 group"
                  >
                    <span className="text-white text-sm font-medium group-hover:text-white/90 transition-colors">
                      {faq.question}
                    </span>

                    <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
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
                            <Minus className="w-3.5 h-3.5 text-purple-400" />
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
                        className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed"
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
          className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-[#0a0a0a] py-14 px-8 text-center hover:border-purple-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Still have questions?
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Our engineering experts are here to help you choose the perfect setup for your team.
            </p>

            <button className="group inline-flex items-center gap-2 text-white border-b border-white/20 uppercase tracking-[0.15em] text-sm hover:text-purple-400 hover:border-purple-400 transition-all duration-300 font-medium">
              Contact our team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.section>

      </div>
    </section>
  );
}