"use client";

import { useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Contact,
  Database,
  FileText,
  KeyRound,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowLine } from "@/components/ui/flow-line";
import { Contours } from "@/components/motion-primitives/contours";
import { RollText } from "@/components/motion-primitives/roll-text";
import { SectionHeader, rich } from "@/components/landing/section-header";
import { cn, keepHyphens } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const promises = [
  { key: "readonly", icon: ShieldCheck, tint: "bg-olive" },
  { key: "data", icon: Database, tint: "bg-clay" },
  { key: "control", icon: KeyRound, tint: "bg-ochre" },
] as const;

const sources = [
  { key: "invoicing", icon: Receipt, tint: "bg-clay" },
  { key: "webshop", icon: ShoppingBag, tint: "bg-ochre" },
  { key: "crm", icon: Contact, tint: "bg-olive" },
  { key: "documents", icon: FileText, tint: "bg-stone" },
] as const;

function ConnectionDiagram() {
  const t = useTranslations("ai.diagram");
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const sourceRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex h-72 items-center justify-between gap-3 sm:h-80 sm:gap-12"
    >
      <div className="relative z-10 flex flex-col gap-3">
        {sources.map(({ key, icon: Icon, tint }, i) => (
          <motion.div
            key={key}
            ref={sourceRefs[i]}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease }}
            className="bg-background/85 flex items-center gap-1.5 rounded-xl border py-1 pr-2.5 pl-1 text-xs sm:gap-2 sm:rounded-2xl sm:py-1.5 sm:pr-3 sm:pl-1.5 sm:text-sm"
          >
            <span className={cn("flex size-6 items-center justify-center rounded-lg sm:size-7 sm:rounded-xl", tint)}>
              <Icon className="size-3.5" strokeWidth={1.75} />
            </span>
            {t(key)}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div ref={hubRef} className="relative">
          <span aria-hidden="true" className="border-brand/25 absolute -inset-2.5 rounded-full border" />
          {/* slow ripple: the hub "receiving" data */}
          <motion.span
            aria-hidden="true"
            className="bg-brand/15 absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0 }}
            whileInView={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 3.2, delay: 1.5, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" }}
          />
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="from-brand to-ochre relative flex size-14 items-center justify-center rounded-full bg-linear-to-br shadow-lg shadow-brand/20 sm:size-20"
          >
            <Sparkles className="text-brand-foreground size-6" />
          </motion.span>
        </div>
        <span className="text-muted-foreground max-w-20 text-center text-xs font-medium sm:max-w-none sm:whitespace-nowrap">
          {t("hub")}
        </span>
      </div>

      <motion.div
        ref={teamRef}
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.7, ease }}
        className="bg-background/85 relative z-10 flex max-w-20 flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center text-xs text-balance sm:max-w-none sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm sm:whitespace-nowrap"
      >
        <span className="bg-moss flex size-8 items-center justify-center rounded-full">
          <Users className="size-4" strokeWidth={1.75} />
        </span>
        {t("team")}
      </motion.div>

      {sources.map(({ key }, i) => (
        <FlowLine
          key={key}
          containerRef={containerRef}
          fromRef={sourceRefs[i]}
          toRef={hubRef}
          delay={0.2 + i * 0.45}
          duration={3 + i * 0.25}
        />
      ))}
      <FlowLine containerRef={containerRef} fromRef={hubRef} toRef={teamRef} delay={1.1} duration={2.4} />
    </div>
  );
}

export function AiIntegration() {
  const t = useTranslations("ai");
  const examples = t.raw("examples") as string[];

  return (
    <section id="ai" className="px-2 py-8 md:px-4 md:py-16">
      <div className="bg-sand relative overflow-hidden rounded-[2.5rem] border py-16 md:rounded-[3rem] md:py-28">
        <Contours seed={1.2} className="pointer-events-none absolute -top-40 -right-40 size-160 opacity-80" />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-6">
          <div className="grid items-center gap-10 *:min-w-0 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <SectionHeader
              align="start"
              className="mx-0"
              eyebrow={t("label")}
              title={t.rich("title", rich)}
              subtitle={t("subtitle")}
            >
              <div className="space-y-3 text-left">
                <p className="text-muted-foreground text-sm">{t("examplesLabel")}</p>
                <ul className="divide-foreground/10 divide-y border-y border-foreground/10 text-sm">
                  {examples.map((example, i) => (
                    <motion.li
                      key={example}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease }}
                      className="group/q flex items-center justify-between gap-3 py-2.5"
                    >
                      {example}
                      <ArrowRight className="text-brand size-3.5 shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover/q:translate-x-0 group-hover/q:opacity-100" />
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-start">
                <Button asChild size="lg" className="group/roll h-11 rounded-full py-1 pr-1 pl-5">
                  <Link href="https://cal.com/budapestlabs" target="_blank" rel="noopener noreferrer">
                    <RollText>{t("cta")}</RollText>
                    <span className="bg-brand text-brand-foreground ml-2 flex size-9 items-center justify-center rounded-full transition-transform duration-500 group-hover/roll:-rotate-45">
                      <ArrowRight className="size-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </SectionHeader>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease }}
              className="glass rounded-3xl p-3 sm:rounded-4xl sm:p-6"
            >
              <ConnectionDiagram />
            </motion.div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 md:mt-16">
            {promises.map(({ key, icon: Icon, tint }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30, rotate: i === 1 ? 0 : i === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease }}
                className="bg-background/80 space-y-3 rounded-3xl border p-6"
              >
                <span className={cn("flex size-9 items-center justify-center rounded-xl", tint)}>
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <h3 className="font-medium text-balance">{keepHyphens(t(`promises.${key}.title`))}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                  {t(`promises.${key}.body`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
