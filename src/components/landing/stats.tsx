"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/landing/section-header";

const statItems = [
  { value: "7+", key: "experience" as const },
  { value: "≤24h", key: "delivery" as const },
  { value: "100%", key: "satisfaction" as const },
] as const;

export function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          className="relative z-10 mb-8 md:mb-12"
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-3 *:text-center md:grid-cols-3 md:gap-4">
          {statItems.map((item) => (
            <div
              key={item.key}
              className="space-y-4 rounded-xl border py-10 md:py-12"
            >
              <div className="text-5xl font-bold">{item.value}</div>
              <p className="text-muted-foreground px-4">{t(item.key)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
