import React from "react"
import { cn } from "@/lib/utils"
import { HeadingText, SubheadingText, BodyText } from "@/components/ui/typography"
import { Container, GridItem } from "@/components/ui/container"
import { Button } from "@/components/ui/button"

export interface ShadcnIntegrationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for styling
   */
  className?: string
}

/**
 * ShadcnIntegration component documents the integration with shadcn/ui
 */
export function ShadcnIntegration({ className, ...props }: ShadcnIntegrationProps) {
  // Color mapping table
  const colorMapping = [
    {
      scryColor: "--color-ink",
      scryValue: "#121212",
      shadcnVariable: "--background, --card, --popover",
      usage: "Dark background colors"
    },
    {
      scryColor: "--color-chalk",
      scryValue: "#FAFAFA",
      shadcnVariable: "--foreground, --card-foreground, --popover-foreground",
      usage: "Text on dark backgrounds"
    },
    {
      scryColor: "--color-cobalt",
      scryValue: "#0047AB",
      shadcnVariable: "--primary",
      usage: "Primary buttons and interactive elements"
    },
    {
      scryColor: "--color-cobalt-light",
      scryValue: "#0051C4",
      shadcnVariable: "(hover state)",
      usage: "Hover state for primary buttons"
    },
    {
      scryColor: "--color-purple",
      scryValue: "#B494E9",
      shadcnVariable: "--accent",
      usage: "Accent elements and highlights"
    },
    {
      scryColor: "--focus-outline-color",
      scryValue: "#0060E6",
      shadcnVariable: "--ring",
      usage: "Focus rings and outlines"
    }
  ]
  
  // Components used from shadcn/ui
  const shadcnComponents = [
    {
      name: "Button",
      customization: "Added 'cta' variant, customized colors and sizes",
      usage: "CTAs, form submissions, interactive elements"
    },
    {
      name: "Typography",
      customization: "Customized with Scry's typography scale and IBM Plex Sans",
      usage: "All text elements in the application"
    },
    {
      name: "Container",
      customization: "Added 12-column grid support and responsive utilities",
      usage: "Page layout and component positioning"
    }
  ]
  
  return (
    <div className={cn("w-full p-8", className)} {...props}>
      <div className="mb-8">
        <HeadingText>shadcn/ui Integration</HeadingText>
        <BodyText className="mt-2 text-muted-foreground">
          Scry's design system builds on shadcn/ui, a collection of reusable components built with Radix UI and Tailwind CSS.
          This document explains how Scry's design tokens map to shadcn/ui's theming system and how components have been customized.
        </BodyText>
      </div>
      
      {/* Color Mapping */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Color Mapping</SubheadingText>
        <BodyText className="mb-6">
          Scry's brand colors are mapped to shadcn/ui's semantic color variables to ensure consistent theming:
        </BodyText>
        
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Scry Token</th>
              <th className="border border-border p-2 text-left">Value</th>
              <th className="border border-border p-2 text-left">shadcn/ui Variable</th>
              <th className="border border-border p-2 text-left">Usage</th>
            </tr>
          </thead>
          <tbody>
            {colorMapping.map((mapping, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="border border-border p-2 font-medium font-mono text-sm">{mapping.scryColor}</td>
                <td className="border border-border p-2">{mapping.scryValue}</td>
                <td className="border border-border p-2 font-mono text-sm">{mapping.shadcnVariable}</td>
                <td className="border border-border p-2">{mapping.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <BodyText className="mb-2">
          This mapping is defined in the <code className="font-mono text-sm">app/theme.css</code> file:
        </BodyText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`:root {
  /* Scry Brand Colors */
  --color-ink: #121212;
  --color-chalk: #FAFAFA;
  --color-cobalt: #0047AB;
  
  /* shadcn/ui Semantic Colors - Dark Mode (Default) */
  --background: var(--color-ink);
  --foreground: var(--color-chalk);
  --primary: var(--color-cobalt);
  /* ... other mappings ... */
}`}
        </div>
      </div>
      
      {/* Component Customization */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Component Customization</SubheadingText>
        <BodyText className="mb-6">
          Scry has customized the following shadcn/ui components:
        </BodyText>
        
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Component</th>
              <th className="border border-border p-2 text-left">Customization</th>
              <th className="border border-border p-2 text-left">Usage</th>
            </tr>
          </thead>
          <tbody>
            {shadcnComponents.map((component, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="border border-border p-2 font-medium">{component.name}</td>
                <td className="border border-border p-2">{component.customization}</td>
                <td className="border border-border p-2">{component.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <SubheadingText as="h3" className="mb-4">Button Component Example</SubheadingText>
        <Container gap="md" className="mb-8">
          <GridItem span={12} md={6}>
            <BodyText weight="medium" className="mb-2">Default Variant</BodyText>
            <div className="p-4 border border-border rounded-md">
              <Button className="mb-2 w-full">Default Button</Button>
              <BodyText className="text-sm text-muted-foreground">
                The default button variant using primary colors.
              </BodyText>
            </div>
          </GridItem>
          
          <GridItem span={12} md={6}>
            <BodyText weight="medium" className="mb-2">CTA Variant</BodyText>
            <div className="p-4 border border-border rounded-md">
              <Button variant="cta" className="mb-2 w-full">CTA Button</Button>
              <BodyText className="text-sm text-muted-foreground">
                Custom CTA variant designed for primary actions.
              </BodyText>
            </div>
          </GridItem>
          
          <GridItem span={12} md={6}>
            <BodyText weight="medium" className="mb-2">Secondary Variant</BodyText>
            <div className="p-4 border border-border rounded-md">
              <Button variant="secondary" className="mb-2 w-full">Secondary Button</Button>
              <BodyText className="text-sm text-muted-foreground">
                Secondary button for less prominent actions.
              </BodyText>
            </div>
          </GridItem>
          
          <GridItem span={12} md={6}>
            <BodyText weight="medium" className="mb-2">Outline Variant</BodyText>
            <div className="p-4 border border-border rounded-md">
              <Button variant="outline" className="mb-2 w-full">Outline Button</Button>
              <BodyText className="text-sm text-muted-foreground">
                Outline button for tertiary actions.
              </BodyText>
            </div>
          </GridItem>
        </Container>
      </div>
      
      {/* Implementation Details */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Implementation Details</SubheadingText>
        
        <SubheadingText as="h3" className="mb-3">Button Implementation</SubheadingText>
        <BodyText className="mb-4">
          The Button component is customized using the class-variance-authority (cva) package:
        </BodyText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-8">
{`// button.tsx
import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        cta: "bg-cobalt text-chalk hover:bg-cobalt-light", // Custom CTA variant
        // ...other variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        // ...other sizes
        xl: "h-14 px-8 py-4 text-subheading", // Custom XL size
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)`}
        </div>
        
        <SubheadingText as="h3" className="mb-3">Theme CSS Variables</SubheadingText>
        <BodyText className="mb-4">
          The design tokens are implemented as CSS variables in <code className="font-mono text-sm">app/theme.css</code>:
        </BodyText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`:root {
  /* Scry Brand Colors */
  --color-ink: #121212;
  --color-chalk: #FAFAFA;
  --color-cobalt: #0047AB;
  
  /* Typography */
  --font-display-size: 5.33rem;
  --font-heading-size: 2.67rem;
  /* ...other typography tokens... */
  
  /* Spacing */
  --spacing-vertical-lg: 10rem;
  
  /* Animations */
  --animation-fade-duration: 200ms;
  --animation-fade-timing: ease-out;
  
  /* shadcn/ui Semantic Colors - Dark Mode (Default) */
  --background: var(--color-ink);
  --foreground: var(--color-chalk);
  /* ...other shadcn/ui mappings... */
}`}
        </div>
      </div>
      
      {/* Usage Guidelines */}
      <div>
        <SubheadingText as="h2" className="mb-4">Usage Guidelines</SubheadingText>
        <Container gap="md">
          <GridItem span={12} md={6}>
            <div className="p-4 rounded-md border border-border">
              <SubheadingText as="h3" className="mb-2">Do</SubheadingText>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use shadcn/ui components with Scry's customizations</li>
                <li>Follow shadcn/ui's documentation for component APIs</li>
                <li>Use semantic color variables (--primary, --background) instead of direct brand colors</li>
                <li>Check Storybook for examples of component usage</li>
              </ul>
            </div>
          </GridItem>
          
          <GridItem span={12} md={6}>
            <div className="p-4 rounded-md border border-border">
              <SubheadingText as="h3" className="mb-2">Don't</SubheadingText>
              <ul className="list-disc pl-5 space-y-2">
                <li>Import components directly from shadcn/ui repositories</li>
                <li>Override component styling with inline styles</li>
                <li>Create new variants without documenting them</li>
                <li>Hard-code color values that are already available as variables</li>
              </ul>
            </div>
          </GridItem>
        </Container>
      </div>
    </div>
  )
}