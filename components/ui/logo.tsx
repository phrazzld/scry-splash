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

export interface LogoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof logoVariants> {
  /**
   * The HTML element to render the logo with
   * @default "h1"
   */
  as?: React.ElementType
}

/**
 * Logo component for Scry
 * 
 * @example
 * ```tsx
 * <Logo /> // Default h1 element with large size
 * <Logo as="div" size="medium" /> // Medium size in a div element
 * <Logo size="small" color="cobalt" /> // Small blue logo
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