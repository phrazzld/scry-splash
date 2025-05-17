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
 * GridItem component for Scry
 *
 * Implements responsive grid cells that work within the Container's grid system.
 * GridItem provides flexible column spanning and positioning capabilities across
 * different breakpoints, allowing for complex responsive layouts.
 *
 * @example
 * ```tsx
 * <Container>
 *   <GridItem span={12} md={6} lg={4}>
 *     <p>Content in a cell that's full width on mobile, half on tablet, third on desktop</p>
 *   </GridItem>
 *   <GridItem span={12} md={6} lg={8}>
 *     <p>Content in a complementary grid cell</p>
 *   </GridItem>
 * </Container>
 * ```
 */

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns to span (out of 12)
   *
   * Controls the default width of the grid cell at all breakpoints,
   * unless overridden by breakpoint-specific props.
   *
   * @default 12 (full width)
   */
  span?: number

  /**
   * Number of columns to span at the small breakpoint (sm: 640px+)
   *
   * Overrides the default span value specifically for small screens and above.
   */
  sm?: number

  /**
   * Number of columns to span at the medium breakpoint (md: 768px+)
   *
   * Overrides the default span value specifically for medium screens and above.
   */
  md?: number

  /**
   * Number of columns to span at the large breakpoint (lg: 1024px+)
   *
   * Overrides the default span value specifically for large screens and above.
   */
  lg?: number

  /**
   * Number of columns to span at the extra large breakpoint (xl: 1280px+)
   *
   * Overrides the default span value specifically for extra large screens and above.
   */
  xl?: number

  /**
   * Starting column position (1-12)
   *
   * Controls the default starting position of the grid cell at all breakpoints,
   * unless overridden by breakpoint-specific start props.
   */
  start?: number

  /**
   * Starting column position at the small breakpoint (sm: 640px+)
   *
   * Overrides the default start position specifically for small screens and above.
   */
  smStart?: number

  /**
   * Starting column position at the medium breakpoint (md: 768px+)
   *
   * Overrides the default start position specifically for medium screens and above.
   */
  mdStart?: number

  /**
   * Starting column position at the large breakpoint (lg: 1024px+)
   *
   * Overrides the default start position specifically for large screens and above.
   */
  lgStart?: number

  /**
   * Starting column position at the extra large breakpoint (xl: 1280px+)
   *
   * Overrides the default start position specifically for extra large screens and above.
   */
  xlStart?: number

  /**
   * Render the grid item as a different HTML element
   *
   * Allows changing the rendered element (e.g., "section", "article") while
   * maintaining the styling and behavior of the GridItem.
   *
   * @default "div"
   */
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