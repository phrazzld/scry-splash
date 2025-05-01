import React from "react"
import { cn } from "@/lib/utils"
import { PageLayout } from "@/components/organisms/page-layout"
import { HeroSection } from "@/components/molecules/hero-section"
import { BenefitTrio } from "@/components/molecules/benefit-trio"
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
   * Benefits array for BenefitTrio
   * @default ["Capture anything", "Review in moments", "Master for life"]
   */
  benefits?: string[];
  
  /**
   * CTA button text
   * @default "Join the wait‑list"
   */
  buttonText?: string;
  
  /**
   * CTA microcopy text
   * @default "Beta invites roll out weekly."
   */
  microcopy?: string;
  
  /**
   * Background color for page
   * @default "var(--color-ink)"
   */
  backgroundColor?: string;
  
  /**
   * Whether to center content
   * @default true
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
   * Whether to use responsive layout for benefits
   * @default "horizontal"
   */
  benefitsLayout?: "horizontal" | "vertical" | "responsive";
  
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
 * <SplashPage benefits={["A", "B", "C"]} buttonText="Sign up now" /> // Custom benefits and CTA
 * ```
 */
export function SplashPage({
  headline = "Remember effortlessly.",
  subheadline = "Turns your notes into spaced‑repetition prompts—automatically.",
  benefits = ["Capture anything", "Review in moments", "Master for life"],
  buttonText = "Join the wait‑list",
  microcopy = "Beta invites roll out weekly.",
  backgroundColor = "var(--color-ink)",
  centered = true,
  animate = true, 
  staggerDelay = 100,
  benefitsLayout = "horizontal",
  onCtaClick,
  className,
  ...props
}: SplashPageProps) {
  // Generate staggered animation delay classes if animation is enabled
  const heroDelay = animate ? { style: { animationDelay: "0ms" } } : {};
  const benefitsDelay = animate ? { style: { animationDelay: `${staggerDelay}ms` } } : {};
  const ctaDelay = animate ? { style: { animationDelay: `${staggerDelay * 2}ms` } } : {};
  
  // Animation classes for fade-in
  const animateClass = animate ? "animate-fade-in opacity-0" : "";
  
  return (
    <PageLayout 
      backgroundColor={backgroundColor}
      animate={false} // We handle our own animation
      centered={centered}
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <div className="flex flex-col items-center w-full max-w-3xl">
        {/* Hero Section */}
        <div className={cn("w-full", animateClass)} {...heroDelay}>
          <HeroSection
            headline={headline}
            subheadline={subheadline}
            centered={centered}
          />
        </div>
        
        {/* Benefits Section */}
        <div className={cn("mt-8 md:mt-10 w-full", animateClass)} {...benefitsDelay}>
          <BenefitTrio
            benefits={benefits}
            layout={benefitsLayout}
            centered={centered}
          />
        </div>
        
        {/* CTA Section */}
        <div className={cn("mt-10 md:mt-12", animateClass)} {...ctaDelay}>
          <CTASection
            buttonText={buttonText}
            microcopy={microcopy}
            centered={centered}
            onButtonClick={onCtaClick}
          />
        </div>
      </div>
    </PageLayout>
  )
}