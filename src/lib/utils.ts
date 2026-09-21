import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** El helper de shadcn: junta clases y resuelve los choques de Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
