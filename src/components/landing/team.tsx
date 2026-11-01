"use client";

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

export function Team() {
  const t = useTranslations("team");

  return (
    <section id="team" className="py-16 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1fr_auto] lg:gap-16">
        <SectionHeader
          align="start"
          className="mx-0"
          eyebrow={t("label")}
          title={t.rich("title", rich)}
          subtitle={t("subtitle")}
        />

        <ul className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
          {members.map(({ key, tint, accent }, i) => (
            <li key={key} className="group">
              <div className={cn("relative aspect-square overflow-hidden rounded-3xl border", tint)}>
                {/* curtain that wipes up to uncover the portrait */}
                <motion.div
                  aria-hidden="true"
                  className="bg-background absolute inset-0 z-10 origin-top"
                  initial={{ scaleY: 1 }}
                  whileInView={{ scaleY: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PixelCritter className="h-10 w-13 sm:h-12 sm:w-16 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 motion-reduce:transition-none" />
                </div>
              </div>
              <div className="mt-3 space-y-1.5 px-1">
                <h3 className="text-base font-medium sm:text-lg">{t(`members.${key}.name`)}</h3>
                <span aria-hidden="true" className={cn("block h-0.5 w-6 rounded-full transition-all duration-500 group-hover:w-12", accent)} />
                <p className="text-muted-foreground text-sm">{t(`members.${key}.role`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
