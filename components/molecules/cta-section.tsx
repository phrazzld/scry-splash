"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FORMSPARK } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BodyText } from "@/components/ui/typography";

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

  // Note: buttonVariant has been removed as we now use direct styling via className

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
   * Form action URL for Formspark
   * @default "https://submit-form.com/rq22voxgX"
   */
  formAction?: string;

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
 * <CTASection formAction="https://submit-form.com/your-form-id" /> // Custom Formspark form
 * ```
 */
export function CTASection({
  buttonText = "Get early access",
  microcopy = "Beta invites roll out weekly.",
  buttonSize = "default", // Custom styling will be applied in the JSX
  inputPlaceholder = "Your email address",
  inputType = "email",
  inputAriaLabel = "Enter your email address",
  onFormSubmit,
  onButtonClick,
  buttonAriaLabel,
  centered = false,
  microcopyColor = "text-foreground",
  formAction = FORMSPARK.SUBMIT_URL,
  className,
  ...props
}: CTASectionProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
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
        // If custom form submission handler is provided, use that
        await onFormSubmit(inputValue);
        setSubmitStatus("success");
        setInputValue(""); // Clear input on success
      } else {
        // Default implementation - submit to Formspark
        const response = await fetch(formAction, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: inputValue }),
        });

        // Check if response is ok (status in 200-299 range)
        if (!response.ok) {
          let errorText = "Something went wrong. Please try again.";

          // Try to get error details from response
          try {
            const errorData = await response.json();
            errorText = errorData.error || errorText;
          } catch (parseError) {
            console.error("Error parsing error response:", parseError);
          }

          setSubmitStatus("error");
          setErrorMessage(errorText);
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
      setErrorMessage("An unexpected error occurred. Please try again.");
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
    <div className={cn("px-4 sm:px-6 lg:px-8 w-full", className)} {...props}>
      <div
        className={cn("w-full max-w-none mx-auto", centered && "text-center")}
      >
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex flex-col gap-3 w-full max-w-2xl mx-auto",
            centered && "items-center",
          )}
          aria-labelledby="cta-form-heading"
          data-testid="cta-form"
          noValidate
        >
          {/* Invisible heading for screen readers */}
          <div className="sr-only" id="cta-form-heading">
            Get early access form
          </div>

          {/* Honeypot field for spam protection - will be hidden via CSS */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="w-full">
            <label htmlFor="email-input" className="sr-only">
              {inputAriaLabel || "Enter your email address"}
            </label>
            <Input
              id="email-input"
              type={inputType}
              name="email"
              placeholder={inputPlaceholder}
              aria-label={inputAriaLabel}
              aria-required={true}
              aria-invalid={submitStatus === "error"}
              aria-describedby={
                submitStatus === "error"
                  ? "cta-error-message"
                  : submitStatus === "success"
                    ? "cta-success-message"
                    : undefined
              }
              value={inputValue}
              onChange={handleInputChange}
              disabled={isSubmitting}
              data-testid="cta-email-input"
              style={{ minWidth: "400px", width: "100%" }}
              className={cn(
                submitStatus === "success" &&
                  "border-green-500 bg-green-50 dark:bg-green-900/20",
                submitStatus === "error" &&
                  "border-red-500 bg-red-50 dark:bg-red-900/20",
              )}
              required
            />
          </div>
          <div className="w-full">
            <Button
              variant="cta"
              size={buttonSize}
              aria-label={buttonAriaLabelFinal}
              aria-busy={isSubmitting}
              type="submit"
              disabled={isSubmitting || !inputValue.trim()}
              data-testid="cta-submit-button"
              className={cn(
                "whitespace-nowrap h-12 text-base font-bold px-6 sm:px-10 py-3 w-full sm:w-auto bg-[#0047AB] text-white hover:bg-[#003d91]",
                isSubmitting && "opacity-80 cursor-not-allowed",
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
            data-testid="cta-success-message"
            id="cta-success-message"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span role="img" aria-label="Success" className="mr-2">
              ✅
            </span>
            Thank you! Your email has been submitted successfully. We&apos;ll be
            in touch soon.
          </BodyText>
        )}

        {submitStatus === "error" && (
          <BodyText
            className={cn("mt-4 text-red-600 dark:text-red-400")}
            data-testid="cta-error-message"
            id="cta-error-message"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <span role="img" aria-label="Error" className="mr-2">
              ⚠️
            </span>
            {errorMessage ||
              "Sorry, there was an error submitting your email. Please try again."}
          </BodyText>
        )}

        {/* Original microcopy if provided and not showing status message */}
        {microcopy && submitStatus === "idle" && (
          <BodyText
            className={cn("mt-4 opacity-70", microcopyColor)}
            id="cta-microcopy"
            aria-hidden={submitStatus !== "idle"} // Hide from screen readers when status messages are shown
          >
            {microcopy}
          </BodyText>
        )}
      </div>
    </div>
  );
}
