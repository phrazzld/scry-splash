"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { DisplayText, BodyText } from "@/components/ui/typography"
import { Container, GridItem } from "@/components/ui/container"

interface TypewriterHeadlineProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayAfterPhrase?: number
  textColor?: string
  staticPrefix?: string
  /**
   * Value for aria-label to describe the purpose of the headline
   * @default "Main headline with typewriter effect"
   */
  ariaLabel?: string
}

function TypewriterHeadline({
  phrases,
  typingSpeed = 70,    // Faster typing speed (was 100)
  deletingSpeed = 30,  // Faster deleting speed (was 50)
  delayAfterPhrase = 1500, // Shorter delay between phrases (was 2000)
  textColor = "text-foreground", // Default to using foreground text color
  staticPrefix = "Remember ", // Static part that remains constant
  ariaLabel = "Main headline with typewriter effect"
}: TypewriterHeadlineProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [animationStatus, setAnimationStatus] = useState<string>("")
  
  // Reset animation if phrases change
  useEffect(() => {
    setCurrentPhraseIndex(0)
    setDisplayText("")
    setIsDeleting(false)
    setIsWaiting(false)
    setIsComplete(false)
    setAnimationStatus("Starting typewriter animation")
  }, [phrases])
  
  useEffect(() => {
    // If animation is complete, don't do anything else
    if (isComplete) return
    
    let timer: ReturnType<typeof setTimeout>
    const currentPhrase = phrases[currentPhraseIndex]
    const finalPhrase = phrases[phrases.length - 1]
    
    // If waiting, don't do anything until delay is over
    if (isWaiting) {
      // If we've reached the final phrase "everything", stop the animation
      if (currentPhrase === finalPhrase) {
        setIsComplete(true)
        setAnimationStatus(`Typewriter animation completed with text: ${staticPrefix}${currentPhrase}`)
        return
      }
      
      setAnimationStatus(`Pausing on phrase: ${staticPrefix}${currentPhrase}`)
      timer = setTimeout(() => {
        setIsWaiting(false)
        setIsDeleting(true)
        setAnimationStatus(`Deleting phrase: ${staticPrefix}${currentPhrase}`)
      }, delayAfterPhrase)
      return () => clearTimeout(timer)
    }
    
    if (isDeleting) {
      // Deleting text
      if (displayText === "") {
        setIsDeleting(false)
        const nextIndex = (currentPhraseIndex + 1) % phrases.length
        setCurrentPhraseIndex(nextIndex)
        setAnimationStatus(`Starting to type phrase: ${staticPrefix}${phrases[nextIndex]}`)
      } else {
        timer = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        }, deletingSpeed)
      }
    } else {
      // Typing text
      if (displayText === currentPhrase) {
        setIsWaiting(true)
      } else {
        timer = setTimeout(() => {
          const newText = currentPhrase.substring(0, displayText.length + 1)
          setDisplayText(newText)
          if (newText === currentPhrase) {
            setAnimationStatus(`Finished typing phrase: ${staticPrefix}${newText}`)
          }
        }, typingSpeed)
      }
    }
    
    return () => clearTimeout(timer)
  }, [displayText, isDeleting, isWaiting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, delayAfterPhrase, isComplete, staticPrefix])
  
  // Calculate the complete text for screen reader announcements
  const completeText = `${staticPrefix}${displayText}`;
  const screenReaderStatus = isComplete 
    ? "Animation complete" 
    : isDeleting 
      ? "Deleting text" 
      : isWaiting 
        ? "Pausing" 
        : "Typing";

  return (
    <DisplayText 
      className={cn("mb-3 md:mb-4 max-w-prose text-[2.2rem] sm:text-[2.6rem] md:text-[3.2rem] tracking-tighter leading-[1.1]", textColor)}
      style={{ fontWeight: 250 }}
      as="h1"
      weight="regular"
      aria-label={ariaLabel}
    >
      {/* Visually hidden text for screen readers that announces the complete final result */}
      {isComplete && (
        <span className="sr-only">
          {staticPrefix}{phrases[phrases.length - 1]}
        </span>
      )}
      
      {/* Visible display that provides live updates */}
      <span 
        aria-live="polite" 
        aria-atomic="true"
        aria-relevant="additions text"
        className="whitespace-normal md:whitespace-nowrap"
      >
        {completeText}
        {!isComplete && (
          <span 
            className="animate-pulse" 
            aria-hidden="true" // Hide cursor from screen readers
            role="presentation"
          >
            |
          </span>
        )}
      </span>
      
      {/* Extra context for screen readers about the animation status */}
      <span 
        aria-live="polite" 
        className="sr-only" 
        data-testid="typewriter-status"
      >
        {animationStatus}
      </span>
      
      {/* Status indicator for screen readers */}
      <span className="sr-only" aria-live="polite">
        {screenReaderStatus}
      </span>
    </DisplayText>
  )
}

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
  
  /**
   * Enable typewriter animation
   * @default true
   */
  useTypewriterEffect?: boolean
  
  /**
   * Aria label for the logo to describe its purpose
   * @default "Scry logo"
   */
  logoAriaLabel?: string
  
  /**
   * Aria label for the main heading
   * @default "Main heading"
   */
  headingAriaLabel?: string
  
  /**
   * ID for the header section, useful for skip links
   * @default "hero-section"
   */
  sectionId?: string
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
  logoColor = "chalk", // Uses text-foreground via theme
  textColor = "text-foreground",
  centered = false,
  className,
  useTypewriterEffect = true,
  logoAriaLabel = "Scry logo",
  headingAriaLabel = "Main heading",
  sectionId = "hero-section",
  ...props
}: HeroSectionProps) {
  // Phrases for the typewriter effect - only the parts after "Remember "
  const typewriterPhrases = [
    "birthdays.",
    "important dates.",
    "key insights.",
    "effortlessly.",
    "everything."
  ]
  
  return (
    <Container 
      className={cn("py-6 sm:py-8 md:py-12", className)} 
      gap="md"
      gapY="lg"
      padding="responsive"
      id={sectionId}
      role="banner"
      aria-labelledby={useTypewriterEffect ? undefined : "hero-heading"}
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
            aria-label={logoAriaLabel}
          />
        </div>
        
        {/* Headline - either static or typewriter */}
        {useTypewriterEffect ? (
          <TypewriterHeadline 
            phrases={typewriterPhrases} 
            textColor={textColor}
            ariaLabel={headingAriaLabel}
          />
        ) : (
          <DisplayText 
            className={cn("mb-4 max-w-prose text-[2.6rem] md:text-[3.2rem] tracking-tighter leading-[1.1] whitespace-nowrap", textColor)}
            style={{ fontWeight: 250 }}
            as="h1"
            weight="regular"
            id="hero-heading"
          >
            {headline}
          </DisplayText>
        )}
        
        {/* Subheadline - only render if provided */}
        {subheadline && (
          <div 
            className="mb-2 md:mb-4 mt-1 md:mt-0"
            aria-describedby={useTypewriterEffect ? undefined : "hero-heading"}
          >
            <BodyText 
              className={cn("max-w-prose opacity-80 text-sm sm:text-base md:text-body", textColor)}
              // Using a paragraph element for semantic meaning instead of a role
              // Removing role="complementary" as it should be a top-level landmark
            >
              {subheadline}
            </BodyText>
          </div>
        )}
      </GridItem>
    </Container>
  )
}