"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonialKeys = ["t1", "t2", "t3"] as const;

export function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid gap-6 md:grid-cols-3"
        >
          {testimonialKeys.map((key) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              className="glass-hover p-8"
            >
              {/* Decorative quote */}
              <span className="mb-4 block text-4xl font-bold leading-none text-foreground/10">
                &ldquo;
              </span>

              {/* Stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-foreground/40 text-foreground/40"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mb-6 text-sm leading-relaxed text-foreground/60">
                {t(`items.${key}.quote`)}
              </p>

              {/* Author */}
              <div>
                <p className="text-sm font-medium">{t(`items.${key}.name`)}</p>
                <p className="text-xs text-muted-foreground">
                  {t(`items.${key}.business`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
