"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { key: "websites", target: 50, suffix: "+" },
  { key: "delivery", target: 6, prefix: "≤", suffix: "h" },
  { key: "satisfaction", target: 100, suffix: "%" },
] as const;

export function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="px-6 py-20 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0"
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
              <p className="mt-2 text-sm text-white/40">{t(stat.key)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
