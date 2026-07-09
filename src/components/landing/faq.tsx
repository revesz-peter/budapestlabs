"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const faqKeys = ["cost", "pay", "monthly", "term", "speed", "google"] as const;

export function FAQ() {
  const t = useTranslations("faq");

  const askUs = (
    <p className="text-sm text-muted-foreground">
      {t("more")}{" "}
      <a
        href="#contact"
        className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
      >
        {t("moreCta")}
      </a>
    </p>
  );

  return (
    <section id="faq" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          {/* Header — sticky on desktop */}
          <div className="text-center lg:text-left">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl font-medium lg:text-5xl">{t("title")}</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                {t("subtitle")}
              </p>
              <div className="mt-8 hidden lg:block">{askUs}</div>
            </div>
          </div>

          {/* Open Q&A list — no clicking required */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="divide-y divide-border"
          >
            {faqKeys.map((key) => (
              <div key={key} className="py-6 first:pt-0 last:pb-0">
                <h3 className="font-medium">{t(`items.${key}.question`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${key}.answer`)}
                </p>
              </div>
            ))}
            <div className="pt-6 text-center lg:hidden">{askUs}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
