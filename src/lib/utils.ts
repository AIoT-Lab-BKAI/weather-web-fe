import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function setFullHeightFromTop(el: HTMLElement | null) {
  if (el) {
    const rect = el.getBoundingClientRect();
    el.style.height = `calc(100vh - ${rect.top}px)`;
  }
}
