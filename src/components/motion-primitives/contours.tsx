"use client";

import { motion, useReducedMotion } from "framer-motion";

const SIZE = 600;
const CENTER = SIZE / 2;

// Deterministic, slightly irregular rings that read like a topographic map
function contourPath(ring: number, rings: number, seed: number) {
  const steps = 120;
  const radius = 34 + ring * ((CENTER - 44) / rings);
  const wobble = 0.035 + ring * 0.006;
  const cx = CENTER + ring * 2.2;
  const cy = CENTER - ring * 1.6;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r =
      radius *
      (1 +
        wobble * Math.sin(3 * a + ring * 0.55 + seed) +
        wobble * 0.6 * Math.cos(5 * a - ring * 0.35 + seed * 2));
    d += `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }
  return `${d}Z`;
}

type ContoursProps = {
  className?: string;
  rings?: number;
  seed?: number;
  // A filled ochre "sun" at the centre of the rings
  sun?: boolean;
};

/** Topographic contour lines that draw themselves in, then turn very slowly. */
export function Contours({ className, rings = 11, seed = 0, sun = false }: ContoursProps) {
  const reduceMotion = useReducedMotion();
  const paths = Array.from({ length: rings }, (_, ring) => contourPath(ring, rings, seed));

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      className={className}
    >
      <g className="animate-spin-slower" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
        {sun && (
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={58}
            fill="var(--ochre)"
            fillOpacity={0.55}
            initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />
        )}
        {paths.map((d, ring) => {
          const accent = ring % 4 === 2;
          return (
            <motion.path
              key={ring}
              d={d}
              stroke={accent ? "var(--brand)" : "var(--contour)"}
              strokeOpacity={accent ? 0.4 : 1}
              strokeWidth={accent ? 1.4 : 1}
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, delay: 0.15 + ring * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
      </g>
    </svg>
  );
}
