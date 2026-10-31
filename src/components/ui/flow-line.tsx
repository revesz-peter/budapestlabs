"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type FlowLineProps = {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  // seconds after the diagram scrolls into view before this line draws
  delay?: number;
  // seconds for one pulse / data dot to travel the line
  duration?: number;
};

type Geometry = { path: string; startX: number; endX: number; width: number; height: number };

const DRAW = 1.2;

/**
 * A curved line between two elements: it draws itself in once, then a soft light pulse
 * and a small data dot keep travelling along it. Recomputes on resize.
 *
 * The dot is hidden (opacity 0) until its SMIL animation is started from JS, so it never
 * shows at the SVG origin before its first run.
 */
export function FlowLine({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  delay = 0,
  duration = 3.2,
}: FlowLineProps) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const motionRef = useRef<SVGAnimateMotionElement>(null);
  const fadeRef = useRef<SVGAnimateElement>(null);
  const inView = useInView(svgRef, { once: true, margin: "-80px" });
  const [geo, setGeo] = useState<Geometry | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const from = fromRef.current;
      const to = toRef.current;
      if (!from || !to) return;

      const c = container.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();

      const startX = a.right - c.left;
      const startY = a.top - c.top + a.height / 2;
      const endX = b.left - c.left;
      const endY = b.top - c.top + b.height / 2;
      const midX = (startX + endX) / 2;

      setGeo({
        path: `M ${startX},${startY} C ${midX},${startY - curvature} ${midX},${endY - curvature} ${endX},${endY}`,
        startX,
        endX,
        width: c.width,
        height: c.height,
      });
    };

    const observer = new ResizeObserver(update);
    observer.observe(container);
    update();
    return () => observer.disconnect();
  }, [containerRef, fromRef, toRef, curvature]);

  // start the data dot once the line has finished drawing
  const hasPath = geo !== null;
  useEffect(() => {
    if (!inView || reduceMotion || !hasPath) return;
    const timer = setTimeout(() => {
      motionRef.current?.beginElement();
      fadeRef.current?.beginElement();
    }, (delay + DRAW) * 1000);
    return () => clearTimeout(timer);
  }, [inView, reduceMotion, hasPath, delay]);

  const gradientId = `flow-${id}`;
  const pulse = geo ? (geo.endX - geo.startX) * 0.45 : 0;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      width={geo?.width ?? 0}
      height={geo?.height ?? 0}
      viewBox={`0 0 ${geo?.width ?? 0} ${geo?.height ?? 0}`}
      className="pointer-events-none absolute inset-0"
      fill="none"
    >
      {geo && (
        <>
          {/* the line itself, drawn in once */}
          <motion.path
            d={geo.path}
            stroke="var(--brand)"
            strokeOpacity={0.28}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: DRAW, delay, ease: [0.22, 1, 0.36, 1] }}
          />

          {!reduceMotion && inView && (
            <>
              {/* a soft light pulse sweeping along the line */}
              <path d={geo.path} stroke={`url(#${gradientId})`} strokeWidth={2} strokeLinecap="round" />
              <defs>
                <motion.linearGradient
                  id={gradientId}
                  gradientUnits="userSpaceOnUse"
                  y1={0}
                  y2={0}
                  initial={{ x1: geo.startX - pulse, x2: geo.startX }}
                  animate={{ x1: [geo.startX - pulse, geo.endX], x2: [geo.startX, geo.endX + pulse] }}
                  transition={{
                    duration,
                    delay: delay + DRAW,
                    repeat: Infinity,
                    repeatDelay: 0.6,
                    ease: [0.45, 0, 0.25, 1],
                  }}
                >
                  <stop stopColor="var(--ochre)" stopOpacity={0} />
                  <stop offset="0.5" stopColor="var(--brand)" />
                  <stop offset="1" stopColor="var(--ochre)" stopOpacity={0} />
                </motion.linearGradient>
              </defs>
            </>
          )}

          {!reduceMotion && (
            // the travelling data dot; stays invisible until started
            <g opacity={0}>
              <circle r={6} fill="var(--brand)" fillOpacity={0.15} />
              <circle r={2.75} fill="var(--brand)" />
              <animateMotion
                ref={motionRef}
                path={geo.path}
                begin="indefinite"
                dur={`${duration + 0.6}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;0.85;1"
                keyPoints="0;1;1"
                keySplines="0.45 0 0.25 1;0 0 1 1"
              />
              <animate
                ref={fadeRef}
                attributeName="opacity"
                begin="indefinite"
                dur={`${duration + 0.6}s`}
                repeatCount="indefinite"
                values="0;1;1;0;0"
                keyTimes="0;0.1;0.75;0.85;1"
              />
            </g>
          )}
        </>
      )}
    </svg>
  );
}
