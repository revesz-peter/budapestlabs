import type { ReactNode } from "react";

const roll = "block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Text that rolls up to a fresh copy of itself on hover.
 * The hover target (usually the button) needs the `group/roll` class.
 */
export function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className={`${roll} group-hover/roll:-translate-y-full`}>{children}</span>
      <span aria-hidden="true" className={`${roll} absolute inset-0 translate-y-full group-hover/roll:translate-y-0`}>
        {children}
      </span>
    </span>
  );
}
