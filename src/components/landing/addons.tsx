"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Palette,
  Globe,
  Handshake,
  Fingerprint,
  Package,
  Compass,
  Instagram,
} from "lucide-react";

const addons = [
  { key: "branding", icon: Palette },
  { key: "multilang", icon: Globe },
] as const;

const partnerServices = [
  { key: "identity", icon: Fingerprint },
  { key: "physical", icon: Package },
  { key: "direction", icon: Compass },
] as const;

export function Addons() {
  const t = useTranslations("addons");

  return (
    <section className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Add-on list */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="flex flex-col divide-y divide-border rounded-2xl border border-border"
        >
          {addons.map((addon) => (
            <motion.div
              key={addon.key}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
              className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-foreground/[0.02] md:px-8"
            >
              <addon.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {t(`items.${addon.key}.name`)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t(`items.${addon.key}.description`)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium text-foreground/60">
                {t(`items.${addon.key}.price`) === "0" ? (
                  t("included")
                ) : (
                  <>
                    {t(`items.${addon.key}.price`)}{" "}
                    <span className="text-foreground/30">{t("currency")}</span>
                    {t(`items.${addon.key}.suffix`) && (
                      <span className="text-foreground/30">
                        {" "}{t(`items.${addon.key}.suffix`)}
                      </span>
                    )}
                  </>
                )}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* SUSA STUDIO partner block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass mt-8 px-6 py-6 md:px-8"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Handshake className="h-3.5 w-3.5" />
              <span className="text-xs font-medium uppercase tracking-widest">
                {t("partner.badge")}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground/60">
              {t("partner.pricing")}
            </span>
          </div>

          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
            <a
              href="https://www.instagram.com/susa.project/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-bold transition-colors hover:text-muted-foreground"
            >
              {t("partner.name")}
              <Instagram className="h-3 w-3" />
            </a>
            <span className="text-xs text-muted-foreground">
              {t("partner.subtitle")}
            </span>
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
                  {(
                    t.raw(
                      `partner.services.${service.key}.items`
                    ) as string[]
                  ).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
