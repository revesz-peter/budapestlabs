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
    <section id="how-it-works" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              className="glass-hover p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm font-medium text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <step.icon className="h-5 w-5 text-white/50" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="text-sm text-white/50">
                {t(`steps.${step.key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
