"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/landing/section-header";

const rowKeys = [
  "delivery",
  "price",
  "effort",
  "quality",
  "tech",
  "performance",
  "mobile",
  "seo",
  "security",
  "warranty",
  "booking",
] as const;

// ✓ = clearly positive, − = mediocre/costly, ✗ = bad/absent
// No icon on factual values (prices, delivery times) that speak for themselves
function CellIcon({ value }: { value: string }) {
  const lower = value.toLowerCase();

  const positive = [
    "always",              "mindig",              "immer",
    "included",            "tartalmazza",         "inklusive",
    "built-in",            "beépített",           "integriert",
    "future-proof",        "jövőálló",            "zukunftssicher",
    "latest",              "legmodernebb",        "neueste",
    "under",               "alatt",               "unter",
    "fully secure",        "teljes védelem",      "vollständig sicher",
    "lifetime",            "életre szóló",        "lebenslang",
    "effortless",          "egyszerű",            "mühelos",
    "professional",        "professzionális",     "professionell",
  ];

  const mediocre = [
    "extra cost",          "külön költség",       "zusatzkosten",
    "varies",              "változó",             "unterschiedlich",
    "closed",              "zárt",                "geschlossen",
    "outdated",            "elavult",             "veraltet",
    "meetings",            "megbeszélések",       "freigaben",
    "usually",             "általában",           "meistens",
    "1-4 seconds",         "1-4 másodperc",       "1-4 sekunden",
  ];

  const negative = [
    "all on you",          "minden az ön terhe",  "alles selbst",
    "none",                "nincs",               "keine",
    "your responsibility", "az ön felelőssége",   "ihre verantwortung",
    "often broken",        "gyakran hibás",       "oft fehlerhaft",
    "minimal",             "minimális",
    "generic",             "sablon",              "standard-vorlage",
    "3-8 seconds",         "3-8 másodperc",       "3-8 sekunden",
  ];

  if (positive.some((kw) => lower.includes(kw))) {
    return <Check className="inline h-3.5 w-3.5 text-foreground/30" />;
  }
  if (mediocre.some((kw) => lower.includes(kw))) {
    return <Minus className="inline h-3.5 w-3.5 text-foreground/30" />;
  }
  if (negative.some((kw) => lower.includes(kw))) {
    return <X className="inline h-3.5 w-3.5 text-foreground/30" />;
  }
  return null;
}

export function Comparison() {
  const t = useTranslations("comparison");

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeader
          className="mb-8 md:mb-12"
          title={t("title")}
          subtitle={t("subtitle")}
        />

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
                <th className="pb-4 px-4 text-left font-semibold text-foreground">
                  {t("columns.us")}
                </th>
                <th className="pb-4 px-4 text-left font-medium text-muted-foreground">
                  {t("columns.agency")}
                </th>
                <th className="pb-4 px-4 text-left font-medium text-muted-foreground">
                  {t("columns.diy")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rowKeys.map((key, i) => (
                <tr key={key} className="border-t border-foreground/[0.06]">
                  <td className="sticky left-0 z-10 bg-background py-4 pr-4 font-medium text-muted-foreground">
                    {t(`rows.${key}.label`)}
                  </td>
                  <td
                    className={cn(
                      "py-4 px-4 font-medium text-foreground bg-foreground/3",
                      i === 0 && "rounded-t-xl",
                      i === rowKeys.length - 1 && "rounded-b-xl"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <CellIcon value={t(`rows.${key}.us`)} />
                      {t(`rows.${key}.us`)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CellIcon value={t(`rows.${key}.agency`)} />
                      {t(`rows.${key}.agency`)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CellIcon value={t(`rows.${key}.diy`)} />
                      {t(`rows.${key}.diy`)}
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
