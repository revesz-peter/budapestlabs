"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useEffect } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="recent-work" className="px-6 py-14 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <motion.a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="glass-hover group flex cursor-pointer flex-col gap-5 overflow-hidden p-5 sm:flex-row sm:items-center"
        >
          <video
            ref={videoRef}
            src={project.video}
            poster="/projects/mamormodels.png"
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-video w-full shrink-0 rounded-lg border border-border object-cover object-top sm:w-64"
          />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("label")}
            </p>
            <p className="mt-2 font-semibold">
              {t(`projects.${project.key}.name`)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(`projects.${project.key}.description`)}
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
              {t(`projects.${project.key}.cta`)}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
