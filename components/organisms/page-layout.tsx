"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Container, GridItem } from "@/components/ui/container"
import { NoiseBackground } from "@/components/ui/noise-background"
import { Footer } from "@/components/molecules/footer"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Background color for NoiseBackground
   * @default "var(--background)"
   */
  backgroundColor?: string;
  
  /**
   * Noise opacity for NoiseBackground
   * @default 0.02
   */
  noiseOpacity?: number;
  
  /**
   * Maximum width for the Container
   * @default "xl"
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
  
  /**
   * Padding for the Container
   * @default "md"
   */
  padding?: "none" | "sm" | "md" | "lg" | "xl" | "responsive";
  
  /**
   * Whether to center the Container
   * @default false
   */
  centered?: boolean;
  
  /**
   * Whether to animate the content (fade-in)
   * @default true
   */
  animate?: boolean;
  
  /**
   * Whether to show the footer
   * @default true
   */
  showFooter?: boolean;
  
  /**
   * Footer project text
   * @default "a misty step project"
   */
  footerText?: string;
  
  /**
   * Whether to show a prominent theme toggle button in the header
   * @default false
   */
  showThemeToggle?: boolean;
  
  /**
   * Position of the theme toggle button in the header
   * @default "right"
   */
  themeTogglePosition?: "left" | "right";
  
  /**
   * Optional class name for styling
   */
  className?: string;
  
  /**
   * Main content
   */
  children: React.ReactNode;
}

/**
 * PageLayout component for full page layouts with background and grid
 * 
 * Features:
 * - Responsive grid container with customizable max-width
 * - Background with subtle noise texture
 * - Optional footer with project attribution
 * - Optional theme toggle button in header or footer
 * - Animation with fade-in effect
 * 
 * @example
 * ```tsx
 * <PageLayout>
 *   <GridItem span={12} md={8} mdStart={3}>
 *     <div>Content here</div>
 *   </GridItem>
 * </PageLayout>
 * ```
 * 
 * @example
 * ```tsx
 * // With theme toggle button in header
 * <PageLayout showThemeToggle={true}>
 *   <GridItem span={12} md={8} mdStart={3}>
 *     <div>Content here</div>
 *   </GridItem>
 * </PageLayout>
 * ```
 */
export function PageLayout({
  backgroundColor = "var(--background)",
  noiseOpacity = 0.02,
  maxWidth = "xl",
  padding = "md",
  centered = false,
  animate = true,
  showFooter = true,
  footerText = "a misty step project",
  showThemeToggle = false,
  themeTogglePosition = "right",
  className,
  children,
  ...props
}: PageLayoutProps) {
  return (
    <>
      {/* Skip to content link - only visible on keyboard focus */}
      <a 
        href="#main-content" 
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50",
          "px-4 py-2 bg-primary text-primary-foreground rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        )}
      >
        Skip to content
      </a>
      
      <div 
        className={cn(
          "relative min-h-screen flex flex-col justify-start overflow-hidden",
          className
        )} 
        // Landmarks should not be nested, so removing role="main"
        aria-label="Main content"
        {...props}
      >
        {/* Background with noise texture */}
        <NoiseBackground 
          baseColor={backgroundColor}
          noiseOpacity={noiseOpacity}
          className="absolute inset-0 z-0"
          aria-hidden="true"
        />
        
        {/* Theme toggle button (if enabled) */}
        {showThemeToggle && (
          <div 
            className={cn(
              "absolute top-3 sm:top-4 z-20",
              themeTogglePosition === "right" ? "right-3 sm:right-4" : "left-3 sm:left-4",
              animate && "animate-fade-in"
            )}
            data-testid="header-theme-toggle"
          >
            <ThemeToggleButton 
              className={cn(
                "bg-background/50 hover:bg-background/70 backdrop-blur-sm",
                "shadow-md border border-foreground/10",
                "text-foreground/80 hover:text-foreground transition-colors",
              )}
              aria-label="Toggle theme mode"
            />
          </div>
        )}
      
      {/* Main content container */}
      <div 
        className="flex-1 flex flex-col justify-center"
        id="main-content"
        tabIndex={-1} // Allow focus for skip link navigation without affecting tab order
      >
        <Container
          maxWidth={maxWidth}
          padding={padding}
          center={centered}
          className={cn(
            "relative z-10",
            animate && "animate-fade-in"
          )}
        >
          {children}
        </Container>
      </div>
      
      {/* Footer */}
      {showFooter && (
        <div 
          className={cn("relative z-10 mt-auto", animate && "animate-fade-in")}
          // Removing role="contentinfo" to avoid nesting landmarks
        >
          <Footer 
            projectText={footerText} 
            centered={centered}
            showThemeToggle={!showThemeToggle} // Only show theme toggle in footer when not showing in header
          />
        </div>
      )}
    </div>
    </>
  )
}

/**
 * DefaultLayout component for common page layout with centered content
 * 
 * This is a convenience wrapper around PageLayout that configures it with commonly
 * used settings and a single responsive column for content.
 * 
 * @example
 * ```tsx
 * <DefaultLayout>
 *   <h1>Content goes here</h1>
 * </DefaultLayout>
 * ```
 * 
 * @example
 * ```tsx
 * // With theme toggle button in header
 * <DefaultLayout showThemeToggle={true}>
 *   <h1>Content with theme toggle</h1>
 * </DefaultLayout>
 * ```
 */
export function DefaultLayout({
  children,
  showFooter = true,
  footerText = "a misty step project",
  showThemeToggle = false,
  themeTogglePosition = "right",
  ...props
}: Omit<PageLayoutProps, "children"> & { children: React.ReactNode }) {
  return (
    <PageLayout 
      className="flex justify-center" 
      showFooter={showFooter}
      footerText={footerText}
      showThemeToggle={showThemeToggle}
      themeTogglePosition={themeTogglePosition}
      {...props}
    >
      <GridItem 
        span={12} 
        md={10} 
        lg={8}
        className="flex flex-col"
      >
        {children}
      </GridItem>
    </PageLayout>
  )
}