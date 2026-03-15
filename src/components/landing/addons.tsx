"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Globe,
  BookOpen,
  BarChart3,
  Palette,
  FileStack,
} from "lucide-react";

const addons = [
  { key: "multilang", icon: Globe },
  { key: "blog", icon: BookOpen },
  { key: "analytics", icon: BarChart3 },
  { key: "branding", icon: Palette },
  { key: "extraPages", icon: FileStack },
] as const;

export function Addons() {
  const t = useTranslations("addons");

  return (
    <section className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/40">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
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
          className="flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10"
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
              className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02] md:px-8"
            >
              <addon.icon className="h-5 w-5 shrink-0 text-white/40" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {t(`items.${addon.key}.name`)}
                </p>
                <p className="text-sm text-white/40">
                  {t(`items.${addon.key}.description`)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium text-white/60">
                {t(`items.${addon.key}.price`)}{" "}
                <span className="text-white/30">HUF</span>
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
