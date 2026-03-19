"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const rowKeys = [
  "delivery",
  "price",
  "quality",
  "tech",
  "security",
  "performance",
  "mobile",
  "seo",
  "booking",
  "effort",
] as const;

function CellIcon({ value }: { value: string }) {
  const lower = value.toLowerCase();
  if (
    lower.includes("always") ||
    lower.includes("mindig") ||
    lower.includes("immer") ||
    lower.includes("included") ||
    lower.includes("tartalmazza") ||
    lower.includes("inklusive") ||
    lower.includes("built-in") ||
    lower.includes("beépített") ||
    lower.includes("integriert") ||
    lower.includes("future-proof") ||
    lower.includes("jövőálló") ||
    lower.includes("zukunftssicher") ||
    lower.includes("under") ||
    lower.includes("alatt") ||
    lower.includes("unter") ||
    lower.includes("unhackable") ||
    lower.includes("teljes védelem") ||
    lower.includes("fully secure") ||
    lower.includes("vollständig sicher") ||
    lower.includes("latest") ||
    lower.includes("legmodernebb") ||
    lower.includes("neueste")
  ) {
    return <Check className="inline h-3.5 w-3.5 text-foreground/30" />;
  }
  if (
    lower.includes("extra cost") ||
    lower.includes("külön költség") ||
    lower.includes("zusatzkosten") ||
    lower.includes("varies") ||
    lower.includes("változó") ||
    lower.includes("unterschiedlich") ||
    lower.includes("basic") ||
    lower.includes("alap") ||
    lower.includes("closed") ||
    lower.includes("zárt") ||
    lower.includes("geschlossen") ||
    lower.includes("outdated") ||
    lower.includes("elavult") ||
    lower.includes("veraltet") ||
    lower.includes("slow") ||
    lower.includes("lassú")
  ) {
    return <Minus className="inline h-3.5 w-3.5 text-foreground/30" />;
  }
  if (
    lower.includes("everything") ||
    lower.includes("minden") ||
    lower.includes("alles selbst")
  ) {
    return <X className="inline h-3.5 w-3.5 text-foreground/30" />;
  }
  return null;
}

export function Comparison() {
  const t = useTranslations("comparison");

  return (
    <section className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
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

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overflow-x-auto"
        >
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-background pb-4 pr-4 text-left font-normal text-foreground/30" />
                <th className="pb-4 px-4 text-left font-medium text-muted-foreground">
                  {t("columns.diy")}
                </th>
                <th className="pb-4 px-4 text-left font-medium text-muted-foreground">
                  {t("columns.agency")}
                </th>
                <th className="pb-4 px-4 text-left font-semibold text-foreground">
                  {t("columns.us")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rowKeys.map((key, i) => (
                <tr key={key} className="border-t border-foreground/[0.06]">
                  <td className="sticky left-0 z-10 bg-background py-4 pr-4 font-medium text-muted-foreground">
                    {t(`rows.${key}.label`)}
                  </td>
                  <td className="py-4 px-4 text-foreground/35">
                    <span className="flex items-center gap-2">
                      <CellIcon value={t(`rows.${key}.diy`)} />
                      {t(`rows.${key}.diy`)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-foreground/35">
                    <span className="flex items-center gap-2">
                      <CellIcon value={t(`rows.${key}.agency`)} />
                      {t(`rows.${key}.agency`)}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "py-4 px-4 font-medium text-foreground bg-foreground/[0.03]",
                      i === 0 && "rounded-t-xl",
                      i === rowKeys.length - 1 && "rounded-b-xl"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <CellIcon value={t(`rows.${key}.us`)} />
                      {t(`rows.${key}.us`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
