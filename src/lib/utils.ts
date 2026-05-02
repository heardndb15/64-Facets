import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility for conditionally merging Tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a centipawn evaluation to a display string */
export function formatEval(cp: number): string {
  if (Math.abs(cp) >= 10000) return cp > 0 ? "+M" : "-M"; // mate
  const pawns = cp / 100;
  return pawns >= 0 ? `+${pawns.toFixed(1)}` : pawns.toFixed(1);
}

/** Sleep helper */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
