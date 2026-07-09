"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = React.ComponentProps<typeof Button> & { duration?: number };

/**
 * Theme toggle with the View Transitions circular reveal, wired through
 * next-themes. Falls back to a plain toggle where the API is unavailable
 * or reduced motion is preferred.
 */
export function ThemeToggle({ className, duration = 450, ...props }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  // Standard next-themes hydration guard — theme is unknown until mounted
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const toggle = useCallback(async () => {
    const next = isDark ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!ref.current || typeof doc.startViewTransition !== "function" || reduce) {
      setTheme(next);
      return;
    }

    await doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(next);
        document.documentElement.classList.toggle("dark", next === "dark");
      });
    }).ready;

    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [isDark, setTheme, duration]);

  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...props}
    >
      {mounted && isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
