"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MousePointerClick, FileText, Hammer, Rocket } from "lucide-react";

const steps = [
  { key: "choose", icon: MousePointerClick },
  { key: "content", icon: FileText },
  { key: "build", icon: Hammer },
  { key: "launch", icon: Rocket },
] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section id="how-it-works" className="px-6 py-28 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40"
          >
            {t("label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/50 md:text-xl"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                  },
                }}
                className="glass-hover group relative p-8"
              >
                {/* Step number + icon */}
                <div className="mb-6 flex items-center gap-4">
                  <motion.div
                    variants={{
                      hidden: { scale: 0.5, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                          duration: 0.4,
                          ease: "easeOut",
                          delay: 0.1,
                        },
                      },
                    }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 text-lg font-bold text-white/80"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(167, 139, 250, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)",
                    }}
                  >
                    {i + 1}
                  </motion.div>
                  <step.icon className="h-6 w-6 text-white/30 transition-colors group-hover:text-white/50" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {t(`steps.${step.key}.description`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
