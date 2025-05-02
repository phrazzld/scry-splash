"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Container, GridItem } from "@/components/ui/container"
import { BodyText } from "@/components/ui/typography"

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The project attribution text
   * @default "a misty step project"
   */
  projectText?: string
  
  /**
   * Text color
   * @default "text-chalk/40"
   */
  textColor?: string
  
  /**
   * Whether to center the content
   * @default false
   */
  centered?: boolean
  
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
  textColor = "text-chalk/40",
  centered = false,
  className,
  ...props
}: FooterProps) {
  return (
    <Container 
      as="footer"
      className={cn("py-6 border-t border-white/5", className)} 
      gap="none"
      padding="md"
      {...props}
    >
      <GridItem 
        span={12} 
        md={10} 
        lg={8} 
        className={cn(
          "flex flex-col px-6",
          centered && "items-center text-center"
        )}
      >
        <BodyText 
          className={cn("text-xs", textColor)}
          as="p"
        >
          {projectText}
        </BodyText>
      </GridItem>
    </Container>
  )
}