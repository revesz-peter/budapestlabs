"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  { key: "starter", popular: false },
  { key: "business", popular: true },
  { key: "pro", popular: false },
] as const;

export function Pricing() {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="px-6 py-24 md:px-8 lg:px-16">
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

        {/* Plans */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid items-stretch gap-6 lg:grid-cols-3"
        >
          {plans.map((plan) => {
            const features = t.raw(`${plan.key}.features`) as string[];
            return (
              <motion.div
                key={plan.key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className={cn(
                  "relative flex flex-col p-8",
                  plan.popular
                    ? "glass-active gradient-border shadow-[0_0_80px_-20px_rgba(139,92,246,0.15)]"
                    : "glass-hover"
                )}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {t(`${plan.key}.name`)}
                    </h3>
                    <p className="mt-1 text-sm text-white/40">
                      {t(`${plan.key}.description`)}
                    </p>
                  </div>
                  {plan.popular && (
                    <Badge className="border-transparent bg-white text-black">
                      {t("popular")}
                    </Badge>
                  )}
                </div>

                <p className="mb-2 text-4xl font-bold">
                  {t(`${plan.key}.price`)}{" "}
                  <span className="text-base font-normal text-white/40">
                    HUF
                  </span>
                </p>

                <div className="mb-8 flex items-center gap-2 text-sm text-white/40">
                  <Clock className="h-3.5 w-3.5" />
                  {t("delivery")}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {features.map((feature: string) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-white/60"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={cn(
                    "w-full rounded-full",
                    plan.popular
                      ? "bg-white text-black hover:bg-white/90"
                      : "border border-white/20 bg-transparent text-white hover:bg-white/5"
                  )}
                >
                  <a href="#contact">{t("choosePlan")}</a>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
