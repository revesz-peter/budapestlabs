"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  BellRing,
  Check,
  FileText,
  Handshake,
  Mail,
  MessagesSquare,
  PenLine,
  Phone,
  RotateCw,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/landing/feature-card";
import { cn, keepHyphens } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

// Small wordless illustrations, one per job. Spans only: they render inside the flip <button>.
const sheet = "bg-background/85 block rounded-xl shadow-sm";
const line = "bg-foreground/15 block h-1.5 rounded-full";

const illustrations: Record<string, ReactNode> = {
  invoices: (
    <span className="relative block h-20 w-24">
      <span className={cn(sheet, "absolute top-2 right-4 h-16 w-14 rotate-6 opacity-60")} />
      <span className={cn(sheet, "absolute top-0 right-0 h-[4.5rem] w-16 space-y-1.5 p-2.5 transition-transform duration-500 group-hover:-translate-y-1")}>
        <span className={cn(line, "w-full")} />
        <span className={cn(line, "w-4/5")} />
        <span className={cn(line, "w-3/5")} />
        <span className="bg-brand/60 block h-1.5 w-2/5 rounded-full" />
      </span>
      <span className="bg-olive absolute right-11 -bottom-1 flex size-6 items-center justify-center rounded-full shadow-sm">
        <Check className="size-3" strokeWidth={2.5} />
      </span>
    </span>
  ),
  chase: (
    <span className="block w-28 space-y-1.5">
      {["translate-x-3", "translate-x-1.5", ""].map((offset, i) => (
        <span key={i} className={cn(sheet, "flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-transform duration-500", offset, i === 2 && "group-hover:-translate-x-1")}>
          <span className={cn("block size-2 shrink-0 rounded-full", i === 2 ? "bg-brand" : "bg-foreground/25")} />
          <span className={cn(line, i === 2 ? "w-full" : "w-3/4")} />
        </span>
      ))}
    </span>
  ),
  inbox: (
    <span className="block w-28 space-y-1.5">
      {["bg-clay", "bg-olive", "bg-ochre"].map((mark, i) => (
        <span key={mark} className={cn(sheet, "flex items-center gap-2 p-1.5 transition-transform duration-500", i === 1 && "translate-x-2 group-hover:translate-x-0")}>
          <span className={cn("block h-4 w-1 shrink-0 rounded-full", mark)} />
          <span className="block flex-1 space-y-1">
            <span className={cn(line, "w-4/5")} />
            <span className={cn(line, "w-1/2 opacity-70")} />
          </span>
        </span>
      ))}
    </span>
  ),
  reports: (
    <span className="relative block w-28">
      <span className="bg-ochre absolute -top-2 -right-2 block size-6 rounded-full shadow-sm" />
      <span className={cn(sheet, "flex h-16 items-end gap-1.5 p-2.5")}>
        {[40, 65, 50, 80, 100].map((h, i) => (
          <span
            key={h}
            className={cn("block w-full origin-bottom rounded-sm transition-transform duration-500 group-hover:scale-y-110", i === 4 ? "bg-brand/70" : "bg-foreground/20")}
            style={{ height: `${h}%` }}
          />
        ))}
      </span>
    </span>
  ),
  support: (
    <span className="block w-28 space-y-2">
      <span className="bg-foreground/85 ml-auto block h-5 w-16 rounded-xl rounded-br-sm transition-transform duration-500 group-hover:-translate-x-1" />
      <span className={cn(sheet, "w-24 space-y-1.5 rounded-bl-sm p-2 transition-transform duration-500 group-hover:translate-x-1")}>
        <span className={cn(line, "w-full")} />
        <span className="bg-brand/60 block h-1.5 w-1/2 rounded-full" />
      </span>
    </span>
  ),
  voice: (
    <span className={cn(sheet, "flex w-28 items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5")}>
      <span className="bg-moss flex size-7 shrink-0 items-center justify-center rounded-full">
        <Phone className="size-3.5" strokeWidth={2} />
      </span>
      <span className="flex h-5 flex-1 items-center gap-0.5">
        {[0.4, 0.8, 0.55, 1, 0.65, 0.35, 0.75, 0.5].map((h, i) => (
          <span
            key={i}
            className="bg-brand/70 block w-0.5 flex-1 rounded-full transition-transform duration-500 group-hover:scale-y-125"
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </span>
    </span>
  ),
  leads: (
    <span className={cn(sheet, "block w-24 space-y-1.5 p-2.5")}>
      <span className={cn(line, "w-3/5")} />
      <span className={cn(line, "w-full opacity-70")} />
      <span className={cn(line, "w-4/5 opacity-70")} />
      <span className="border-foreground/10 flex items-center justify-between border-t pt-1.5">
        <span className="bg-brand/70 block h-1.5 w-1/2 rounded-full" />
        <span className="bg-olive flex size-4 items-center justify-center rounded-full">
          <Check className="size-2.5" strokeWidth={3} />
        </span>
      </span>
    </span>
  ),
  content: (
    <span className="block w-28 space-y-1">
      {["HU", "EN", "DE"].map((lang, i) => (
        <span
          key={lang}
          className={cn(sheet, "flex items-center gap-2 rounded-lg px-2 py-1 transition-transform duration-500", i === 1 && "translate-x-2", i === 2 && "translate-x-4 group-hover:translate-x-1")}
        >
          <span className="text-foreground/60 text-[9px] font-semibold">{lang}</span>
          <span className={cn(line, "flex-1")} />
        </span>
      ))}
    </span>
  ),
};

// Same single-pastel tints as the Szolgáltatások cards
const automations = [
  { key: "invoices", icon: FileText, tint: "bg-clay/55", accent: "bg-clay" },
  { key: "chase", icon: BellRing, tint: "bg-ochre/50", accent: "bg-ochre" },
  { key: "inbox", icon: Mail, tint: "bg-sand", accent: "bg-stone" },
  { key: "reports", icon: Sunrise, tint: "bg-stone/60", accent: "bg-stone" },
  { key: "support", icon: MessagesSquare, tint: "bg-olive/55", accent: "bg-olive" },
  { key: "voice", icon: Phone, tint: "bg-moss/45", accent: "bg-moss" },
  { key: "leads", icon: Handshake, tint: "bg-clay/55", accent: "bg-clay" },
  { key: "content", icon: PenLine, tint: "bg-ochre/50", accent: "bg-ochre" },
] as const satisfies readonly { key: string; icon: LucideIcon; tint: string; accent: string }[];

type Automation = (typeof automations)[number];

/** Front: the shared pastel card. Back: a real-life example and the tools it runs on. Click/tap/Enter flips; a mouse hover only lifts and turns it slightly. */
function FlipCard({ automation, index }: { automation: Automation; index: number }) {
  const t = useTranslations("ai.automations");
  const { key, icon, tint, accent } = automation;
  const item = (field: string) => t(`items.${key}.${field}`);
  const tools = t.raw(`items.${key}.tools`) as string[];
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease }}
      className="[perspective:1200px]"
    >
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        className="group focus-visible:ring-ring relative block h-80 w-full cursor-pointer rounded-3xl text-left outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-4 can-hover:hover:-translate-y-1.5 lg:h-[22rem]"
      >
        <span
          className={cn(
            "relative block size-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]",
            flipped ? "[transform:rotateY(180deg)]" : "can-hover:group-hover:[transform:rotateY(-10deg)]"
          )}
        >
          <FeatureCard
            inButton
            icon={icon}
            tint={tint}
            accent={accent}
            title={item("title")}
            description={keepHyphens(item("short"))}
            illustration={illustrations[key]}
            badge={key === "voice" && <Badge className="bg-brand text-brand-foreground rounded-full">{t("newBadge")}</Badge>}
            footer={
              <span className="text-brand flex items-center gap-1.5 pt-1 text-xs font-medium">
                <RotateCw className="size-3.5 transition-transform duration-500 group-hover:rotate-180" />
                {t("flipHint")}
              </span>
            }
            className="absolute inset-0 [backface-visibility:hidden]"
            bodyClassName="pt-4"
          />

          <span className="bg-foreground text-background absolute inset-0 flex flex-col rounded-3xl p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-ochre text-xs font-semibold tracking-wide uppercase">{t("exampleLabel")}</span>
            <span className="mt-3 block text-sm leading-relaxed text-pretty">{keepHyphens(item("example"))}</span>
            <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
              {tools.map((tool) => (
                <Badge key={tool} variant="outline" className="border-background/20 text-background rounded-full">
                  {keepHyphens(tool)}
                </Badge>
              ))}
            </span>
          </span>
        </span>
      </button>
    </motion.div>
  );
}

export function AiAutomations() {
  const t = useTranslations("ai.automations");

  return (
    <div>
      <div className="mb-8 max-w-xl md:mb-10">
        <h3 className="text-2xl font-medium tracking-tight text-balance md:text-3xl">{t("label")}</h3>
        <p className="text-muted-foreground mt-2 text-pretty">{t("subtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {automations.map((automation, i) => (
          <FlipCard key={automation.key} automation={automation} index={i} />
        ))}
      </div>
    </div>
  );
}
