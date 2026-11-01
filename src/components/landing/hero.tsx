"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, CalendarDays, Check, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { PixelCritter } from "@/components/landing/pixel-claude";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Contours } from "@/components/motion-primitives/contours";
import { RollText } from "@/components/motion-primitives/roll-text";
import { keepHyphens } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const riseVariants: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.9, ease },
  }),
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease },
});

type DemoItem = { question: string; answer: string; source: string };
type Phase = "typing" | "thinking" | "answer";

/** Headline words rise from behind a mask; the <em> phrase gets an ochre highlighter sweep. */
function HeroTitle({ text }: { text: string }) {
  const match = text.match(/^(.*?)<em>(.*?)<\/em>(.*)$/);
  const [before, emphasis, after] = match ? match.slice(1) : [text, "", ""];
  // punctuation right after the phrase stays glued to it, so it never wraps onto its own line
  const punctuation = after.match(/^[.,!?:;]+/)?.[0] ?? "";
  const rest = after.slice(punctuation.length);

  let index = 0;
  const words = (part: string): ReactNode[] =>
    part
      .split(/(\s+)/)
      .filter(Boolean)
      .map((word) =>
        /^\s+$/.test(word) ? (
          " "
        ) : (
          // padding keeps descenders and italic overhang inside the mask
          <span key={index} className="-mx-[0.06em] inline-block overflow-hidden px-[0.06em] pb-[0.14em] -mb-[0.14em] align-bottom">
            <motion.span custom={index++} variants={riseVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        )
      );

  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      aria-label={`${before}${emphasis}${after}`}
      className="text-balance text-[1.9rem] leading-[1.08] font-medium tracking-[-0.03em] sm:text-5xl"
    >
      <span aria-hidden="true">
        {words(before)}
        {emphasis && (
          <span className="whitespace-nowrap">
            <em className="relative isolate inline-block">
              <motion.span
                className="bg-ochre absolute inset-x-[-0.02em] bottom-[0.1em] -z-10 h-[0.42em] origin-left rounded-[0.12em] opacity-80 dark:opacity-60"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.9, ease }}
              />
              {words(emphasis)}
            </em>
            {words(punctuation)}
          </span>
        )}
        {words(rest)}
      </span>
    </motion.h1>
  );
}

/** Small note pinned to the chat card's corner: the safety promise at a glance. */
function SafetyNote({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 1.5, ease }}
      className="bg-background absolute -right-3 bottom-[4.25rem] z-10 sm:bottom-24 flex items-center gap-3 rounded-2xl border py-3 pr-5 pl-3 shadow-xl shadow-foreground/10 sm:-right-12"
    >
      <span className="bg-olive flex size-9 shrink-0 items-center justify-center rounded-xl">
        <ShieldCheck className="size-4.5" strokeWidth={1.75} />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground block text-xs">{body}</span>
      </span>
    </motion.div>
  );
}

function HeroChat() {
  const t = useTranslations("hero.chat");
  const items = t.raw("items") as DemoItem[];
  const reduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const item = items[index];

  // typing the question -> thinking -> answer -> next question
  useEffect(() => {
    if (reduceMotion) return;

    if (phase === "typing") {
      const done = typed >= item.question.length;
      const timer = setTimeout(
        () => (done ? setPhase("thinking") : setTyped((count) => count + 1)),
        done ? 250 : 32
      );
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(
      () => {
        if (phase === "thinking") {
          setPhase("answer");
        } else {
          setIndex((i) => (i + 1) % items.length);
          setTyped(0);
          setPhase("typing");
        }
      },
      phase === "thinking" ? 900 : 5200
    );
    return () => clearTimeout(timer);
  }, [phase, typed, item.question.length, items.length, reduceMotion]);

  const shownPhase: Phase = reduceMotion ? "answer" : phase;
  const question = reduceMotion ? item.question : item.question.slice(0, typed);

  return (
    <div className="relative mx-auto w-full max-w-md lg:mr-0">
      <SafetyNote title={t("noteTitle")} body={t("noteBody")} />

      <div className="glass relative rounded-[1.75rem]">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="from-brand to-ochre flex size-10 items-center justify-center rounded-full bg-linear-to-br">
              <Sparkles className="text-brand-foreground size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{t("assistant")}</p>
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <span className="bg-brand-2 size-1.5 rounded-full" />
                {t("status")}
              </p>
            </div>
          </div>
          <span className="bg-sand text-muted-foreground rounded-full px-2.5 py-0.5 text-xs">
            {t("label")}
          </span>
        </div>

        <div className="flex h-72 flex-col gap-4 p-5">
          <p className="bg-foreground text-background ml-auto min-h-10 w-fit max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
            {question}
            {shownPhase === "typing" && (
              <span className="animate-blink ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-current" />
            )}
          </p>

          <AnimatePresence mode="wait">
            {shownPhase === "thinking" && (
              <motion.div
                key={`thinking-${index}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="bg-sand flex w-fit gap-1 rounded-2xl rounded-bl-sm px-4 py-3.5"
              >
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="bg-foreground/50 size-1.5 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
            {shownPhase === "answer" && (
              <motion.div
                key={`answer-${index}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.5, ease }}
                className="max-w-[92%] space-y-2"
              >
                <p className="bg-sand rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed">
                  {item.answer}
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5 pl-1 text-xs">
                  <Lock className="size-3" />
                  {item.source}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t p-3">
          <div className="bg-background/70 flex items-center justify-between rounded-full border py-1.5 pr-1.5 pl-4">
            <span className="text-muted-foreground truncate text-sm">{t("placeholder")}</span>
            <span className="bg-brand text-brand-foreground flex size-7 shrink-0 items-center justify-center rounded-full">
              <ArrowUp className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const trust = t.raw("trust") as string[];

  // background drifts slower than the page, the chat a touch faster
  const { scrollY } = useScroll();
  const contourY = useTransform(scrollY, [0, 800], [0, 180]);
  const chatY = useTransform(scrollY, [0, 800], [0, -50]);

  return (
    <section className="relative overflow-hidden">
      <motion.div aria-hidden="true" style={{ y: contourY }} className="pointer-events-none absolute inset-0">
        <Contours sun className="absolute -top-72 -right-68 size-160 opacity-80 sm:-top-56 sm:-right-52 sm:size-200 sm:opacity-60 lg:-top-64 lg:-right-56 lg:opacity-90" />
        <Contours seed={2.4} rings={8} className="absolute -bottom-72 -left-64 size-160 opacity-60" />
      </motion.div>
      <div aria-hidden="true" className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-20 px-6 pt-32 pb-20 *:min-w-0 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:pt-44 lg:pb-32">
        <div>
          <motion.div {...fadeUp(0)}>
            <Link
              href="#ai"
              className="bg-background/70 hover:border-brand/40 group mb-8 inline-flex w-fit items-center gap-3 rounded-full border p-1 pl-4 backdrop-blur transition-colors duration-300"
            >
              <span className="text-foreground flex items-center gap-2 text-sm">
                <span className="bg-brand size-1.5 shrink-0 rounded-full" />
                {t("badge")}
              </span>
              <span className="bg-sand flex size-7 shrink-0 items-center justify-center rounded-full transition-transform duration-500 group-hover:-rotate-45">
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </motion.div>

          <HeroTitle text={t.raw("title") as string} />

          <motion.p
            {...fadeUp(0.6)}
            className="text-muted-foreground mt-7 max-w-xl text-base leading-relaxed text-pretty whitespace-pre-line md:text-lg"
          >
            {keepHyphens(t("subtitle"))}
          </motion.p>

          <motion.div
            {...fadeUp(0.8)}
            className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="group/roll h-12 rounded-full py-1.5 pr-1.5 pl-6 text-base">
              <Link href="#contact">
                <RollText>{t("cta")}</RollText>
                <span className="bg-brand text-brand-foreground ml-2 flex size-9 items-center justify-center rounded-full transition-transform duration-500 group-hover/roll:-rotate-45">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="group/roll hover:bg-sand relative h-12 rounded-full border px-5 text-base"
            >
              <Link href="https://cal.com/budapestlabs" target="_blank" rel="noopener noreferrer">
                {/* easter egg: a critter peeks over the button's top edge on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 bottom-full translate-y-2 opacity-0 transition-[translate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] can-hover:group-hover/roll:translate-y-0.5 can-hover:group-hover/roll:opacity-100 motion-reduce:transition-none"
                >
                  <PixelCritter className="h-3.5 w-4.5" />
                </span>
                <CalendarDays className="text-muted-foreground" />
                <RollText>{t("demo")}</RollText>
              </Link>
            </Button>
          </motion.div>

          <motion.ul
            {...fadeUp(1)}
            className="text-muted-foreground mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm"
          >
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="bg-olive text-foreground flex size-5 items-center justify-center rounded-full">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div style={{ y: chatY }}>
          <motion.div
            initial={{ opacity: 0, rotateX: 22, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.45, ease }}
            style={{ transformPerspective: 1400, transformOrigin: "50% 100%" }}
          >
            <HeroChat />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
