import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  children,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-xl space-y-6",
        align === "center" ? "text-center" : "text-center lg:text-left",
        className
      )}
    >
      <h2 className="text-4xl font-medium lg:text-5xl">{title}</h2>
      {subtitle != null && subtitle !== "" && (
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
