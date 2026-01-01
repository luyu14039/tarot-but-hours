import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prefixPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/tarot-but-hours";
  if (path.startsWith("/") && basePath) {
    if (path.startsWith(basePath)) return path;
    return `${basePath}${path}`;
  }
  return path;
}
