import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-foreground text-lg font-bold tracking-tight",
        className
      )}
    >
      Budapest Labs
    </span>
  );
}
