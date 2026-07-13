"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/landing/section-header";

export function ContentSection() {
  const t = useTranslations("content");
  const stack = (t.raw("stack") as string[]).filter(Boolean);

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          className="mx-0 mb-8 max-w-xl text-left md:mb-12"
          title={t("title")}
        />
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
            <p className="text-muted-foreground text-sm">{t("stackLead")}</p>
            <ul className="divide-border text-muted-foreground divide-y text-sm">
              {stack.map((item, index) => (
                <li key={index} className="py-2.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              {t("background1start")}
              <span className="text-accent-foreground font-bold">
                {t("background1brands")}
              </span>
              {t("background1end")}
            </p>
            {t("background2") ? (
              <p className="text-muted-foreground">{t("background2")}</p>
            ) : null}
            <p className="text-muted-foreground">{t("background3")}</p>
            <p className="text-accent-foreground font-semibold">{t("motto")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
