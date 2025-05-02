"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Container, GridItem } from "@/components/ui/container"
import { NoiseBackground } from "@/components/ui/noise-background"
import { Footer } from "@/components/molecules/footer"

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Background color for NoiseBackground
   * @default "var(--color-ink)"
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
 * @example
 * ```tsx
 * <PageLayout>
 *   <GridItem span={12} md={8} mdStart={3}>
 *     <div>Content here</div>
 *   </GridItem>
 * </PageLayout>
 * ```
 */
export function PageLayout({
  backgroundColor = "var(--color-ink)",
  noiseOpacity = 0.02,
  maxWidth = "xl",
  padding = "md",
  centered = false,
  animate = true,
  showFooter = true,
  footerText = "a misty step project",
  className,
  children,
  ...props
}: PageLayoutProps) {
  return (
    <div 
      className={cn(
        "relative min-h-screen flex flex-col justify-start overflow-hidden",
        className
      )} 
      role="main"
      {...props}
    >
      {/* Background with noise texture */}
      <NoiseBackground 
        baseColor={backgroundColor}
        noiseOpacity={noiseOpacity}
        className="absolute inset-0 z-0"
      />
      
      {/* Main content container */}
      <div className="flex-1 flex flex-col justify-center">
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
        <div className={cn("relative z-10 mt-auto", animate && "animate-fade-in")}>
          <Footer 
            projectText={footerText} 
            centered={centered}
          />
        </div>
      )}
    </div>
  )
}

/**
 * DefaultLayout component for common page layout with centered content
 * 
 * @example
 * ```tsx
 * <DefaultLayout>
 *   <h1>Content goes here</h1>
 * </DefaultLayout>
 * ```
 */
export function DefaultLayout({
  children,
  showFooter = true,
  footerText = "a misty step project",
  ...props
}: Omit<PageLayoutProps, "children"> & { children: React.ReactNode }) {
  return (
    <PageLayout 
      className="flex justify-center" 
      showFooter={showFooter}
      footerText={footerText}
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