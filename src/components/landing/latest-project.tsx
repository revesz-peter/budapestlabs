"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    key: "mamormodels",
    url: "https://mamormodels.vercel.app",
    video: "/projects/mamormodels.mp4",
  },
] as const;

export function LatestProject() {
  const t = useTranslations("latestProject");
  const project = projects[0];

  return (
    <section className="px-6 py-20 md:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground"
          >
            {t("label")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-bold md:text-3xl"
          >
            {t("title")}
          </motion.h2>
        </div>

        {/* Project Card */}
        <motion.a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-hover group block cursor-pointer overflow-hidden"
        >
          {/* Video with browser frame */}
          <div className="p-3 pb-0 md:p-4 md:pb-0">
            <div className="overflow-hidden rounded-t-lg border border-b-0 border-border">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-foreground/3 px-3 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-foreground/15" />
                  <div className="h-2 w-2 rounded-full bg-foreground/15" />
                  <div className="h-2 w-2 rounded-full bg-foreground/15" />
                </div>
                <div className="flex-1 text-center text-[11px] text-muted-foreground">
                  {project.url.replace("https://", "")}
                </div>
              </div>
              {/* Video */}
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                className="aspect-video w-full object-cover object-top"
              />
            </div>
          </div>

          {/* Footer bar */}
          <div className="flex items-center justify-between gap-4 p-4 md:px-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">
                {t(`projects.${project.key}.name`)}
              </span>
              <span className="text-sm text-muted-foreground">
                {t("subtitle")}
              </span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
              {t(`projects.${project.key}.cta`)}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
