"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({
  target,
  from,
  suffix = "",
  prefix = "",
}: {
  target: number;
  from?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const startValue = from ?? 0;
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(startValue + eased * (target - startValue)));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, target, startValue]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { key: "experience", target: 8, suffix: "+" },
  { key: "delivery", target: 6, prefix: "≤", suffix: "h" },
  { key: "satisfaction", target: 100, suffix: "%" },
] as const;

const perfStats = [
  { key: "lighthouse", target: 98, suffix: "/100" },
  { key: "loadTime", target: 3, prefix: "0.", suffix: "s" },
  { key: "uptime", target: 99, suffix: ".99%" },
] as const;

export function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="px-6 py-20 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {stats.map((stat) => (
            <div key={stat.key} className="px-8 py-8 text-center">
              <p className="text-4xl font-bold tracking-tight">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  prefix={"prefix" in stat ? stat.prefix : ""}
                />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t(stat.key)}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="glass grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0"
        >
          {perfStats.map((stat) => (
            <div key={stat.key} className="px-8 py-6 text-center">
              <p className="text-3xl font-bold tracking-tight">
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  prefix={"prefix" in stat ? stat.prefix : ""}
                />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t(stat.key)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
