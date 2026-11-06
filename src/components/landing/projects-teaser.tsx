"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { lockedProjects, projects } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { SectionHeader, rich } from "@/components/landing/section-header";
import { ProjectIcon } from "@/components/landing/project-icon";
import { Contours } from "@/components/motion-primitives/contours";
import { RollText } from "@/components/motion-primitives/roll-text";

// Where the small squares float inside the panel (% of its width and height). Icons take the first spots.
const spots = [
  [16, 20],
  [33, 50],
  [84, 20],
  [67, 50],
  [16, 80],
  [50, 20],
  [50, 80],
  [84, 80],
] as const;

const driftAnimate = (i: number) => ({ x: [0, i % 2 ? 16 : -16, 0], y: [0, i % 3 ? -16 : 16, 0], rotate: [0, i % 2 ? 4 : -4, 0] });
const driftTransition = (i: number) => ({ duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut" as const, delay: i * 0.3 });

const tileClass = "group/float relative flex size-16 items-center justify-center rounded-2xl border shadow-sm md:size-20";

// Mouse: appears on hover. Touch has no hover, so it stays visible there.
function Label({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("bg-foreground text-background pointer-events-none absolute top-full left-1/2 z-10 mt-1.5 -translate-x-1/2 rounded-md px-1.5 py-0.5 text-[10px] whitespace-nowrap transition-opacity duration-200 can-hover:opacity-0 can-hover:group-hover/float:opacity-100", className)}>
      {children}
    </span>
  );
}

/** A drifting icon. Hover enlarges it, except for locked ones, which have nothing to open. */
function Floater({ index, interactive = true, children }: { index: number; interactive?: boolean; children: ReactNode }) {
  const [left, top] = spots[index];

  return (
    <motion.div
      animate={driftAnimate(index)}
      transition={driftTransition(index)}
      style={{ left: `${left}%`, top: `${top}%` }}
      className="absolute -mt-8 -ml-8 can-hover:hover:z-10 md:-mt-10 md:-ml-10"
    >
      <motion.div
        whileHover={interactive ? { scale: 1.15 } : undefined}
        whileTap={interactive ? { scale: 0.97 } : undefined}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Main page: small project squares drifting over a contour map; each opens in the library. */
export function ProjectsTeaser() {
  const t = useTranslations("projects");
  // the panel holds as many icons as it has spots; the rest are one click away in the library
  const shown = projects.slice(0, spots.length - lockedProjects.length - 1);
  const addSpot = shown.length + lockedProjects.length;
  const ghostSpots = spots.slice(addSpot + 1);

  return (
    <MotionConfig reducedMotion="user">
      <section id="projects" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader align="start" className="mx-0" eyebrow={t("label")} title={t.rich("teaser.title", rich)} subtitle={t("teaser.subtitle")} />
            <Button asChild className="group/roll w-fit shrink-0 px-5">
              <Link href="/projects">
                <RollText>{t("teaser.button")}</RollText>
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>

          <div className="bg-sand/40 relative mt-10 h-80 overflow-hidden rounded-[2rem] border md:mt-12">
            <Contours seed={2.2} rings={6} className="pointer-events-none absolute -top-32 -right-24 size-120 opacity-50" />

            {ghostSpots.map(([left, top], i) => (
              <motion.span
                key={`${left}-${top}`}
                aria-hidden="true"
                animate={driftAnimate(i + addSpot + 1)}
                transition={driftTransition(i + addSpot + 1)}
                style={{ left: `${left}%`, top: `${top}%` }}
                className="border-foreground/15 absolute -mt-6 -ml-6 size-12 rounded-2xl border border-dashed"
              />
            ))}

            {shown.map(({ slug, tint }, i) => (
              <Floater key={slug} index={i}>
                <Link href={`/projects#${slug}`} aria-label={t(`items.${slug}.name`)} className={cn(tileClass, tint)}>
                  <ProjectIcon slug={slug} className="size-10 md:size-12" />
                  <Label>{t(`items.${slug}.name`)}</Label>
                </Link>
              </Floater>
            ))}

            {lockedProjects.map(({ key, tint }, i) => (
              <Floater key={key} index={shown.length + i} interactive={false}>
                <div role="img" aria-label={t("locked.label")} className={cn(tileClass, tint)}>
                  <ProjectIcon slug="lock" className="size-10 md:size-12" />
                  <Label>{t("locked.name")}</Label>
                </div>
              </Floater>
            ))}

            <Floater index={addSpot}>
              <a href="#contact" aria-label={t("cta")} className={cn(tileClass, "border-foreground/25 bg-olive/40 border-dashed")}>
                <Plus className="size-6 md:size-7" />
                <Label className="max-md:hidden">{t("cta")}</Label>
              </a>
            </Floater>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
