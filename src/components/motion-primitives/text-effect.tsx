"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

type PerType = "word" | "char" | "line";

type TextEffectProps = {
  children: string;
  per?: PerType;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  preset?: "fade-in-blur" | "fade";
  delay?: number;
  speedSegment?: number;
};

const presetVariants: Record<string, { item: Variants }> = {
  "fade-in-blur": {
    item: {
      hidden: { opacity: 0, y: 12, filter: "blur(12px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { type: "spring", bounce: 0.3, duration: 1.5 },
      },
    },
  },
  fade: {
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.4 } },
    },
  },
};

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  div: motion.div,
} as const;

function split(text: string, per: PerType): string[] {
  if (per === "line") return text.split("\n");
  if (per === "char") return text.split("");
  return text.split(/(\s+)/);
}

export function TextEffect({
  children,
  per = "word",
  as = "p",
  className,
  preset = "fade-in-blur",
  delay = 0,
  speedSegment = 1,
}: TextEffectProps) {
  const MotionTag = motionTags[as];
  const segments = split(children, per);
  const baseStagger = per === "char" ? 0.03 : per === "word" ? 0.05 : 0.1;
  const { item } = presetVariants[preset] ?? presetVariants["fade-in-blur"];

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: baseStagger / speedSegment,
        delayChildren: delay,
      },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
      aria-label={children}
    >
      {segments.map((segment, i) => (
        <motion.span
          key={`${per}-${i}-${segment}`}
          aria-hidden="true"
          variants={item}
          className={per === "line" ? "block" : "inline-block whitespace-pre"}
        >
          {segment}
        </motion.span>
      ))}
    </MotionTag>
  );
}
