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
import { PixelBubble, PixelCritter } from "@/components/landing/pixel-claude";

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
  const barXRef = useRef<HTMLDivElement>(null);
  const barYRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  // The bars follow the exact scroll position (card 1 = 1/8 ... card 8 = 8/8, continuous in between).
  // They are moved with a transform once per frame, without React re-renders or CSS transitions,
  // so they track the finger smoothly.
  function onScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const horizontal = el.scrollWidth > el.clientWidth + 1;
      const pos = horizontal ? el.scrollLeft : el.scrollTop;
      const size = horizontal ? el.clientWidth : el.clientHeight;
      const position = Math.min(automations.length - 1, Math.max(0, pos / size));
      const scale = (position + 1) / automations.length;
      if (barXRef.current) barXRef.current.style.transform = `scaleX(${scale})`;
      if (barYRef.current) barYRef.current.style.transform = `scaleY(${scale})`;
      setActive(Math.round(position));
    });
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
              ref={barYRef}
              className="bg-brand h-full w-full origin-top rounded-full will-change-transform"
              style={{ transform: `scaleY(${1 / automations.length})` }}
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

        <div className="relative min-w-0">
          {/* horizontal progress bar (phones) */}
          <div className="bg-foreground/10 mb-3 h-0.5 overflow-hidden rounded-full lg:hidden">
            <div
              ref={barXRef}
              className="bg-brand h-full w-full origin-left rounded-full will-change-transform"
              style={{ transform: `scaleX(${1 / automations.length})` }}
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

          {/* easter egg: once the last example is reached, a critter peeks over the panel's corner */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute right-8 bottom-full z-10 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-lg:hidden",
              active === automations.length - 1 ? "translate-y-0.5 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <PixelCritter className="h-4 w-5" />
            <PixelBubble className={cn("left-auto right-0 translate-x-0", active === automations.length - 1 ? "opacity-100 delay-300" : "opacity-0")}>
              {t("critter")}
            </PixelBubble>
          </span>
        </div>
      </div>
    </div>
  );
}
