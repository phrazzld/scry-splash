import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges class names using clsx and tailwind-merge
 *
 * This utility function combines multiple class names or conditional class expressions
 * and then merges any conflicting Tailwind CSS classes using tailwind-merge.
 *
 * @param inputs - Any number of class values, class name strings, objects, or arrays of class names
 * @returns A string of merged class names with Tailwind conflicts resolved
 *
 * @example
 * ```tsx
 * <div className={cn(
 *   "base-class",
 *   isActive && "active-class",
 *   variant === "primary" ? "primary-class" : "secondary-class",
 *   { "conditional-class": condition }
 * )}>
 *   Content
 * </div>
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
