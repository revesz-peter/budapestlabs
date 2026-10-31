"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn, keepHyphens } from "@/lib/utils";
import { SectionHeader, rich } from "@/components/landing/section-header";

const steps = [
  { key: "assess", tint: "bg-sand" },
  { key: "plan", tint: "bg-clay/60" },
  { key: "build", tint: "bg-olive/60" },
  { key: "run", tint: "bg-ochre/55" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function Process() {
  const t = useTranslations("process");

  return (
    <section id="process" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          className="mb-12 md:mb-16"
          eyebrow={t("label")}
          title={t.rich("title", rich)}
          subtitle={t("subtitle")}
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ key, tint }, index) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.1, ease }}
              className={cn("flex flex-col rounded-3xl border p-7", tint)}
            >
              <span className="text-brand text-sm font-semibold tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-lg font-medium text-balance">{keepHyphens(t(`steps.${key}.title`))}</h3>
              <p className="text-foreground/70 mt-3 text-sm leading-relaxed text-pretty">
                {t(`steps.${key}.body`)}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
