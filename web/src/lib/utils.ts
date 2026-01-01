import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prefixPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (path.startsWith("/") && basePath) {
    return `${basePath}${path}`;
  }
  return path;
}
