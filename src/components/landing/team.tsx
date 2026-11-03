"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader, rich } from "@/components/landing/section-header";
import { PixelCritter } from "@/components/landing/pixel-claude";

const ease = [0.22, 1, 0.36, 1] as const;

// Placeholder portraits: a pastel tile with a pixel Claude, until real photos are in
const members = [
  { key: "peter", tint: "bg-clay/55", accent: "bg-clay" },
  { key: "kristof", tint: "bg-olive/55", accent: "bg-olive" },
] as const;

// <b> markers in the copy are rendered as plain text (no bolding)
const plain = { b: (chunks: ReactNode) => chunks };

/** One card per person: portrait, name and role, then a lead line and a flowing paragraph of details. */
export function Team() {
  const t = useTranslations("team");

  return (
    <section id="team" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader align="start" className="mx-0" eyebrow={t("label")} title={t.rich("title", rich)} subtitle={t("subtitle")} />

        <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:gap-6">
          {members.map(({ key, tint, accent }, i) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease }}
              className="group bg-card flex flex-col rounded-[2rem] border p-6 md:p-8"
            >
              <div className="flex items-center gap-5">
                <span className={cn("flex size-20 shrink-0 items-center justify-center rounded-3xl border md:size-24", tint)}>
                  <PixelCritter className="h-8 w-11 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transition-none md:h-10 md:w-13" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-medium tracking-tight md:text-2xl">{t(`members.${key}.name`)}</h3>
                  <span aria-hidden="true" className={cn("block h-0.5 w-8 rounded-full transition-all duration-500 group-hover:w-14", accent)} />
                  <p className="text-muted-foreground">{t(`members.${key}.role`)}</p>
                </div>
              </div>

              {/* lead, then the details as one flowing paragraph */}
              <p className="mt-6 text-lg leading-snug font-medium tracking-tight text-pretty">{t(`members.${key}.lead`)}</p>
              <p className="text-foreground/75 mt-3 leading-relaxed text-pretty">
                {(t.raw(`members.${key}.points`) as string[]).map((_, n) => (
                  <span key={n}>
                    {n > 0 && " "}
                    {t.rich(`members.${key}.points.${n}`, plain)}
                  </span>
                ))}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
