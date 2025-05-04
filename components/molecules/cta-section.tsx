"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BodyText } from "@/components/ui/typography"

export interface CTASectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Button text
   * @default "Get early access"
   */
  buttonText?: string;
  
  /**
   * Microcopy text displayed below the form
   * @default "Beta invites roll out weekly."
   */
  microcopy?: string;
  
  /**
   * Button variant
   * @default "gradient"
   */
  buttonVariant?: "default" | "cta" | "gradient" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  /**
   * Button size
   * @default "xl"
   */
  buttonSize?: "default" | "sm" | "md" | "lg" | "xl" | "icon";
  
  /**
   * Input placeholder text
   * @default "Your email address"
   */
  inputPlaceholder?: string;
  
  /**
   * Input type
   * @default "email"
   */
  inputType?: string;
  
  /**
   * Aria label for the input field
   * @default "Enter your email address"
   */
  inputAriaLabel?: string;
  
  /**
   * Callback function when form is submitted
   */
  onFormSubmit?: (value: string) => void;
  
  /**
   * Callback function when button is clicked (deprecated, use onFormSubmit)
   * @deprecated
   */
  onButtonClick?: () => void;
  
  /**
   * Aria label for the button for accessibility
   */
  buttonAriaLabel?: string;
  
  /**
   * Whether to center the content
   * @default false
   */
  centered?: boolean;
  
  /**
   * Text color for microcopy
   * @default "text-foreground"
   */
  microcopyColor?: string;
  
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * CTASection component for call-to-action sections with an input field
 * 
 * @example
 * ```tsx
 * <CTASection /> // Default with preset text and email input
 * <CTASection buttonText="Subscribe" inputPlaceholder="Your email" /> // Custom text
 * <CTASection onFormSubmit={(email) => console.log(email)} /> // Handle form submission
 * ```
 */
export function CTASection({
  buttonText = "Get early access",
  microcopy = "Beta invites roll out weekly.",
  buttonVariant = "gradient",
  buttonSize = "default", // Custom styling will be applied in the JSX
  inputPlaceholder = "Your email address",
  inputType = "email",
  inputAriaLabel = "Enter your email address",
  onFormSubmit,
  onButtonClick,
  buttonAriaLabel,
  centered = false,
  microcopyColor = "text-foreground",
  className,
  ...props
}: CTASectionProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Create a default aria-label if not provided
  const buttonAriaLabelFinal = buttonAriaLabel || `${buttonText}`;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus("idle");
    setErrorMessage("");
    setIsSubmitting(true);
    
    try {
      if (onFormSubmit) {
        await onFormSubmit(inputValue);
        setSubmitStatus("success");
        setInputValue(""); // Clear input on success
      } else {
        // Default implementation - submit to internal API
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: inputValue }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          setSubmitStatus("error");
          setErrorMessage(result.error || 'Something went wrong. Please try again.');
        } else {
          setSubmitStatus("success");
          setInputValue(""); // Clear input on success
        }
      }
      
      // Handle legacy buttonClick callback
      if (onButtonClick) {
        onButtonClick();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset status when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col",
        centered && "items-center text-center",
        className
      )} 
      {...props}
    >
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col gap-2 w-full max-w-lg",
          centered && "items-center"
        )}
        role="form"
      >
        <div className="w-full">
          <Input
            type={inputType}
            placeholder={inputPlaceholder}
            aria-label={inputAriaLabel}
            value={inputValue}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={cn(
              submitStatus === "success" && "border-green-500 bg-green-50 dark:bg-green-900/20",
              submitStatus === "error" && "border-red-500 bg-red-50 dark:bg-red-900/20"
            )}
            required
          />
        </div>
        <div className={cn(centered ? "text-center" : "text-left", "w-full")}>
          <Button
            variant={buttonVariant}
            size={buttonSize}
            aria-label={buttonAriaLabelFinal}
            type="submit"
            disabled={isSubmitting || !inputValue.trim()}
            className={cn(
              "cta-button whitespace-nowrap h-12 text-base font-bold px-10 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSubmitting && "opacity-80 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Processing..." : buttonText}
          </Button>
        </div>
      </form>
      
      {/* Status messages */}
      {submitStatus === "success" && (
        <BodyText 
          className={cn("mt-4 text-green-600 dark:text-green-400")}
        >
          Thank you! You have been added to our waitlist.
        </BodyText>
      )}
      
      {submitStatus === "error" && (
        <BodyText 
          className={cn("mt-4 text-red-600 dark:text-red-400")}
        >
          {errorMessage || "Sorry, there was an error. Please try again."}
        </BodyText>
      )}
      
      {/* Original microcopy if provided and not showing status message */}
      {microcopy && submitStatus === "idle" && (
        <BodyText 
          className={cn("mt-4 opacity-70", microcopyColor)}
        >
          {microcopy}
        </BodyText>
      )}
    </div>
  )
}