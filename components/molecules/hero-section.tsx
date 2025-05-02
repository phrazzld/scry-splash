"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { HeadingText, BodyText } from "@/components/ui/typography"
import { Container, GridItem } from "@/components/ui/container"

export interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The main headline text
   * @default "Remember effortlessly."
   */
  headline?: string
  
  /**
   * The subheadline text
   * @default "Turns your notes into spaced-repetition prompts—automatically."
   */
  subheadline?: string
  
  /**
   * The logo size
   * @default "default"
   */
  logoSize?: "small" | "medium" | "default" | "large"
  
  /**
   * Whether to center the content
   * @default true
   */
  centered?: boolean
  
  /**
   * Logo color
   * @default "chalk"
   */
  logoColor?: "chalk" | "ink" | "cobalt"
  
  /**
   * Text color for headline and subheadline
   * @default "chalk"
   */
  textColor?: string
  
  /**
   * Optional class name for styling
   */
  className?: string
}

/**
 * HeroSection component for the top section of pages
 * 
 * @example
 * ```tsx
 * <HeroSection />
 * <HeroSection headline="Custom headline" subheadline="Custom subheadline" />
 * <HeroSection logoSize="large" centered={false} />
 * ```
 */
export function HeroSection({
  headline = "Remember effortlessly.",
  subheadline = "Turns your notes into spaced‑repetition prompts—automatically.",
  logoSize = "default",
  logoColor = "chalk",
  textColor = "text-chalk",
  centered = true,
  className,
  ...props
}: HeroSectionProps) {
  return (
    <Container 
      className={cn("py-8 md:py-12", className)} 
      gap="lg"
      {...props}
    >
      <GridItem 
        span={12} 
        md={10} 
        lg={8} 
        mdStart={centered ? 2 : 1} 
        lgStart={centered ? 3 : 1}
        className={cn(
          "flex flex-col",
          centered && "items-center text-center"
        )}
      >
        {/* Logo */}
        <div className="mb-8">
          <Logo 
            size={logoSize} 
            color={logoColor} 
            as="div"
          />
        </div>
        
        {/* Headline */}
        <HeadingText 
          className={cn("mb-4 max-w-prose", textColor)}
          as={centered ? "h2" : "h1"}
        >
          {headline}
        </HeadingText>
        
        {/* Subheadline */}
        <BodyText 
          className={cn("max-w-prose opacity-80", textColor)}
        >
          {subheadline}
        </BodyText>
      </GridItem>
    </Container>
  )
}