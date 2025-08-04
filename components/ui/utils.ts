import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines class names using clsx, then merges Tailwind classes to resolve conflicts.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
