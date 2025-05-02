import React from "react"
import { cn } from "@/lib/utils"
import { HeadingText, SubheadingText, BodyText } from "@/components/ui/typography"
import { Container, GridItem } from "@/components/ui/container"

export interface TokensOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for styling
   */
  className?: string
}

// Define types for the different example formats
type ColorExample = {
  name: string;
  color: string;
  textColor: string;
}

type StyleExample = {
  name: string;
  style: string;
}

type VisualExample = {
  name: string;
  visual: string;
}

// Union type for all example types
type TokenExample = ColorExample | StyleExample | VisualExample;

// Define the type for a token category
interface TokenCategory {
  name: string;
  description: string;
  path: string;
  examples: TokenExample[];
}

/**
 * TokensOverview component provides an overview of all design tokens
 */
export function TokensOverview({ className, ...props }: TokensOverviewProps) {
  const tokenCategories: TokenCategory[] = [
    {
      name: "Colors",
      description: "Brand colors and semantic color tokens",
      path: "?path=/story/design-system-colortokens--default",
      examples: [
        { name: "Ink", color: "var(--color-ink)", textColor: "var(--color-chalk)" },
        { name: "Chalk", color: "var(--color-chalk)", textColor: "var(--color-ink)" },
        { name: "Cobalt", color: "var(--color-cobalt)", textColor: "var(--color-chalk)" },
      ]
    },
    {
      name: "Typography",
      description: "Font sizes, weights, and line heights",
      path: "?path=/story/design-system-typographytokens--default",
      examples: [
        { name: "Display", style: "text-display font-bold" },
        { name: "Heading", style: "text-heading font-regular" },
        { name: "Subheading", style: "text-subheading font-medium" },
        { name: "Body", style: "text-body font-regular" },
      ]
    },
    {
      name: "Spacing",
      description: "Spacing scale and layout measurements",
      path: "?path=/story/design-system-spacingtokens--default",
      examples: [
        { name: "8px grid", visual: "grid-demo" },
      ]
    },
    {
      name: "Animation",
      description: "Duration, timing functions, and transitions",
      path: "?path=/story/design-system-animationtokens--default",
      examples: [
        { name: "Fade In", visual: "fade-demo" },
      ]
    },
    {
      name: "Layout",
      description: "Grid system and container sizing",
      path: "?path=/story/design-system-layouttokens--default",
      examples: [
        { name: "12-Column Grid", visual: "grid-demo" },
      ]
    },
    {
      name: "shadcn/ui",
      description: "Integration with shadcn/ui component library",
      path: "?path=/story/design-system-shadcnintegration--default",
      examples: []
    },
  ]
  
  return (
    <div className={cn("w-full p-8", className)} {...props}>
      <div className="mb-8">
        <HeadingText>Scry Design System</HeadingText>
        <BodyText className="mt-2 text-muted-foreground">
          A comprehensive guide to design tokens, components, and patterns used in the Scry application.
        </BodyText>
      </div>
      
      <Container gap="lg">
        {tokenCategories.map((category, index) => (
          <GridItem key={index} span={12} md={6} lg={4} className="mb-8">
            <div className="p-6 rounded-lg border border-border">
              <SubheadingText as="h2" className="mb-2">{category.name}</SubheadingText>
              <BodyText className="mb-4 text-muted-foreground">{category.description}</BodyText>
              
              {/* Color examples */}
              {category.name === "Colors" && (
                <div className="flex gap-2 mb-4">
                  {category.examples.map((example, i) => {
                    // Type guard to ensure we're working with ColorExample type
                    if ('color' in example && 'textColor' in example) {
                      return (
                        <div 
                          key={i} 
                          className="h-12 w-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: example.color, color: example.textColor }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              
              {/* Typography examples */}
              {category.name === "Typography" && (
                <div className="flex flex-col gap-1 mb-4">
                  {category.examples.map((example, i) => {
                    // Type guard to ensure we're working with StyleExample type
                    if ('style' in example) {
                      return <div key={i} className={example.style}>{example.name}</div>;
                    }
                    return null;
                  })}
                </div>
              )}
              
              {/* Other visual examples */}
              {category.examples.some(ex => 'visual' in ex && ex.visual === "grid-demo") && (
                <div className="grid grid-cols-4 gap-1 h-8 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-muted rounded-sm h-full"></div>
                  ))}
                </div>
              )}
              
              {category.examples.some(ex => 'visual' in ex && ex.visual === "fade-demo") && (
                <div className="h-10 w-full bg-muted rounded animate-fade-in mb-4"></div>
              )}
              
              <a 
                href={category.path} 
                className="text-subheading-size font-medium text-primary hover:underline"
              >
                View {category.name} →
              </a>
            </div>
          </GridItem>
        ))}
      </Container>
    </div>
  )
}