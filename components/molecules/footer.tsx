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
    <footer className={cn("relative", className)} {...props} data-testid="footer">
      {/* Full-width border separator */}
      <div className="w-full border-t border-foreground/5" />
      
      <div className="relative">
        {/* Footer content with proper padding */}
        <Container 
          className="py-4 sm:py-6" 
          gap="none"
          padding="responsive"
        >
          <GridItem 
            span={12}
            className={cn(
              centered 
                ? "flex flex-col items-center text-center" 
                : "flex items-center"
            )}
          >
            <BodyText 
              className={cn("text-xs", textColor)}
              as="p"
              data-testid="footer-attribution"
            >
              {projectText}
            </BodyText>
          </GridItem>
        </Container>
        
        {/* Theme toggle positioned absolutely at right edge */}
        {showThemeToggle && !centered && (
          <div 
            className="absolute right-4 top-1/2 -translate-y-1/2 sm:right-6"
            data-testid="footer-theme-toggle"
          >
            <ThemeToggleButton 
              className={cn(
                "text-foreground/50 hover:text-foreground transition-colors",
                "bg-transparent hover:bg-transparent"
              )} 
            />
          </div>
        )}
      </div>
      
      {/* Centered theme toggle if centered mode */}
      {showThemeToggle && centered && (
        <Container padding="responsive">
          <div className="flex justify-center pb-4">
            <ThemeToggleButton 
              className={cn(
                "text-foreground/50 hover:text-foreground transition-colors",
                "bg-transparent hover:bg-transparent"
              )} 
              data-testid="footer-theme-toggle"
            />
          </div>
        </Container>
      )}
    </footer>
  )
}