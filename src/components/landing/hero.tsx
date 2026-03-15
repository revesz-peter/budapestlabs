"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Calendar,
  Shield,
  Clock,
  CreditCard,
} from "lucide-react";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Mesh gradient background */}
      <MeshGradientBackground
        className="pointer-events-none"
        colors={["#2563eb", "#0d9488", "#3b82f6", "#06b6d4"]}
        speed={0.5}
        backgroundColor="transparent"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
            <Zap className="h-3 w-3" />
            {t("badge")}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <h1 className="text-6xl font-bold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            {t("title")}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-foreground px-8 text-base text-background hover:bg-foreground/90"
          >
            <a href="#contact">
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full border border-foreground/20 text-base text-foreground hover:bg-foreground/5"
          >
            <a
              href="https://cal.com/budapestlabs/demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t("demo")}
            </a>
          </Button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-foreground/30"
        >
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-3 w-3" />
            {t("trust.payAfter")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {t("trust.delivery")}
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            {t("trust.revision")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
