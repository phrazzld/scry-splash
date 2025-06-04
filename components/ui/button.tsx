"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Configuration for button style variants using class-variance-authority
 *
 * Defines the available variants and sizes for the Button component with
 * their corresponding Tailwind CSS classes.
 *
 * Variants:
 * - default: Standard button with primary color and border
 * - cta: Call-to-action button with shadow and scale effect
 * - gradient: Similar to CTA with background gradient effect
 * - destructive: Red button for destructive actions
 * - outline: Transparent with border and hover effect
 * - secondary: Less prominent than primary
 * - ghost: Text-like button with hover effect
 * - link: Underlined text that looks like a link
 *
 * Sizes:
 * - default: Standard size
 * - sm: Small compact button
 * - md: Medium button
 * - lg: Large button with larger text
 * - xl: Extra large button for main CTAs
 * - icon: Square button for icons
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary",
        cta: "bg-primary hover:bg-[--primary-hover] text-white font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all border-0",
        gradient:
          "bg-primary hover:bg-[--primary-hover] text-white font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all border-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-primary bg-transparent hover:bg-primary/10 text-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-primary/10 text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        md: "px-6 py-3 text-body",
        lg: "h-11 rounded-md px-8 text-subheading",
        xl: "px-10 py-4 text-subheading font-normal", // Modified for more breathing room
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Props for the Button component
 *
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement> - All standard button HTML attributes
 * @extends VariantProps<typeof buttonVariants> - Variant props from class-variance-authority
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the component will not render its own DOM element and
   * instead render its child. Used for custom button implementations.
   */
  asChild?: boolean;
}

/**
 * A button component with multiple style variants and sizes
 *
 * @param props - Button props including variant and size options
 * @param ref - React ref forwarded to the button element
 *
 * @example
 * ```tsx
 * // Default button
 * <Button>Click me</Button>
 *
 * // Primary CTA button
 * <Button variant="cta" size="lg">Get Started</Button>
 *
 * // Outline button
 * <Button variant="outline">Learn More</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const Comp = "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

/**
 * Export the Button component and buttonVariants
 *
 * buttonVariants can be used independently for styling other elements
 * with button-like appearance without using the Button component.
 *
 * @example
 * ```tsx
 * // Using buttonVariants directly
 * <Link className={buttonVariants({ variant: "link" })}>
 *   Custom Link with Button Styling
 * </Link>
 * ```
 */
export { Button, buttonVariants };
