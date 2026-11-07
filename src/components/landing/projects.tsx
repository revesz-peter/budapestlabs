"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, MotionConfig, motion, useIsPresent } from "framer-motion";
import { ArrowUpRight, Maximize2, Plus, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { cn, keepHyphens } from "@/lib/utils";
import { lockedProjects, projects, type Project } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader, rich } from "@/components/landing/section-header";
import { ProjectIcon } from "@/components/landing/project-icon";

const ease = [0.22, 1, 0.36, 1] as const;
// tile ↔ modal is a shared layout animation (same layoutId): a calm glide, no overshoot
const glide = { duration: 0.4, ease };
const lift = { whileHover: { scale: 1.03 }, whileTap: { scale: 0.98 } };
const liftTransition = { type: "spring", stiffness: 320, damping: 30 } as const;
const tileRadius = { borderRadius: 6 };
const modalRadius = { borderRadius: 16 };

// 6 columns on desktop, 4 on phones: 12 cells make a full rectangle on both.
// Plain squares fill the spots in `plainSpots` (first ones first), the "+" square is always last.
const perBlock = 12;
const plainSpots = [1, 6, 9, 4, 10];
const plainTints = ["bg-moss/30", "bg-sand/80", "bg-clay/30", "bg-stone/45", "bg-ochre/30"];

type MosaicCell =
  | { kind: "project"; project: Project }
  | { kind: "locked"; key: string; tint: string }
  | { kind: "plain"; tint: string };

function buildMosaic(): MosaicCell[] {
  const tiles: MosaicCell[] = [
    ...projects.map((project) => ({ kind: "project" as const, project })),
    ...lockedProjects.map(({ key, tint }) => ({ kind: "locked" as const, key, tint })),
  ];
  const total = Math.ceil((tiles.length + 1) / perBlock) * perBlock;
  const plainCount = total - tiles.length - 1;
  // repeats the same scatter in every further block of 12
  const plainAt = new Set(Array.from({ length: plainCount }, (_, i) => plainSpots[i % plainSpots.length] + perBlock * Math.floor(i / plainSpots.length)));
  let plainsPlaced = 0;
  return Array.from({ length: total - 1 }, (_, spot) => {
    const tile = plainAt.has(spot) ? undefined : tiles.shift();
    return tile ?? { kind: "plain", tint: plainTints[plainsPlaced++ % plainTints.length] };
  });
}
const mosaic = buildMosaic();

const tileContent = "flex size-full flex-col items-center justify-center gap-0.5 overflow-hidden p-1.5 text-center md:gap-1";
const tileName = "max-w-full text-[10px] leading-tight font-medium tracking-tight text-balance md:text-[11px]";
const tileFocus = "focus-visible:ring-ochre/60 outline-none focus-visible:ring-4";

// The open project lives in the URL hash, so the back button closes it
const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
};
const readHash = () => window.location.hash.slice(1);
const setHash = (slug?: string) => {
  window.history.pushState(null, "", slug ? `#${slug}` : window.location.pathname);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
};

/** One square of the mosaic: rises in with its neighbours. */
function Cell({ index, className, children }: { index: number; className?: string; children: ReactNode }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.03, ease }}
      className={cn("relative aspect-square can-hover:hover:z-10", className)}
    >
      {children}
    </motion.li>
  );
}

/** A project square: its pixel art and name. Enlarges a little on hover and turns into the modal on click. */
function ProjectTile({ project, onLanded }: { project: Project; onLanded: () => void }) {
  const t = useTranslations("projects");
  const { slug, tint } = project;

  return (
    <motion.button
      type="button"
      layoutId={`project-${slug}`}
      onClick={() => setHash(slug)}
      onLayoutAnimationComplete={onLanded}
      style={tileRadius}
      {...lift}
      transition={{ ...liftTransition, layout: glide }}
      className={cn("absolute inset-0 cursor-pointer", tileContent, tileFocus, tint)}
    >
      <ProjectIcon slug={slug} className="w-1/2 shrink-0" />
      <span className={tileName}>{t(`items.${slug}.name`)}</span>
    </motion.button>
  );
}

/** A screenshot that opens full screen. Nested in the modal's dialog, so Esc closes this first and the modal stays open. */
function ExpandableImage({ src, alt, size }: { src: string; alt: string; size: readonly [number, number] }) {
  const t = useTranslations("projects");
  const [width, height] = size;

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={t("expandImage")}
        className="group/image focus-visible:ring-ochre/60 relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border outline-none focus-visible:ring-4"
      >
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 768px) 340px, 100vw" className="h-auto w-full" />
        {/* always visible: touch screens have no hover or zoom cursor to hint at it */}
        <span className="bg-background/85 text-foreground absolute right-2 bottom-2 rounded-full border p-1.5 transition-transform duration-200 can-hover:group-hover/image:scale-110">
          <Maximize2 className="size-3.5" />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-background/95 fixed inset-0 z-60" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-60 outline-none"
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Close asChild>
            <button type="button" aria-label={t("close")} className="flex size-full cursor-zoom-out items-center justify-center p-4 outline-none md:p-8">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="100vw"
                className="h-auto max-h-full w-auto max-w-full rounded-2xl border"
              />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** The project's info card, grown out of its tile. Scrolls inside itself when the text is longer than the screen. */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const t = useTranslations("projects");
  const { slug, url, image, imageSize, tint, status } = project;
  const tech: readonly string[] = project.tech;
  const name = t(`items.${slug}.name`);
  const solutions = t.raw(`items.${slug}.solutions`) as { title: string; body: string }[];
  // Stays mounted until the glide lands, and must not block the next tile meanwhile.
  // Inline on purpose: Radix sets pointer-events inline, so a class would lose.
  const passThrough = useIsPresent() ? {} : { pointerEvents: "none" as const };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay asChild forceMount>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={passThrough}
            className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild forceMount>
          <motion.div
            layoutId={`project-${slug}`}
            layoutScroll
            style={{ ...modalRadius, ...passThrough }}
            transition={{ layout: glide }}
            className="bg-card fixed inset-0 z-50 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto overscroll-contain border outline-none"
          >
            {/* text would stretch while the card changes size, so it fades in after the glide and leaves before the way back */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.06 } }}
            >
              {/* stays in view while the card scrolls, so closing is always one click away */}
              <div className="bg-card sticky top-0 z-10 flex items-center gap-4 border-b px-5 py-4 md:px-7">
                <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl border", tint)}>
                  <ProjectIcon slug={slug} className="size-8" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                    {t(`items.${slug}.type`)}
                    {status && (
                      <Badge variant="outline" className="border-brand/30 text-brand rounded-md px-2 py-0 text-xs">
                        {t(`status.${status}`)}
                      </Badge>
                    )}
                  </p>
                  <Dialog.Title className="text-2xl font-medium tracking-tight md:text-3xl">{name}</Dialog.Title>
                </div>
                <Dialog.Close
                  aria-label={t("close")}
                  className="text-muted-foreground hover:text-foreground hover:bg-foreground/5 focus-visible:ring-ochre/60 cursor-pointer rounded-full p-2 outline-none transition-colors focus-visible:ring-4"
                >
                  <X className="size-6" />
                </Dialog.Close>
              </div>

              <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.1fr] md:p-7">
                {/* the screenshot and tech stay in view while the text scrolls */}
                <div className="self-start md:sticky md:top-28">
                  {/* natural proportions, never cropped: projects' screenshots differ */}
                  {image && imageSize ? (
                    <ExpandableImage src={image} alt={t("screenshotAlt", { name })} size={imageSize} />
                  ) : (
                    <div className={cn("flex aspect-16/10 items-center justify-center rounded-2xl border", tint)}>
                      <ProjectIcon slug={slug} className="size-24" />
                    </div>
                  )}
                  {tech.length > 0 && (
                    <>
                      <h3 className="text-muted-foreground mt-5 text-xs font-semibold tracking-wide uppercase">{t("techTitle")}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tech.map((item) => (
                          <Badge key={item} variant="outline" className="bg-background/70 border-foreground/10 rounded-md px-2.5 py-1 font-mono text-xs tracking-tight">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                  {url && (
                    <Button asChild className="mt-5 px-5">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {t("visit")}
                        <ArrowUpRight className="ml-1.5 size-4" />
                      </a>
                    </Button>
                  )}
                </div>

                <div>
                  <Dialog.Description className="text-foreground/90 text-lg leading-relaxed text-pretty">
                    {t(`items.${slug}.description`)}
                  </Dialog.Description>
                  <h3 className="text-muted-foreground mt-6 text-xs font-semibold tracking-wide uppercase">{t("solutionsTitle")}</h3>
                  <ul className="mt-2 space-y-4">
                    {solutions.map(({ title, body }) => (
                      <li key={title} className="border-t pt-4">
                        <p className="text-lg font-medium tracking-tight">{title}</p>
                        <p className="text-foreground/80 mt-1 text-base leading-relaxed text-pretty">{keepHyphens(body)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** A mosaic of the projects' pixel art. A click opens the modal, and closing glides it back into its square. */
export function Projects() {
  const t = useTranslations("projects");
  const hash = useSyncExternalStore(subscribe, readHash, () => "");
  const active = projects.find(({ slug }) => slug === hash);
  // the tile stays above its neighbours until it has landed back in its square
  const [lifted, setLifted] = useState<string | null>(null);
  const shownAbove = active?.slug ?? lifted;
  if (active && lifted !== active.slug) setLifted(active.slug);

  return (
    <MotionConfig reducedMotion="user">
      {/* pointer-events-auto: Radix keeps the body unclickable until the modal unmounts, after the glide has landed */}
      <section id="projects" className="pointer-events-auto py-16 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <SectionHeader align="start" className="mx-0" eyebrow={t("label")} title={t.rich("title", rich)} subtitle={t("subtitle")} />

          <ul className="grid w-full max-w-2xl shrink-0 grid-cols-4 gap-0.5 md:grid-cols-6">
            {mosaic.map((cell, i) => {
              if (cell.kind === "project") {
                const { slug } = cell.project;
                return (
                  <Cell key={slug} index={i} className={cn(shownAbove === slug && "z-30")}>
                    <ProjectTile
                      project={cell.project}
                      onLanded={() => {
                        if (!active) setLifted(null);
                      }}
                    />
                  </Cell>
                );
              }
              // under NDA: nothing to open, so no hover either
              if (cell.kind === "locked") {
                return (
                  <Cell key={cell.key} index={i}>
                    <div role="img" aria-label={t("locked.label")} style={tileRadius} className={cn(tileContent, cell.tint)}>
                      <ProjectIcon slug="lock" className="w-1/2 shrink-0" />
                      <span aria-hidden="true" className={tileName}>{t("locked.name")}</span>
                    </div>
                  </Cell>
                );
              }
              return (
                <Cell key={i} index={i}>
                  <div aria-hidden="true" style={tileRadius} className={cn("size-full", cell.tint)} />
                </Cell>
              );
            })}

            <Cell index={mosaic.length}>
              <motion.a
                href="#contact"
                style={tileRadius}
                {...lift}
                transition={liftTransition}
                className={cn("border-foreground/25 bg-olive/40 border border-dashed", tileContent, tileFocus)}
              >
                <Plus className="size-4 shrink-0 md:size-5" />
                <span className={tileName}>{t("cta")}</span>
              </motion.a>
            </Cell>
          </ul>
        </div>
      </section>

      <AnimatePresence>
        {active && <ProjectModal key={active.slug} project={active} onClose={() => setHash()} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
