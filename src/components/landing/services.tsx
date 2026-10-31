"use client";

import type { JSX } from "react";
import { useTranslations } from "next-intl";
import {
  Blocks,
  Check,
  GraduationCap,
  Globe,
  MessagesSquare,
  ScanSearch,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FeatureCard } from "@/components/landing/feature-card";
import { SectionHeader, rich } from "@/components/landing/section-header";

export const serviceKeys = [
  "ai",
  "software",
  "automation",
  "web",
  "training",
  "audit",
] as const;

// Each card keeps its own pastel; the accent line under the title uses the same colour at full strength.
const cards = {
  ai: { icon: MessagesSquare, tint: "bg-clay/55", fill: "bg-clay", span: "lg:col-span-2" },
  software: { icon: Blocks, tint: "bg-sand", fill: "bg-stone", span: "" },
  automation: { icon: Workflow, tint: "bg-olive/55", fill: "bg-olive", span: "" },
  web: { icon: Globe, tint: "bg-stone/60", fill: "bg-stone", span: "" },
  training: { icon: GraduationCap, tint: "bg-ochre/50", fill: "bg-ochre", span: "" },
  audit: { icon: ScanSearch, tint: "bg-moss/45", fill: "bg-moss", span: "lg:col-span-2" },
} as const;

// Wordless mini illustrations for the two wide cards
function ChatVignette() {
  return (
    <div className="space-y-2.5">
      <div className="bg-foreground/85 ml-auto h-8 w-36 rounded-2xl rounded-br-sm transition-transform duration-700 group-hover:-translate-x-2" />
      <div className="bg-background/85 w-48 space-y-2 rounded-2xl rounded-bl-sm p-3 shadow-sm transition-transform delay-75 duration-700 group-hover:translate-x-2">
        <div className="bg-foreground/15 h-2 w-full rounded-full" />
        <div className="bg-foreground/15 h-2 w-4/5 rounded-full" />
        <div className="bg-brand/60 h-2 w-2/5 origin-left rounded-full transition-transform duration-700 group-hover:scale-x-150" />
      </div>
    </div>
  );
}

function ChecklistVignette() {
  return (
    <div className="bg-background/85 w-52 space-y-3 rounded-2xl p-4 shadow-sm">
      {["w-4/5", "w-3/5", "w-2/3"].map((width, i) => (
        <div key={width} className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full transition-colors duration-500",
              i < 2 ? "bg-olive" : "group-hover:bg-olive border delay-300"
            )}
          >
            <Check
              className={cn("size-2.5", i === 2 && "opacity-0 transition-opacity delay-300 duration-500 group-hover:opacity-100")}
              strokeWidth={3}
            />
          </span>
          <div className={cn("bg-foreground/15 h-2 rounded-full", width)} />
        </div>
      ))}
    </div>
  );
}

const vignettes: Partial<Record<(typeof serviceKeys)[number], () => JSX.Element>> = {
  ai: ChatVignette,
  audit: ChecklistVignette,
};

export function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          className="mb-10 md:mb-16"
          eyebrow={t("label")}
          title={t.rich("title", rich)}
          subtitle={t("subtitle")}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {serviceKeys.map((key, i) => {
            const { icon: Icon, tint, fill, span } = cards[key];
            const Vignette = vignettes[key];
            return (
              <FeatureCard
                key={key}
                icon={Icon}
                tint={tint}
                accent={fill}
                title={t(`items.${key}.title`)}
                description={t(`items.${key}.description`)}
                illustration={Vignette && <Vignette />}
                illustrationClassName="hidden lg:block"
                className={cn("min-h-60", span)}
                revealIndex={i}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
