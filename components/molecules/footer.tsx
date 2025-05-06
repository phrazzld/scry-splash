"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Container, GridItem } from "@/components/ui/container"
import { BodyText } from "@/components/ui/typography"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The project attribution text
   * @default "a misty step project"
   */
  projectText?: string
  
  /**
   * Text color
   * @default "text-foreground/40"
   */
  textColor?: string
  
  /**
   * Whether to center the content
   * @default false
   */
  centered?: boolean
  
  /**
   * Whether to show the theme toggle button
   * @default true
   */
  showThemeToggle?: boolean
  
  /**
   * Additional classes for the footer container
   */
  className?: string
}

/**
 * Footer component for site-wide footer content
 * 
 * @example
 * ```tsx
 * <Footer />
 * <Footer projectText="custom attribution" />
 * <Footer centered textColor="text-cobalt/50" />
 * ```
 */
export function Footer({
  projectText = "a misty step project",
  textColor = "text-foreground/40",
  centered = false,
  showThemeToggle = true,
  className,
  ...props
}: FooterProps) {
  return (
    <Container 
      as="footer"
      className={cn("py-6 border-t border-foreground/5", className)} 
      gap="none"
      padding="md"
      {...props}
    >
      <GridItem 
        span={12} 
        md={10} 
        lg={8} 
        className={cn(
          "px-6",
          centered 
            ? "flex flex-col items-center text-center" 
            : "flex flex-row justify-between items-center"
        )}
      >
        <BodyText 
          className={cn("text-xs", textColor)}
          as="p"
        >
          {projectText}
        </BodyText>
        
        {showThemeToggle && (
          <div className={cn(
            centered ? "mt-4" : ""
          )}>
            <ThemeToggleButton 
              className={cn(
                "text-foreground/50 hover:text-foreground transition-colors",
                "bg-transparent hover:bg-transparent"
              )} 
            />
          </div>
        )}
      </GridItem>
    </Container>
  )
}