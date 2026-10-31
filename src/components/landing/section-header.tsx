"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn, keepHyphens } from "@/lib/utils";

// Tag handlers for t.rich(): <em> in a title renders as the terracotta accent (styled in globals.css)
export const rich = {
  em: (chunks: ReactNode) => <em>{chunks}</em>,
};

const ease = [0.22, 1, 0.36, 1] as const;

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  // "left" centres on small screens and aligns left from lg; "start" is left-aligned everywhere
  align?: "center" | "left" | "start";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  children,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-xl space-y-6",
        align === "center" && "text-center",
        align === "left" && "text-center lg:text-left",
        align === "start" && "text-left",
        className
      )}
    >
      <div className="space-y-5">
        {eyebrow != null && eyebrow !== "" && (
          <div
            className={cn(
              "text-brand flex items-center gap-3 text-xs font-medium tracking-[0.18em] uppercase",
              align === "center" && "justify-center",
              align === "left" && "justify-center lg:justify-start",
              align === "start" && "justify-start"
            )}
          >
            <motion.span
              className="bg-brand h-px w-8 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            />
            {typeof eyebrow === "string" ? keepHyphens(eyebrow) : eyebrow}
          </div>
        )}
        {/* title slides up from behind a mask; padding keeps descenders and italics unclipped.
            The mask itself watches the viewport: the hidden title is fully clipped, so it never "intersects". */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="-mx-[0.1em] overflow-hidden px-[0.1em] pb-[0.15em]"
        >
          <motion.h2
            variants={{ hidden: { y: "105%" }, visible: { y: 0 } }}
            transition={{ duration: 0.9, ease }}
            className="text-balance text-4xl font-medium tracking-tight lg:text-5xl"
          >
            {title}
          </motion.h2>
        </motion.div>
      </div>
      {subtitle != null && subtitle !== "" && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="text-muted-foreground leading-relaxed text-pretty whitespace-pre-line"
        >
          {subtitle}
        </motion.p>
      )}
      {children}
    </div>
  );
}
