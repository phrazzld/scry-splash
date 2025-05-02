"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Container component for Scry
 * 
 * Implements a 12-column grid system with responsive variants
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

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
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