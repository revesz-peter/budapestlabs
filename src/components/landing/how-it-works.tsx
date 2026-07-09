"use client";

import { useTranslations } from "next-intl";
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
    <section id="process" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-4xl font-medium lg:text-5xl">{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.key} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                  {i + 1}
                </span>
                <step.icon className="text-muted-foreground size-4" />
              </div>
              <h3 className="text-sm font-medium">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t(`steps.${step.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
