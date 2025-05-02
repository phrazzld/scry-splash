import React from "react"
import { cn } from "@/lib/utils"
import { HeadingText, SubheadingText, BodyText } from "@/components/ui/typography"
import { Container, GridItem } from "@/components/ui/container"

export interface TypographyTokensProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for styling
   */
  className?: string
}

/**
 * TypographyTokens component documents the typography system
 */
export function TypographyTokens({ className, ...props }: TypographyTokensProps) {
  // Font size tokens
  const fontSizes = [
    { 
      name: "Display", 
      variables: {
        size: "--font-display-size",
        lineHeight: "--font-display-line-height",
      },
      values: {
        size: "5.33rem (85.3px)",
        lineHeight: "1.1",
      },
      class: "text-display",
      description: "Used for large headlines and hero text",
      tailwind: "text-display"
    },
    { 
      name: "Heading", 
      variables: {
        size: "--font-heading-size",
        lineHeight: "--font-heading-line-height",
      },
      values: {
        size: "2.67rem (42.7px)",
        lineHeight: "1.2",
      },
      class: "text-heading",
      description: "Used for section headings",
      tailwind: "text-heading"
    },
    { 
      name: "Subheading", 
      variables: {
        size: "--font-subheading-size",
        lineHeight: "--font-subheading-line-height",
      },
      values: {
        size: "1.5rem (24px)",
        lineHeight: "1.3",
      },
      class: "text-subheading",
      description: "Used for subsections and emphasized text",
      tailwind: "text-subheading"
    },
    { 
      name: "Body", 
      variables: {
        size: "--font-body-size",
        lineHeight: "--font-body-line-height",
      },
      values: {
        size: "1.17rem (18.7px)",
        lineHeight: "1.5",
      },
      class: "text-body",
      description: "Used for body text and general content",
      tailwind: "text-body"
    }
  ]
  
  // Font weight tokens
  const fontWeights = [
    { 
      name: "Regular", 
      variable: "--font-regular",
      value: "400",
      class: "font-regular",
      description: "Used for most body text",
      tailwind: "font-regular"
    },
    { 
      name: "Medium", 
      variable: "--font-medium",
      value: "500",
      class: "font-medium",
      description: "Used for subheadings and emphasis",
      tailwind: "font-medium"
    },
    { 
      name: "Bold", 
      variable: "--font-bold",
      value: "700",
      class: "font-bold",
      description: "Used for headings and strong emphasis",
      tailwind: "font-bold"
    }
  ]
  
  // Typography component examples
  const typographyComponents = [
    {
      name: "HeadingText",
      description: "Used for headings with configurable styles",
      example: "<HeadingText>Heading Example</HeadingText>",
      props: ["as", "weight", "className"]
    },
    {
      name: "SubheadingText",
      description: "Used for subheadings with configurable styles",
      example: "<SubheadingText>Subheading Example</SubheadingText>",
      props: ["as", "weight", "className"]
    },
    {
      name: "BodyText",
      description: "Used for body text with configurable styles",
      example: "<BodyText>Body text example</BodyText>",
      props: ["as", "weight", "className"]
    }
  ]
  
  return (
    <div className={cn("w-full p-8", className)} {...props}>
      <div className="mb-8">
        <HeadingText>Typography Tokens</HeadingText>
        <BodyText className="mt-2 text-muted-foreground">
          Scry uses IBM Plex Sans as its primary typeface with a clear typographic hierarchy based on a modular scale.
          The typography system is designed for readability and accessibility across all screen sizes.
        </BodyText>
      </div>
      
      {/* Font Family */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Font Family</SubheadingText>
        <div className="p-6 rounded-lg border border-border">
          <SubheadingText as="h3" className="mb-2">IBM Plex Sans</SubheadingText>
          <BodyText className="mb-4">
            A modern sans-serif typeface with excellent readability and flexibility for both display and text usage.
          </BodyText>
          <div className="flex flex-col gap-3">
            <div>
              <BodyText weight="medium" className="mb-1">Regular 400</BodyText>
              <div className="text-display font-regular">AaBbCcDd</div>
            </div>
            <div>
              <BodyText weight="medium" className="mb-1">Medium 500</BodyText>
              <div className="text-display font-medium">AaBbCcDd</div>
            </div>
            <div>
              <BodyText weight="medium" className="mb-1">Bold 700</BodyText>
              <div className="text-display font-bold">AaBbCcDd</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Font Sizes */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Font Sizes & Line Heights</SubheadingText>
        <Container gap="md">
          {fontSizes.map((fontSize, index) => (
            <GridItem key={index} span={12} className="mb-6">
              <div className="rounded-md overflow-hidden border border-border">
                <div className={cn("p-6 bg-card", fontSize.class)}>
                  {fontSize.name} - The quick brown fox jumps over the lazy dog
                </div>
                <div className="p-4">
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex justify-between">
                      <BodyText weight="medium">Size:</BodyText>
                      <div className="flex items-center gap-2">
                        <code className="text-body-size font-mono">{fontSize.variables.size}</code>
                        <span>{fontSize.values.size}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <BodyText weight="medium">Line Height:</BodyText>
                      <div className="flex items-center gap-2">
                        <code className="text-body-size font-mono">{fontSize.variables.lineHeight}</code>
                        <span>{fontSize.values.lineHeight}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <BodyText weight="medium">CSS Class:</BodyText>
                      <code className="text-body-size font-mono">.{fontSize.class}</code>
                    </div>
                    <div className="flex justify-between">
                      <BodyText weight="medium">Tailwind Class:</BodyText>
                      <code className="text-body-size font-mono">{fontSize.tailwind}</code>
                    </div>
                  </div>
                  <BodyText className="text-muted-foreground">{fontSize.description}</BodyText>
                </div>
              </div>
            </GridItem>
          ))}
        </Container>
      </div>
      
      {/* Font Weights */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Font Weights</SubheadingText>
        <Container gap="md">
          {fontWeights.map((weight, index) => (
            <GridItem key={index} span={12} md={4} className="mb-6">
              <div className="rounded-md overflow-hidden border border-border h-full">
                <div className={cn("p-6 bg-card text-heading", weight.class)}>
                  {weight.name}
                </div>
                <div className="p-4">
                  <div className="flex flex-col gap-1 mb-3">
                    <div className="flex justify-between">
                      <BodyText weight="medium">Variable:</BodyText>
                      <code className="text-body-size font-mono">{weight.variable}</code>
                    </div>
                    <div className="flex justify-between">
                      <BodyText weight="medium">Value:</BodyText>
                      <span>{weight.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <BodyText weight="medium">CSS Class:</BodyText>
                      <code className="text-body-size font-mono">.{weight.class}</code>
                    </div>
                    <div className="flex justify-between">
                      <BodyText weight="medium">Tailwind Class:</BodyText>
                      <code className="text-body-size font-mono">{weight.tailwind}</code>
                    </div>
                  </div>
                  <BodyText className="text-muted-foreground">{weight.description}</BodyText>
                </div>
              </div>
            </GridItem>
          ))}
        </Container>
      </div>
      
      {/* Typography Components */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Typography Components</SubheadingText>
        <BodyText className="mb-6">
          Scry provides type-safe React components for consistent typography usage throughout the application.
        </BodyText>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Component</th>
              <th className="border border-border p-2 text-left">Description</th>
              <th className="border border-border p-2 text-left">Example</th>
              <th className="border border-border p-2 text-left">Props</th>
            </tr>
          </thead>
          <tbody>
            {typographyComponents.map((component, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="border border-border p-2 font-medium">{component.name}</td>
                <td className="border border-border p-2">{component.description}</td>
                <td className="border border-border p-2 font-mono text-sm">{component.example}</td>
                <td className="border border-border p-2 font-mono text-sm">{component.props.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Usage Examples */}
      <div>
        <SubheadingText as="h2" className="mb-4">Usage Examples</SubheadingText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-6">
{`/* Using Typography Components */
import { HeadingText, SubheadingText, BodyText } from "@/components/ui/typography";

function MyComponent() {
  return (
    <div>
      <HeadingText>Main Heading</HeadingText>
      <SubheadingText>Subheading</SubheadingText>
      <BodyText>This is body text content...</BodyText>
    </div>
  );
}`}
        </div>
        
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`/* Using CSS Classes */
function MyComponent() {
  return (
    <div>
      <h1 className="text-display font-bold">Main Heading</h1>
      <h2 className="text-subheading font-medium">Subheading</h2>
      <p className="text-body font-regular">This is body text content...</p>
    </div>
  );
}`}
        </div>
      </div>
    </div>
  )
}