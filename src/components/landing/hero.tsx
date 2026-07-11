"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import type { Variants } from "framer-motion";

const HERO_VIDEO =
  "https://videos.pexels.com/video-files/35968183/15249566_1920_1080_30fps.mp4";

const stackBrands = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Framer Motion",
  "Vercel",
  "Neon",
  "Better Auth",
  "Resend",
  "Cal.com",
  "Stripe",
] as const;

const transitionVariants: { item: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

function StackWordmark({ name }: { name: string }) {
  return (
    <span className="text-muted-foreground shrink-0 text-sm font-medium tracking-wide whitespace-nowrap">
      {name}
    </span>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const video = videoRef.current;
    if (!video) return;

    if (media.matches) {
      video.pause();
      return;
    }

    video.play().catch(() => undefined);

    const onChange = () => {
      if (media.matches) video.pause();
      else video.play().catch(() => undefined);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="overflow-x-hidden">
      <section>
        <div className="relative">
          <div className="relative z-10 flex aspect-2/3 flex-col justify-end px-6 pt-24 lg:aspect-video lg:px-12 lg:pt-36">
            <div className="mx-auto w-full max-w-7xl pb-6 lg:pb-32">
              <div className="max-w-lg">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#pricing"
                    className="hover:bg-background bg-muted group mb-8 inline-flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-foreground/5 transition-colors duration-300"
                  >
                    <span className="text-foreground text-sm">{t("badge")}</span>
                    <span className="block h-4 w-0.5 border-l border-border bg-border" />
                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="text-balance text-4xl max-md:font-semibold md:text-6xl xl:text-7xl"
                >
                  {t("title")}
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mt-6 text-balance text-base text-foreground md:text-lg"
                >
                  {t("subtitle")}
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center"
                >
                  <Button
                    asChild
                    size="lg"
                    className="h-12 rounded-full pl-5 pr-3 text-base"
                  >
                    <Link href="#contact">
                      <span className="text-nowrap">{t("cta")}</span>
                      <ChevronRight className="ml-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-12 rounded-full px-5 text-base hover:bg-foreground/5"
                  >
                    <Link
                      href="https://cal.com/budapestlabs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-nowrap">{t("demo")}</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-1 overflow-hidden rounded-3xl border border-border aspect-2/3 lg:aspect-video lg:rounded-[3rem]">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="not-dark:invert size-full -scale-x-100 object-cover"
              src={HERO_VIDEO}
            />
          </div>
        </div>
      </section>

      <section className="bg-background py-6">
        <div className="group relative m-auto max-w-7xl px-6">
          <div className="flex flex-col items-center md:flex-row">
            <div className="shrink-0 md:border-r md:pr-6">
              <p className="text-muted-foreground text-center text-sm whitespace-nowrap md:text-end">
                {t("stackLabel")}
              </p>
            </div>
            <div className="relative w-full py-6 md:min-w-0 md:flex-1">
              <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                {stackBrands.map((name) => (
                  <StackWordmark key={name} name={name} />
                ))}
              </InfiniteSlider>

              <div className="from-background absolute inset-y-0 left-0 w-20 bg-linear-to-r" />
              <div className="from-background absolute inset-y-0 right-0 w-20 bg-linear-to-l" />
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
