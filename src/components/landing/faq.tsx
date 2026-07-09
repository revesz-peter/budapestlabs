"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Handshake, Fingerprint, Package, Compass, Instagram } from "lucide-react";

const faqKeys = [
  "process",
  "cost",
  "pay",
  "monthly",
  "term",
  "speed",
  "language",
  "tech",
  "partner",
] as const;

const partnerServices = [
  { key: "identity", icon: Fingerprint },
  { key: "physical", icon: Package },
  { key: "direction", icon: Compass },
] as const;

function PartnerCard() {
  const t = useTranslations("faq");

  return (
    <div className="bg-card mt-4 rounded-2xl border px-5 py-5 shadow-sm md:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Handshake className="h-3.5 w-3.5" />
          <span className="text-xs font-medium uppercase tracking-widest">
            {t("partner.badge")}
          </span>
        </div>
        <span className="shrink-0 text-sm font-medium text-foreground/60">
          {t("partner.pricing")}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold">{t("partner.name")}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("partner.subtitle")}
        </p>
        <a
          href="https://www.instagram.com/susa.project/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Instagram className="h-3.5 w-3.5" />
          {t("partner.instagram")}
        </a>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {partnerServices.map((service) => (
          <div key={service.key}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <service.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium">
                {t(`partner.services.${service.key}.name`)}
              </p>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {(t.raw(`partner.services.${service.key}.items`) as string[]).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
          <div className="text-center lg:text-left">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl font-medium lg:text-5xl">{t("title")}</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                {t("subtitle")}
              </p>
              <div className="mt-8 hidden lg:block">{askUs}</div>
            </div>
          </div>

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
                {key === "partner" ? (
                  <PartnerCard />
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${key}.answer`)}
                  </p>
                )}
              </div>
            ))}
            <div className="pt-6 text-center lg:hidden">{askUs}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
