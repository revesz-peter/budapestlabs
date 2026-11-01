"use client";

import { useRef, useState, type UIEvent } from "react";
import { useTranslations } from "next-intl";
import {
  BellRing,
  FileText,
  Handshake,
  Mail,
  MessagesSquare,
  PenLine,
  Phone,
  Sunrise,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, keepHyphens } from "@/lib/utils";

// The Szolgáltatások / Így dolgozunk pastels
const automations = [
  { key: "invoices", icon: FileText, tint: "bg-sand", accent: "bg-stone" },
  { key: "chase", icon: BellRing, tint: "bg-clay/55", accent: "bg-clay" },
  { key: "inbox", icon: Mail, tint: "bg-stone/60", accent: "bg-stone" },
  { key: "reports", icon: Sunrise, tint: "bg-ochre/55", accent: "bg-ochre" },
  { key: "support", icon: MessagesSquare, tint: "bg-olive/55", accent: "bg-olive" },
  { key: "voice", icon: Phone, tint: "bg-moss/45", accent: "bg-moss" },
  { key: "leads", icon: Handshake, tint: "bg-clay/60", accent: "bg-clay" },
  { key: "content", icon: PenLine, tint: "bg-sand", accent: "bg-stone" },
] as const satisfies readonly { key: string; icon: LucideIcon; tint: string; accent: string }[];

/**
 * A compact, fixed-height panel. Desktop: side menu with a progress bar on the left, the examples
 * scroll vertically inside the panel on the right (one per snap stop). Phones: the examples swipe
 * sideways under a horizontal progress bar. Clicking a menu item scrolls the panel to it.
 */
export function AiAutomations() {
  const t = useTranslations("ai.automations");
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  function onScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const horizontal = el.scrollWidth > el.clientWidth + 1;
    const pos = horizontal ? el.scrollLeft : el.scrollTop;
    const size = horizontal ? el.clientWidth : el.clientHeight;
    const max = horizontal ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? pos / max : 0);
    setActive(Math.min(automations.length - 1, Math.round(pos / size)));
  }

  function goTo(i: number) {
    const el = trackRef.current;
    const item = el?.children[i] as HTMLElement | undefined;
    if (!el || !item) return;
    el.scrollTo({ top: item.offsetTop - el.offsetTop, left: item.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  return (
    <div>
      <h3 className="mb-6 max-w-xl text-2xl font-medium tracking-tight text-balance md:text-3xl">{t("label")}</h3>

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-8">
        {/* side menu with progress bar (desktop) */}
        <nav aria-label={t("label")} className="relative max-lg:hidden">
          <div className="bg-foreground/10 absolute top-1 bottom-1 left-0 w-0.5 rounded-full">
            <div
              className="bg-brand w-full rounded-full transition-[height] duration-150"
              style={{ height: `${Math.max(progress, 1 / automations.length) * 100}%` }}
            />
          </div>
          <ol className="space-y-0.5 pl-5">
            {automations.map(({ key }, i) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "true" : undefined}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 py-1.5 text-left text-sm transition-colors",
                    i === active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-foreground/40 w-5 text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {keepHyphens(t(`items.${key}.title`))}
                  {key === "voice" && (
                    <Badge className="bg-brand text-brand-foreground rounded-full px-1.5 py-0 text-[10px]">{t("newBadge")}</Badge>
                  )}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0">
          {/* horizontal progress bar (phones) */}
          <div className="bg-foreground/10 mb-3 h-0.5 overflow-hidden rounded-full lg:hidden">
            <div
              className="bg-brand h-full rounded-full transition-[width] duration-150"
              style={{ width: `${Math.max(progress, 1 / automations.length) * 100}%` }}
            />
          </div>

          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl border [scrollbar-width:none] lg:h-72 lg:snap-y lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto"
          >
            {automations.map(({ key, icon: Icon, tint, accent }, i) => {
              const tools = t.raw(`items.${key}.tools`) as string[];
              return (
                <article
                  key={key}
                  className={cn("grid w-full shrink-0 snap-start gap-5 p-6 md:grid-cols-[1fr_1.15fr] md:gap-8 md:p-8 lg:h-full", tint)}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="bg-background/80 flex size-10 items-center justify-center rounded-xl shadow-sm">
                        <Icon className="size-4.5" strokeWidth={1.6} />
                      </span>
                      <span className="text-foreground/50 text-xs font-medium tabular-nums">
                        {String(i + 1).padStart(2, "0")} / {String(automations.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h4 className="mt-4 flex flex-wrap items-center gap-2 text-xl font-medium text-balance">
                      {keepHyphens(t(`items.${key}.title`))}
                      {key === "voice" && (
                        <Badge className="bg-brand text-brand-foreground rounded-full lg:hidden">{t("newBadge")}</Badge>
                      )}
                    </h4>
                    <span aria-hidden="true" className={cn("mt-2.5 block h-0.5 w-10 rounded-full", accent)} />
                    <p className="text-foreground/70 mt-2.5 text-sm leading-relaxed text-pretty">
                      {keepHyphens(t(`items.${key}.description`))}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-3">
                    <p className="bg-background/60 rounded-2xl p-4 text-sm leading-relaxed text-pretty">
                      <span className="text-brand mb-1 block text-xs font-semibold tracking-wide uppercase">{t("exampleLabel")}</span>
                      {keepHyphens(t(`items.${key}.example`))}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-foreground/55 mr-1 text-[11px] font-semibold tracking-wide uppercase">{t("techLabel")}</span>
                      {tools.map((tool) => (
                        <Badge key={tool} variant="outline" className="bg-background/70 border-foreground/10 rounded-md px-2 py-0.5 font-mono text-[11px] tracking-tight">
                          {keepHyphens(tool)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
