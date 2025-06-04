"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Typography component for Scry
 *
 * Maps to Scry's design tokens for typography:
 * - Display: 5.33rem (64pt), line-height 1.1, weight 700
 * - Heading: 2.67rem (32pt), line-height 1.2, weight 400
 * - Subheading: 1.5rem (18pt), line-height 1.3, weight 500
 * - Body: 1.17rem (14pt), line-height 1.5, weight 400
 */

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display:
        "text-[2.75rem] md:text-display font-bold leading-[1.1] tracking-tight",
      heading:
        "text-[2rem] md:text-heading font-regular leading-[1.2] tracking-tight",
      subheading: "text-[1.25rem] md:text-subheading font-medium leading-[1.3]",
      body: "text-[1rem] md:text-body font-regular leading-[1.5]",
      small: "text-sm font-regular leading-[1.5]",
      subtle: "text-muted-foreground",
    },
    weight: {
      regular: "font-regular",
      medium: "font-medium",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body",
    weight: undefined, // Use the weight defined by the variant
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /**
   * The HTML element to render
   * If not specified, it will be determined based on the variant:
   * - h1 for display
   * - h2 for heading
   * - h3 for subheading
   * - p for body
   * - span for small and subtle
   */
  as?: React.ElementType;
  children: React.ReactNode;
}

/**
 * Typography component for consistent text styling
 *
 * @example
 * ```tsx
 * <Typography variant="display">Headline Text</Typography>
 * <Typography variant="heading">Section Title</Typography>
 * <Typography variant="subheading">Subsection Title</Typography>
 * <Typography variant="body">Regular paragraph text</Typography>
 * <Typography variant="small">Small text for captions</Typography>
 * <Typography variant="body" weight="bold">Bold body text</Typography>
 * ```
 */
export function Typography({
  className,
  variant,
  weight,
  as,
  children,
  ...props
}: TypographyProps) {
  // Determine the appropriate element based on the variant if not explicitly specified
  const Component =
    as ||
    (variant === "display"
      ? "h1"
      : variant === "heading"
        ? "h2"
        : variant === "subheading"
          ? "h3"
          : variant === "body"
            ? "p"
            : "span");

  return (
    <Component
      className={cn(typographyVariants({ variant, weight, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Typography variants as individual components for convenience
 */

export function DisplayText({
  weight = "bold",
  as = "h1",
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="display" weight={weight} as={as} {...props} />;
}

export function HeadingText({
  weight,
  as = "h2",
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="heading" weight={weight} as={as} {...props} />;
}

export function SubheadingText({
  weight,
  as = "h3",
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="subheading" weight={weight} as={as} {...props} />;
}

export function BodyText({
  weight,
  as = "p",
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="body" weight={weight} as={as} {...props} />;
}

export function SmallText({
  weight,
  as = "span",
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="small" weight={weight} as={as} {...props} />;
}

export function SubtleText({
  weight,
  as = "span",
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="subtle" weight={weight} as={as} {...props} />;
}
