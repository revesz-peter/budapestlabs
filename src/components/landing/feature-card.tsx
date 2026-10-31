"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn, keepHyphens } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type FeatureCardProps = {
  icon: LucideIcon;
  // card background, a single pastel (e.g. "bg-clay/55")
  tint: string;
  // the same colour at full strength for the accent line (e.g. "bg-clay")
  accent: string;
  title: string;
  description: ReactNode;
  badge?: ReactNode;
  illustration?: ReactNode;
  illustrationClassName?: string;
  footer?: ReactNode;
  className?: string;
  // extra classes for the title/description block (e.g. tighter top spacing on fixed-height cards)
  bodyClassName?: string;
  // index in the grid: a curtain wipes up to uncover the card when it scrolls into view
  revealIndex?: number;
  // rendered inside a <button> (flip cards): only phrasing elements allowed
  inButton?: boolean;
};

/** The pastel card shared by Szolgáltatások and the AI integration examples. */
export function FeatureCard({
  icon: Icon,
  tint,
  accent,
  title,
  description,
  badge,
  illustration,
  illustrationClassName,
  footer,
  className,
  bodyClassName,
  revealIndex,
  inButton = false,
}: FeatureCardProps) {
  const Box = inButton ? "span" : "div";
  const Title = inButton ? "span" : "h3";
  const Text = inButton ? "span" : "p";

  return (
    <Box className={cn("group relative flex flex-col overflow-hidden rounded-3xl border p-7", tint, className)}>
      {revealIndex !== undefined && !inButton && (
        <motion.div
          aria-hidden="true"
          className="bg-background absolute inset-0 z-20 origin-top"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: (revealIndex % 3) * 0.1, ease }}
        />
      )}

      <span className="bg-background/80 relative flex size-12 items-center justify-center rounded-2xl shadow-sm">
        <Icon className="text-foreground size-5" strokeWidth={1.6} />
      </span>

      {illustration && (
        <span aria-hidden="true" className={cn("absolute top-7 right-7", illustrationClassName)}>
          {illustration}
        </span>
      )}

      <Box className={cn("relative mt-auto space-y-2 pt-10", bodyClassName)}>
        <Title className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-medium text-balance">
          {keepHyphens(title)}
          {badge}
        </Title>
        <span
          aria-hidden="true"
          className={cn("block h-0.5 w-6 origin-left rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-14", accent)}
        />
        <Text className="text-foreground/70 block max-w-md text-sm leading-relaxed text-pretty">{description}</Text>
        {footer}
      </Box>
    </Box>
  );
}
