"use client"

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const logoVariants = cva("font-bold", {
  variants: {
    size: {
      // Default matches original (display text - 5.33rem/64pt)
      default: "text-display",
      // Smaller variants
      small: "text-body", // 1.17rem/14pt
      medium: "text-subheading", // 1.5rem/18pt
      // Larger variant
      large: "text-[6rem]", // Slightly larger than display
    },
    // Color variants mapped to semantic colors for better theming
    color: {
      chalk: "text-foreground", // Default - adapts to current theme
      ink: "text-background", 
      cobalt: "text-primary",
    }
  },
  defaultVariants: {
    size: "default",
    color: "chalk" // chalk maps to foreground
  }
})

/**
 * Props for the Logo component
 *
 * The Logo component provides a consistent rendering of the Scry brand
 * with configurable size, color, and semantic element.
 */
export interface LogoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof logoVariants> {
  /**
   * The HTML element to render the logo with
   *
   * Allows changing the semantic element (e.g., "h1", "div", "span") while
   * maintaining the styling and behavior of the Logo. Use this to adjust
   * the semantic meaning based on the logo's context in the page.
   *
   * @default "h1"
   */
  as?: React.ElementType

  /**
   * Size variant for the logo
   *
   * Controls the display size of the logo text:
   * - default: Large display text (5.33rem/64pt)
   * - small: Body text size (1.17rem/14pt)
   * - medium: Subheading size (1.5rem/18pt)
   * - large: Extra large (6rem)
   *
   * @default "default"
   */
  size?: "default" | "small" | "medium" | "large"

  /**
   * Color variant for the logo
   *
   * Maps to semantic color tokens for consistent theming:
   * - chalk: Uses text-foreground (adapts to current theme)
   * - ink: Uses text-background (inverted from foreground)
   * - cobalt: Uses text-primary (brand accent color)
   *
   * @default "chalk"
   */
  color?: "chalk" | "ink" | "cobalt"
}

/**
 * Logo component for Scry
 *
 * Renders the Scry brand logo with configurable size, color, and semantic element.
 * The logo component automatically adds appropriate accessibility attributes
 * (aria-label="Scry") unless explicitly overridden.
 *
 * Use this component for consistent brand representation across the application,
 * with appropriate semantic meaning based on context (heading, navigation, footer, etc.).
 *
 * @example
 * ```tsx
 * // Default usage as a primary heading
 * <Logo />
 *
 * // Medium size in a non-heading context
 * <Logo as="div" size="medium" />
 *
 * // Small blue logo for navigation or secondary contexts
 * <Logo size="small" color="cobalt" />
 *
 * // Custom styling with additional className
 * <Logo className="my-8 animate-fade-in" />
 * ```
 */
export function Logo({
  className,
  size,
  color,
  as: Component = "h1",
  ...props
}: LogoProps) {
  // Generate aria-label if not explicitly provided
  const ariaProps = props["aria-label"] ? 
    props : 
    { ...props, "aria-label": "Scry" };

  return (
    <Component 
      className={cn(logoVariants({ size, color, className }))}
      {...ariaProps}
    >
      Scry<span className="opacity-70">.</span>
    </Component>
  )
}