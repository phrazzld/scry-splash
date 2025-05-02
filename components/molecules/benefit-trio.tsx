"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { SubheadingText, BodyText, HeadingText } from "@/components/ui/typography"

export interface BenefitTrioProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of benefit points to display
   * @default ["Capture anything", "Review in moments", "Master for life"]
   */
  benefits?: string[]
  
  /**
   * Separator character or element to use between benefit points
   * @default "·"
   */
  separator?: React.ReactNode
  
  /**
   * Layout direction for the benefit points
   * @default "horizontal"
   */
  layout?: "horizontal" | "vertical" | "responsive"
  
  /**
   * Typography variant to use for the benefit points
   * @default "subheading"
   */
  variant?: "subheading" | "body" | "heading"
  
  /**
   * Text color class
   * @default "text-chalk"
   */
  textColor?: string
  
  /**
   * Whether to center the content
   * @default false
   */
  centered?: boolean
  
  /**
   * Font weight
   * @default "medium"
   */
  weight?: "regular" | "medium" | "bold"
}

/**
 * BenefitTrio component for displaying the three key benefits
 * 
 * @example
 * ```tsx
 * <BenefitTrio /> // Default with preset benefits
 * <BenefitTrio benefits={["Custom", "Benefit", "Points"]} /> // Custom benefits
 * <BenefitTrio layout="vertical" separator="→" /> // Vertical layout with custom separator
 * ```
 */
export function BenefitTrio({
  benefits = ["Capture anything", "Review in moments", "Master for life"],
  separator = "·",
  layout = "horizontal",
  variant = "subheading",
  textColor = "text-chalk",
  centered = false,
  weight = "medium",
  className,
  ...props
}: BenefitTrioProps) {
  // Ensure exactly 3 benefits are displayed
  const displayBenefits = benefits.slice(0, 3)
  
  // Fill in with placeholders if fewer than 3 benefits provided
  while (displayBenefits.length < 3) {
    displayBenefits.push(`Benefit ${displayBenefits.length + 1}`)
  }
  
  // Common classes for alignment
  const alignmentClasses = centered ? "text-center mx-auto" : ""
  
  // Select the appropriate Typography component based on variant
  const TextComponent = 
    variant === "heading" ? HeadingText : 
    variant === "body" ? BodyText : 
    SubheadingText
  
  // For horizontal layout (default)
  if (layout === "horizontal") {
    return (
      <div 
        className={cn("w-full max-w-prose", alignmentClasses, className)} 
        {...props}
      >
        <TextComponent 
          weight={weight} 
          className={cn(textColor)}
          as="p"
        >
          {displayBenefits[0]}{" "}
          <span className="opacity-60 mx-2">{separator}</span>{" "}
          {displayBenefits[1]}{" "}
          <span className="opacity-60 mx-2">{separator}</span>{" "}
          {displayBenefits[2]}
        </TextComponent>
      </div>
    )
  }
  
  // For vertical layout
  if (layout === "vertical") {
    return (
      <div 
        className={cn("w-full max-w-prose flex flex-col gap-2", alignmentClasses, className)} 
        {...props}
      >
        {displayBenefits.map((benefit, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && separator && (
              <span className="opacity-60 mr-2">{separator}</span>
            )}
            <TextComponent 
              weight={weight} 
              className={cn(textColor)}
              as="p"
            >
              {benefit}
            </TextComponent>
          </div>
        ))}
      </div>
    )
  }
  
  // For responsive layout (horizontal on larger screens, vertical on mobile)
  return (
    <div 
      className={cn("w-full max-w-prose", alignmentClasses, className)} 
      {...props}
    >
      {/* Mobile (vertical) layout */}
      <div className="flex flex-col gap-2 md:hidden">
        {displayBenefits.map((benefit, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && separator && (
              <span className="opacity-60 mr-2">{separator}</span>
            )}
            <TextComponent 
              weight={weight} 
              className={cn(textColor)}
              as="p"
            >
              {benefit}
            </TextComponent>
          </div>
        ))}
      </div>
      
      {/* Desktop (horizontal) layout */}
      <div className="hidden md:block">
        <TextComponent 
          weight={weight} 
          className={cn(textColor)}
          as="p"
        >
          {displayBenefits[0]}{" "}
          <span className="opacity-60 mx-2">{separator}</span>{" "}
          {displayBenefits[1]}{" "}
          <span className="opacity-60 mx-2">{separator}</span>{" "}
          {displayBenefits[2]}
        </TextComponent>
      </div>
    </div>
  )
}