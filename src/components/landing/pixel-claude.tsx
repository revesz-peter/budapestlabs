// Easter eggs: tiny pixel Claude critters hidden around the site. Pure CSS/SVG.
import { cn } from "@/lib/utils";

// 12×9 pixel grid: body with side arms, two eyes, four little legs
const body = [
  [1, 0, 10, 5], // x, y, width, height of the main block
  [0, 2, 1, 1], // left arm
  [11, 2, 1, 1], // right arm
  [2, 5, 1, 2], // legs
  [4, 5, 1, 2],
  [7, 5, 1, 2],
  [9, 5, 1, 2],
];
const eyes = [
  [3, 1, 1, 2],
  [8, 1, 1, 2],
];

/** The critter itself. Size it with className (keep the 4:3 ratio, e.g. h-3.25 w-4.25). */
export function PixelCritter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 9" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {body.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="#D97757" />
      ))}
      {eyes.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="#2A1F19" />
      ))}
    </svg>
  );
}

/** Speech bubble above a critter; shown when `show` classes apply (pass group-hover variants etc.). */
export function PixelBubble({ children, className }: { children: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-foreground text-background pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-lg px-2.5 py-1 text-xs whitespace-nowrap shadow-lg transition-[opacity,translate] duration-300",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Footer: the critter stands in for "Claude" in the "Made with…" line; hops and whispers on hover/focus. */
export function PixelClaude({ whisper }: { whisper: string }) {
  return (
    <span
      tabIndex={0}
      role="img"
      aria-label={whisper}
      className="group/claude relative mx-1 inline-flex translate-y-0.5 cursor-default align-baseline outline-none"
    >
      <PixelCritter className="h-3.25 w-4.25 transition-transform duration-300 group-hover/claude:-translate-y-1 group-focus-visible/claude:-translate-y-1 motion-reduce:transition-none" />
      <PixelBubble className="right-0 left-auto translate-x-0 translate-y-1 opacity-0 group-hover/claude:translate-y-0 group-hover/claude:opacity-100 group-focus-visible/claude:translate-y-0 group-focus-visible/claude:opacity-100">
        {whisper}
      </PixelBubble>
    </span>
  );
}
