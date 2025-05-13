"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Container component for Scry
 *
 * Implements a 12-column grid system with responsive variants for layout control.
 * The Container provides a consistent, responsive wrapper with configurable width,
 * padding, and spacing options. It serves as the foundation for the grid-based
 * layout system and should be used as the primary layout container.
 *
 * @example
 * ```tsx
 * <Container maxWidth="lg" padding="md" center={true}>
 *   <p>Content inside a centered, large container with medium padding</p>
 * </Container>
 * ```
 */

const containerVariants = cva(
  "grid-container w-full relative",
  {
    variants: {
      maxWidth: {
        none: "",
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
      },
      padding: {
        none: "px-0",
        sm: "px-4",
        md: "px-6",
        lg: "px-8",
        xl: "px-12",
        responsive: "px-responsive",
      },
      center: {
        true: "mx-auto",
      },
      gap: {
        none: "gap-0",
        sm: "gap-sm",
        md: "gap-md",
        lg: "gap-lg",
        xl: "gap-xl",
      },
      gapX: {
        none: "gap-x-0",
        sm: "gap-x-sm",
        md: "gap-x-md",
        lg: "gap-x-lg",
        xl: "gap-x-xl",
      },
      gapY: {
        none: "gap-y-0",
        sm: "gap-y-sm",
        md: "gap-y-md",
        lg: "gap-y-lg",
        xl: "gap-y-xl",
      }
    },
    defaultVariants: {
      maxWidth: "xl",
      padding: "md",
      center: false,
      gap: "md",
    },
  }
)

/**
 * Props for the Container component
 *
 * The Container component provides a responsive, grid-based layout container
 * with configurable width, padding, and spacing options.
 */
export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /**
   * Render the container as a different HTML element
   *
   * Allows changing the rendered element (e.g., "section", "article") while
   * maintaining the styling and behavior of the Container.
   *
   * @default "div"
   */
  as?: React.ElementType

  /**
   * Maximum width constraint for the container
   *
   * Controls the container's maximum width based on standard screen breakpoints.
   *
   * @default "xl" (1280px)
   */
  maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"

  /**
   * Horizontal padding applied to the container
   *
   * Controls the amount of horizontal padding (left and right).
   *
   * @default "md" (1.5rem)
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "responsive"

  /**
   * Center the container horizontally
   *
   * When true, applies margin-auto to horizontally center the container
   * within its parent.
   *
   * @default false
   */
  center?: boolean

  /**
   * Grid gap spacing in both directions
   *
   * Sets uniform gap spacing for both rows and columns.
   * This is overridden by more specific gapX or gapY if provided.
   *
   * @default "md" (1rem)
   */
  gap?: "none" | "sm" | "md" | "lg" | "xl"

  /**
   * Horizontal grid gap spacing
   *
   * Sets gap spacing between columns only. Takes precedence over the 'gap' prop
   * for horizontal spacing.
   */
  gapX?: "none" | "sm" | "md" | "lg" | "xl"

  /**
   * Vertical grid gap spacing
   *
   * Sets gap spacing between rows only. Takes precedence over the 'gap' prop
   * for vertical spacing.
   */
  gapY?: "none" | "sm" | "md" | "lg" | "xl"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    className, 
    maxWidth, 
    padding, 
    center, 
    gap,
    gapX,
    gapY,
    as = "div", 
    ...props 
  }, ref) => {
    const Component = as
    
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ 
          maxWidth, 
          padding, 
          center, 
          gap,
          gapX,
          gapY,
          className 
        }))}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

/**
 * Grid component for grid cell layout within a Container
 */

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  // Column span for different breakpoints
  span?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  // Column start for different breakpoints
  start?: number
  smStart?: number
  mdStart?: number
  lgStart?: number
  xlStart?: number
  // Element type
  as?: React.ElementType
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    className, 
    span = 12, 
    sm, 
    md, 
    lg, 
    xl,
    start,
    smStart,
    mdStart,
    lgStart,
    xlStart, 
    as = "div",
    ...props 
  }, ref) => {
    const Component = as

    // Build the responsive column classes
    const spanClasses = [
      `col-span-${span}`,
      sm && `sm:col-span-${sm}`,
      md && `md:col-span-${md}`,
      lg && `lg:col-span-${lg}`,
      xl && `xl:col-span-${xl}`,
    ].filter(Boolean)

    // Build the responsive start position classes
    const startClasses = [
      start && `col-start-${start}`,
      smStart && `sm:col-start-${smStart}`,
      mdStart && `md:col-start-${mdStart}`,
      lgStart && `lg:col-start-${lgStart}`,
      xlStart && `xl:col-start-${xlStart}`,
    ].filter(Boolean)

    return (
      <Component
        ref={ref}
        className={cn(...spanClasses, ...startClasses, className)}
        {...props}
      />
    )
  }
)
GridItem.displayName = "GridItem"

export { Container, GridItem, containerVariants }