"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { DisplayText, BodyText } from "@/components/ui/typography"
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
   * @default false
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
  centered = false,
  className,
  ...props
}: HeroSectionProps) {
  return (
    <Container 
      className={cn("py-8 md:py-12", className)} 
      gap="lg"
      padding="none"  
      {...props}
    >
      <GridItem 
        span={12} 
        md={10} 
        lg={8} 
        className={cn(
          "flex flex-col",
          centered && "items-center text-center"
        )}
      >
        {/* Logo */}
        <div className="mb-1">
          <Logo 
            size={logoSize} 
            color={logoColor} 
            as="div"
          />
        </div>
        
        {/* Headline */}
        <DisplayText 
          className={cn("mb-4 max-w-prose text-[2.6rem] md:text-[3.2rem] tracking-tighter leading-[1.1] whitespace-nowrap", textColor)}
          style={{ fontWeight: 250 }}
          as="h1"
          weight="regular"
        >
          {headline}
        </DisplayText>
        
        {/* Subheadline - only render if provided */}
        {subheadline && (
          <div className="mb-2">
            <BodyText 
              className={cn("max-w-prose opacity-80", textColor)}
            >
              {subheadline}
            </BodyText>
          </div>
        )}
      </GridItem>
    </Container>
  )
}