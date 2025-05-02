"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BodyText } from "@/components/ui/typography"

export interface CTASectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Button text
   * @default "Join the wait‑list"
   */
  buttonText?: string;
  
  /**
   * Microcopy text displayed below the button
   * @default "Beta invites roll out weekly."
   */
  microcopy?: string;
  
  /**
   * Button variant
   * @default "cta"
   */
  buttonVariant?: "default" | "cta" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  /**
   * Button size
   * @default "xl"
   */
  buttonSize?: "default" | "sm" | "md" | "lg" | "xl" | "icon";
  
  /**
   * Callback function when button is clicked
   */
  onButtonClick?: () => void;
  
  /**
   * Aria label for the button for accessibility
   */
  buttonAriaLabel?: string;
  
  /**
   * Whether to center the content
   * @default false
   */
  centered?: boolean;
  
  /**
   * Text color for microcopy
   * @default "text-chalk"
   */
  microcopyColor?: string;
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * CTASection component for call-to-action sections
 * 
 * @example
 * ```tsx
 * <CTASection /> // Default with preset text
 * <CTASection buttonText="Sign up now" microcopy="Limited time offer" /> // Custom text
 * <CTASection buttonVariant="outline" buttonSize="lg" /> // Custom button style
 * ```
 */
export function CTASection({
  buttonText = "Join the wait‑list",
  microcopy = "Beta invites roll out weekly.",
  buttonVariant = "cta",
  buttonSize = "xl",
  onButtonClick,
  buttonAriaLabel,
  centered = false,
  microcopyColor = "text-chalk",
  className,
  ...props
}: CTASectionProps) {
  // Create a default aria-label if not provided
  const ariaLabel = buttonAriaLabel || `${buttonText} - ${microcopy}`;
  
  return (
    <div 
      className={cn(
        "flex flex-col",
        centered && "items-center text-center",
        className
      )} 
      {...props}
    >
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={onButtonClick}
        aria-label={ariaLabel}
        type="button"
      >
        {buttonText}
      </Button>
      
      {microcopy && (
        <BodyText 
          className={cn("mt-4 opacity-70", microcopyColor)}
        >
          {microcopy}
        </BodyText>
      )}
    </div>
  )
}