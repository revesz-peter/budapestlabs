"use client";

import { useTranslations } from "next-intl";

const statItems = [
  { value: "7+", key: "experience" as const },
  { value: "≤24h", key: "delivery" as const },
  { value: "100%", key: "satisfaction" as const },
] as const;

export function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-semibold lg:text-5xl">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

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
