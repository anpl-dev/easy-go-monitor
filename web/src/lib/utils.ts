import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeInput(value: string): string {
  return value.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}