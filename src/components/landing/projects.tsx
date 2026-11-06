"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, MotionConfig, motion, useIsPresent } from "framer-motion";
import { ArrowUpRight, Plus, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { cn, keepHyphens } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { lockedProjects, projects, type Project } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader, rich } from "@/components/landing/section-header";
import { ProjectIcon } from "@/components/landing/project-icon";

const ease = [0.22, 1, 0.36, 1] as const;
// tile ↔ modal is a shared layout animation (same layoutId): a calm glide, no overshoot
const glide = { duration: 0.4, ease };
const lift = {
  whileHover: { scale: 1.08, boxShadow: "0 12px 28px -14px rgb(0 0 0 / 0.25)" },
  whileTap: { scale: 0.98 },
};
const liftTransition = { type: "spring", stiffness: 320, damping: 30 } as const;
const radius = { borderRadius: 24 };

// 12 divides every grid width (3, 4, 6 columns), so the empty slots always finish the last row
const slots = 12;
const filled = projects.length + lockedProjects.length + 1;
const emptySlots = (slots - (filled % slots)) % slots;

const appear = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.03, ease },
});

// The open project lives in the URL hash: the main page can link straight to it, and the back button closes it
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

/** A project square: enlarges a little on hover and turns into the modal on click. */
function ProjectTile({ project, onLanded }: { project: Project; onLanded: () => void }) {
  const t = useTranslations("projects");
  const { slug, tint, status } = project;

  return (
    <motion.button
      type="button"
      layoutId={`project-${slug}`}
      onClick={() => setHash(slug)}
      onLayoutAnimationComplete={onLanded}
      style={radius}
      {...lift}
      transition={{ ...liftTransition, layout: glide }}
      className="group/tile bg-card focus-visible:ring-ochre/60 absolute inset-0 flex size-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden border p-2 outline-none focus-visible:ring-4"
    >
      {/* the tint sits on a solid base, so an enlarged tile hides its neighbour */}
      <span aria-hidden="true" className={cn("absolute inset-0", tint)} />
      <ProjectIcon slug={slug} className="relative size-1/2 max-h-20" />
      <span className="relative max-w-full truncate text-xs font-medium tracking-tight md:text-sm">{t(`items.${slug}.name`)}</span>
      {status && <span className="text-foreground/65 relative text-[10px] leading-none md:text-xs">{t(`status.${status}`)}</span>}
    </motion.button>
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
            style={{ ...radius, ...passThrough }}
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
                    <Image
                      src={image}
                      alt={t("screenshotAlt", { name })}
                      width={imageSize[0]}
                      height={imageSize[1]}
                      sizes="(min-width: 768px) 340px, 100vw"
                      className="h-auto w-full rounded-2xl border"
                    />
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

/** The library: a wall of squares. Hover enlarges, click opens the modal, closing glides it back into its square. */
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
      <section className="pointer-events-auto pt-32 pb-16 md:pt-44 md:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader as="h1" align="start" className="mx-0" eyebrow={t("label")} title={t.rich("title", rich)} subtitle={t("subtitle")} />

          <ul className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 md:mt-16 md:gap-4 lg:grid-cols-6">
            {projects.map((project, i) => (
              <motion.li
                key={project.slug}
                {...appear(i)}
                className={cn("relative aspect-square can-hover:hover:z-10", shownAbove === project.slug && "z-30")}
              >
                <ProjectTile
                  project={project}
                  onLanded={() => {
                    if (!active) setLifted(null);
                  }}
                />
              </motion.li>
            ))}

            {/* under NDA: nothing to open, nothing to reveal */}
            {lockedProjects.map(({ key, tint }, i) => (
              <motion.li key={key} {...appear(projects.length + i)} aria-label={t("locked.label")} className="relative aspect-square">
                <div className="bg-card absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border p-2 text-center">
                  <span aria-hidden="true" className={cn("absolute inset-0", tint)} />
                  <ProjectIcon slug="lock" className="relative size-1/2 max-h-20" />
                  <span aria-hidden="true" className="relative text-xs font-medium tracking-tight md:text-sm">{t("locked.name")}</span>
                  <span aria-hidden="true" className="text-foreground/65 relative text-[10px] leading-none md:text-xs">{t("locked.note")}</span>
                </div>
              </motion.li>
            ))}

            <motion.li {...appear(filled - 1)} className="relative aspect-square can-hover:hover:z-10">
              <motion.div {...lift} transition={liftTransition} className="absolute inset-0 rounded-3xl">
                <Link
                  href="/#contact"
                  className="border-foreground/25 bg-card focus-visible:ring-ochre/60 relative flex size-full flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border border-dashed p-2 text-center outline-none focus-visible:ring-4"
                >
                  <span aria-hidden="true" className="bg-olive/40 absolute inset-0" />
                  <Plus className="relative size-5 shrink-0 md:size-7" />
                  <span className="relative text-[11px] leading-tight font-medium tracking-tight text-balance md:text-xs">{t("cta")}</span>
                </Link>
              </motion.div>
            </motion.li>

            {Array.from({ length: emptySlots }, (_, i) => (
              <motion.li
                key={i}
                aria-hidden="true"
                {...appear(filled + i)}
                className="border-foreground/10 aspect-square rounded-3xl border border-dashed"
              />
            ))}
          </ul>
        </div>
      </section>

      <AnimatePresence>
        {active && <ProjectModal key={active.slug} project={active} onClose={() => setHash()} />}
      </AnimatePresence>
    </MotionConfig>
  );
}
