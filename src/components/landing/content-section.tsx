"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/landing/section-header";

export function ContentSection() {
  const t = useTranslations("content");

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          className="mx-0 mb-8 max-w-xl text-left md:mb-12"
          title={t("title")}
        />
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              {t("p1start")}{" "}
              <span className="text-accent-foreground font-bold">
                {t("p1bold")}
              </span>{" "}
              {t("p1end")}
            </p>
            <p className="text-muted-foreground">{t("p2")}</p>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">{t("background1")}</p>
            <p className="text-muted-foreground">{t("background2")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
