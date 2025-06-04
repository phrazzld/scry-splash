"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BodyText, SubheadingText } from "@/components/ui/typography";
import { Container, GridItem } from "@/components/ui/container";

export interface PitchSectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Whether to center the content
   * @default false
   */
  centered?: boolean;

  /**
   * Text color for pitch content
   * @default "text-foreground"
   */
  textColor?: string;

  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * PitchSection component that highlights Scry's key features and value propositions
 *
 * @example
 * ```tsx
 * <PitchSection />
 * <PitchSection centered={true} />
 * <PitchSection textColor="text-slate-300" />
 * ```
 */
export function PitchSection({
  centered = false,
  textColor = "text-foreground",
  className,
  ...props
}: PitchSectionProps) {
  return (
    <Container
      className={cn("py-6 md:py-8", className)}
      gap="md"
      padding="none"
      {...props}
    >
      <GridItem
        span={12}
        md={10}
        lg={8}
        className={cn(
          "flex flex-col gap-6",
          centered && "items-center text-center",
        )}
      >
        <div className="space-y-1.5">
          <SubheadingText className={cn("font-medium", textColor)}>
            AI-powered spaced repetition that works
          </SubheadingText>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <BodyText className={cn("font-medium", textColor)}>
                  Capture anything
                </BodyText>
                <BodyText className={cn("opacity-80", textColor)}>
                  Import notes, PDFs, and conversations without formatting
                  overhead
                </BodyText>
              </div>

              <div className="flex flex-col gap-2">
                <BodyText className={cn("font-medium", textColor)}>
                  Review effortlessly
                </BodyText>
                <BodyText className={cn("opacity-80", textColor)}>
                  AI intelligently creates and schedules review prompts for you
                </BodyText>
              </div>

              <div className="flex flex-col gap-2">
                <BodyText className={cn("font-medium", textColor)}>
                  Achieve mastery
                </BodyText>
                <BodyText className={cn("opacity-80", textColor)}>
                  Our system adapts to your learning, optimizing for long-term
                  retention
                </BodyText>
              </div>
            </div>

            <BodyText className={cn("opacity-80 italic", textColor)}>
              No more manual flashcards. No more subjective feedback. Just
              knowledge that sticks.
            </BodyText>
          </div>
        </div>
      </GridItem>
    </Container>
  );
}
