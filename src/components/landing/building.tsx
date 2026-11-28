"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader, rich } from "@/components/landing/section-header";

const ease = [0.22, 1, 0.36, 1] as const;

// Frosted glass in the site palette: see-through cards over warm glowing orbs (terracotta, ochre,
// olive), with a glass rim (`holo-rim`), a soft sheen (`holo-sheen`) and a light sweep.
// The cards follow the theme: milky glass on linen, smoky glass at night.
// No backdrop-filter and no moving or filter-blurred orbs: re-blurring animated content every frame
// made this section and the navbar (which has its own backdrop blur) flicker. The orbs are already
// soft gradients, so translucent cards over them read as frosted glass anyway.

// Wrath: clear glass. Redhorse: glass tinted terracotta.
const wrathGlass =
  "bg-[oklch(1_0_0/0.38)] shadow-[inset_0_1px_0_oklch(1_0_0/0.7),0_30px_60px_-30px_oklch(0.45_0.1_40/0.45)] dark:bg-[oklch(0.25_0.017_50/0.42)] dark:shadow-[inset_0_1px_0_oklch(1_0_0/0.12),0_30px_60px_-30px_oklch(0_0_0/0.7)]";
const redhorseGlass =
  "bg-[oklch(0.78_0.11_40/0.42)] shadow-[inset_0_1px_0_oklch(1_0_0/0.6),0_30px_60px_-30px_oklch(0.5_0.14_35/0.5)] dark:bg-[oklch(0.45_0.11_38/0.42)] dark:shadow-[inset_0_1px_0_oklch(1_0_0/0.12),0_30px_60px_-30px_oklch(0_0_0/0.7)]";

// Warm orbs behind the deck, static radial gradients: brighter takes on brand, ochre, olive and clay.
// Kept inside the deck's width so they never widen the page on phones.
const blobs = [
  { className: "left-[0%] -top-[6%] size-80", color: "oklch(0.68 0.16 40)" },
  { className: "right-[0%] top-[8%] size-72", color: "oklch(0.84 0.14 78)" },
  { className: "left-[20%] -bottom-[6%] size-64", color: "oklch(0.74 0.11 118)" },
  { className: "right-[14%] bottom-[10%] size-56", color: "oklch(0.74 0.12 25)" },
];

/** The shiny layers on a card: a static glass rim and sheen, and a faint light sweep every few seconds. */
function Holo({ delay = 0 }: { delay?: number }) {
  return (
    <>
      <span aria-hidden="true" className="holo-sheen" />
      {/* translateZ(0) gives the rounded clip its own layer: Safari flickers when a moving child is clipped by overflow + radius */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] [transform:translateZ(0)]">
        <span
          className="absolute inset-y-0 left-0 w-1/2 animate-[holo-shine_11s_ease-in-out_infinite] opacity-70 will-change-transform dark:opacity-40"
          style={{
            background: "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.14) 35%, oklch(1 0 0 / 0.2) 50%, oklch(1 0 0 / 0.14) 65%, transparent)",
            animationDelay: `${1 + delay}s`,
          }}
        />
      </span>
      <span aria-hidden="true" className="holo-rim" />
    </>
  );
}

// Heading on top, then the two glass cards side by side at equal height (stacked on phones), chips pinned to the bottom. Names, Wrath's slogan, the quoted
// descriptions and the chips are English brand copy in every locale, not translated.
// Redhorse is an orchestrator, never "a platform".
const products = {
  redhorse: {
    quote:
      "A cloud-first orchestrator for AI coding agents. They run in parallel in isolated sandboxes, test their own work and come back with a pull request, launched and steered from iOS. Run it in your own cloud, or rent a ready-made server from us in a few clicks. At its core, a transport-layer security runtime enforces deterministic policies, so a prompt injection can't leak secrets or trigger unauthorized tool calls.",
    tech: ["isolated sandboxes", "transport-layer runtime", "deterministic policy", "bring your own cloud", "managed servers", "iOS"],
  },
  wrath: {
    quote:
      "Cybersecurity and UI/UX audits against live systems on a defined set of checks, so vulnerabilities and usability issues surface before users find them.",
    tech: ["live targets", "defined checks", "security", "UI/UX", "runs on Redhorse"],
  },
};
const card = "relative flex flex-col overflow-hidden rounded-xl p-6 md:p-8";
const name = "relative flex items-center gap-3 font-mono text-xl tracking-tight";
const body = "relative mt-3 text-sm text-pretty text-muted-foreground";

/** Tech chips under a card's text, monospace like the badges in the AI examples. */
function Chips({ items }: { items: string[] }) {
  return (
    <ul className="relative mt-auto flex flex-wrap gap-1.5 pt-5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-foreground/10 bg-background/40 px-2 py-0.5 font-mono text-[11px] tracking-tight text-foreground/80"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** The small diamond before a name. It glows brighter, swells very slightly and fades back, like a
 *  heartbeat (`diamond-pulse` in globals.css). Its colour comes from a CSS variable, so it can flip with
 *  the theme: dark on linen, light at night. */
function Diamond({ className, glow, delay = 0 }: { className: string; glow: number; delay?: number }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-2 shrink-0 rotate-45 animate-[diamond-pulse_2.8s_ease-in-out_infinite] bg-(--diamond) shadow-[0_0_8px_var(--diamond)] will-change-[opacity,scale]", className)}
      style={{ "--glow": glow, animationDelay: `${delay}s`, opacity: glow } as CSSProperties}
    />
  );
}

/** What we're building, still in stealth: two products as glass cards: a name, a quoted English description and tech chips.
 *  Redhorse (an orchestrator) runs AI coding agents in isolated sandboxes behind a transport-layer security runtime;
 *  Wrath runs security and UI/UX audits against live systems, on Redhorse. */
export function Building() {
  const t = useTranslations("building");

  const rise = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.6, delay: i * 0.12, ease },
  });

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader align="start" className="mx-0" eyebrow={t("label")} title={t.rich("title", rich)} />

        <div className="relative isolate mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:gap-6">
          {blobs.map((b) => (
            <span
              key={b.color}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -z-10 opacity-55 dark:opacity-35",
                b.className,
              )}
              style={{ background: `radial-gradient(closest-side, ${b.color}, transparent)` }}
            />
          ))}

          {/* Redhorse: terracotta-tinted glass, left */}
          <motion.div {...rise(0)} className={cn(card, redhorseGlass)}>
            <Holo delay={1.4} />
            <h3 className={name}>
              <Diamond className="[--diamond:var(--brand)]" glow={0.7} delay={1.4} />
              redhorse
            </h3>
            <p lang="en" className={body}>“{products.redhorse.quote}”</p>
            <Chips items={products.redhorse.tech} />
          </motion.div>

          {/* Wrath: clear glass, right */}
          <motion.div {...rise(1)} className={cn(card, wrathGlass)}>
            <Holo />
            <h3 className={name}>
              <Diamond className="[--diamond:var(--foreground)]" glow={0.75} />
              wrath
            </h3>
            <p lang="en" className="relative mt-2 text-sm italic text-muted-foreground">Righteous fury, automated.</p>
            <p lang="en" className={body}>“{products.wrath.quote}”</p>
            <Chips items={products.wrath.tech} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
