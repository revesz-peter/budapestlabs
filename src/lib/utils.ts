import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Swap hyphens for non-breaking ones so short headings never wrap mid-compound ("AI-" / "ügynökök")
export function keepHyphens(text: string) {
  return text.replace(/-/g, "‑");
}
