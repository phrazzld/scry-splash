"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { PageLayout } from "@/components/organisms/page-layout"
import { HeroSection } from "@/components/molecules/hero-section"
import { CTASection } from "@/components/molecules/cta-section"

export interface SplashPageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Hero headline
   * @default "Remember effortlessly."
   */
  headline?: string;
  
  /**
   * Hero subheadline
   * @default "Turns your notes into spaced‑repetition prompts—automatically."
   */
  subheadline?: string;
  
  /**
   * CTA button text
   * @default "Get early access"
   */
  buttonText?: string;
  
  /**
   * CTA microcopy text
   * @default "Beta invites roll out weekly."
   */
  microcopy?: string;
  
  /**
   * Background color for page
   * @default "var(--background)"
   */
  backgroundColor?: string;
  
  /**
   * Whether to center content
   * @default false
   */
  centered?: boolean;
  
  /**
   * Whether to animate the content
   * @default true
   */
  animate?: boolean;
  
  /**
   * Animation stagger delay in ms between sections
   * @default 100
   */
  staggerDelay?: number;
  
  /**
   * Callback function when CTA button is clicked
   */
  onCtaClick?: () => void;
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * SplashPage component combines all molecules for a complete splash page
 * 
 * @example
 * ```tsx
 * <SplashPage /> // Default with preset content
 * <SplashPage headline="Custom headline" subheadline="Custom subheadline" /> // Custom hero content
 * <SplashPage buttonText="Sign up now" microcopy="Custom microcopy" /> // Custom CTA
 * ```
 */
export function SplashPage({
  headline = "Remember effortlessly.",
  subheadline = "",
  buttonText = "Get early access",
  microcopy = "",
  backgroundColor = "var(--background)",
  centered = false,
  animate = true, 
  staggerDelay = 100,
  onCtaClick,
  className,
  ...props
}: SplashPageProps) {
  // Generate staggered animation delay classes if animation is enabled
  const heroDelay = animate ? { style: { animationDelay: "0ms" } } : {};
  const ctaDelay = animate ? { style: { animationDelay: `${staggerDelay}ms` } } : {};
  
  // Animation classes for fade-in
  const animateClass = animate ? "animate-fade-in opacity-0" : "";
  
  return (
    <PageLayout 
      backgroundColor={backgroundColor}
      animate={false} // We handle our own animation
      centered={centered}
      padding="none"
      className={cn("flex justify-center", className)}
      {...props}
    >
      <div className="flex flex-col w-full max-w-4xl px-3 sm:px-4 md:px-6">
        {/* Hero Section */}
        <div className={cn("w-full", animateClass)} {...heroDelay}>
          <HeroSection
            headline={headline}
            subheadline={subheadline}
            centered={centered}
            logoSize="large"
            textColor="text-foreground"
          />
        </div>
        
        {/* CTA Section */}
        <div className={cn("mt-8 sm:mt-12 md:mt-16", animateClass)} {...ctaDelay}>
          <CTASection
            buttonText={buttonText}
            microcopy={microcopy}
            centered={centered}
            onButtonClick={onCtaClick}
            inputPlaceholder="Your email address"
          />
        </div>
      </div>
    </PageLayout>
  )
}