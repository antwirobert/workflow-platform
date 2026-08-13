import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const PALETTE = [
  {
    bg: "bg-blue-600 dark:bg-blue-500",
    text: "text-white",
  },
  {
    bg: "bg-emerald-600 dark:bg-emerald-500",
    text: "text-white",
  },
  {
    bg: "bg-violet-600 dark:bg-violet-500",
    text: "text-white",
  },
  {
    bg: "bg-orange-600 dark:bg-orange-500",
    text: "text-white",
  },
  {
    bg: "bg-rose-600 dark:bg-rose-500",
    text: "text-white",
  },
  {
    bg: "bg-teal-600 dark:bg-teal-500",
    text: "text-white",
  },
  {
    bg: "bg-amber-600 dark:bg-amber-500",
    text: "text-white",
  },
  {
    bg: "bg-indigo-600 dark:bg-indigo-500",
    text: "text-white",
  },
];

export function getIdentityColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
