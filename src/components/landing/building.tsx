"use client";

import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader, rich } from "@/components/landing/section-header";

const ease = [0.22, 1, 0.36, 1] as const;

// Redacted lines: widths in %, one per row
const redacted = [
  [34, 18, 26],
  [22, 40],
];

// The products' colours come from the site palette, darkened: espresso ink for Wrath, deep
// terracotta for Redhorse, linen text. They stay dark in both themes, so they are fixed values
// rather than theme tokens (which would flip to light cards in dark mode).
const linen = "oklch(0.968 0.013 80)";
const ember = "oklch(0.72 0.12 45)";

const wrathCard: CSSProperties = {
  // a faint terracotta glow in one corner
  background: "radial-gradient(80% 90% at 100% 120%, oklch(0.45 0.11 40 / 0.35), transparent 60%), oklch(0.24 0.028 45)",
  color: linen,
  borderColor: "oklch(0.968 0.013 80 / 0.1)",
  boxShadow: "0 24px 48px -24px oklch(0.2 0.03 45 / 0.55)",
};

const redhorseCard: CSSProperties = {
  background: "oklch(0.36 0.1 35)",
  color: linen,
};

// Both cards share one grid cell, so they stack. Wrath sits upper left, Redhorse lower right,
// the same size, so neither reads as the background of the other.
// Names and Wrath's slogan are brand copy, not translated.
// Explicit z-index: once the rise-in ends the front card has no transform, and would paint under the translated ones.
const layer = "relative col-start-1 row-start-1 rounded-xl";

/** Blurred-out lines standing in for details we don't share yet. */
function Redacted({ rows }: { rows: number[][] }) {
  return (
    <div aria-hidden="true" className="mt-4 space-y-2.5">
      {rows.map((row, r) => (
        <div key={r} className="flex gap-2">
          {row.map((w, i) => (
            <span key={i} style={{ width: `${w}%`, background: linen }} className="h-2.5 rounded-[3px] opacity-10" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** The small diamond before a name. It glows a little brighter and fades back, slowly, like a heartbeat. */
function Diamond({ color, glow, delay = 0 }: { color: string; glow: number; delay?: number }) {
  const still = useReducedMotion();
  const shadow = (blur: number) => `0 0 ${blur}px ${color}`;
  return (
    <motion.span
      aria-hidden="true"
      className="size-1.5 shrink-0 rotate-45"
      style={{ background: color }}
      initial={{ opacity: glow, boxShadow: shadow(4) }}
      animate={still ? undefined : { opacity: [glow, 1, glow], boxShadow: [shadow(4), shadow(12), shadow(4)] }}
      transition={{ duration: 2.8, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** What we're building, kept deliberately vague: two separate products as a deck of cards, names only.
 *  Redhorse (cloud agent orchestrator) and Wrath (cyber security audits) stand on their own; neither runs on the other. */
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
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <SectionHeader align="start" className="mx-0" eyebrow={t("label")} title={t.rich("title", rich)} />

        <div className="isolate grid w-full max-w-xl shrink-0">
          {/* Redhorse: deep terracotta, lower right */}
          <motion.div
            {...rise(1)}
            style={redhorseCard}
            className={cn(layer, "z-10 mt-24 ml-8 flex flex-col justify-end p-6 md:ml-14 md:p-8")}
          >
            <span className="flex items-center gap-3 font-mono text-xl tracking-tight">
              <Diamond color={linen} glow={0.45} delay={1.4} />
              redhorse
            </span>
            <Redacted rows={[redacted[1]]} />
          </motion.div>

          {/* Wrath: espresso, upper left */}
          <motion.div {...rise(0)} style={wrathCard} className={cn(layer, "z-20 mr-8 mb-24 border p-6 md:mr-14 md:p-8")}>
            <span className="flex items-center gap-3 font-mono text-xl tracking-tight">
              <Diamond color={ember} glow={0.6} />
              wrath
            </span>
            <p className="mt-8 text-sm italic opacity-75">Righteous fury, automated.</p>
            <Redacted rows={redacted} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
