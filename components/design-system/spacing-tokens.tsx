import React from "react"
import { cn } from "@/lib/utils"
import { HeadingText, SubheadingText, BodyText } from "@/components/ui/typography"

export interface SpacingTokensProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for styling
   */
  className?: string
}

/**
 * SpacingTokens component documents the spacing system
 */
export function SpacingTokens({ className, ...props }: SpacingTokensProps) {
  // Base spacing units
  const baseSpacingUnits = [
    { 
      name: "0.25rem (4px)", 
      value: "0.25rem",
      tailwind: "1", 
      description: "Extra small spacing for tight layouts"
    },
    { 
      name: "0.5rem (8px)", 
      value: "0.5rem",
      tailwind: "2", 
      description: "Minimal spacing, 1 unit in 8px grid"
    },
    { 
      name: "1rem (16px)", 
      value: "1rem",
      tailwind: "4", 
      description: "Standard spacing, 2 units in 8px grid"
    },
    { 
      name: "1.5rem (24px)", 
      value: "1.5rem",
      tailwind: "6", 
      description: "Medium spacing, 3 units in 8px grid"
    },
    { 
      name: "2rem (32px)", 
      value: "2rem",
      tailwind: "8", 
      description: "Large spacing, 4 units in 8px grid"
    },
    { 
      name: "3rem (48px)", 
      value: "3rem",
      tailwind: "12", 
      description: "Extra large spacing, 6 units in 8px grid"
    }
  ]
  
  // Special spacing values
  const specialSpacing = [
    { 
      name: "Vertical Large", 
      variable: "--spacing-vertical-lg",
      value: "10rem (160px)",
      tailwind: "vertical-lg", 
      description: "Used for major vertical sections"
    }
  ]
  
  // Container gap options
  const containerGaps = [
    { 
      name: "None", 
      value: "0",
      prop: 'gap="none"', 
      description: "No gap between grid items"
    },
    { 
      name: "Small", 
      value: "0.5rem (8px)",
      prop: 'gap="sm"', 
      description: "Small gap between grid items"
    },
    { 
      name: "Medium", 
      value: "1rem (16px)",
      prop: 'gap="md"', 
      description: "Medium gap between grid items"
    },
    { 
      name: "Large", 
      value: "2rem (32px)",
      prop: 'gap="lg"', 
      description: "Large gap between grid items"
    },
    { 
      name: "Extra Large", 
      value: "3rem (48px)",
      prop: 'gap="xl"', 
      description: "Extra large gap between grid items"
    }
  ]
  
  return (
    <div className={cn("w-full p-8", className)} {...props}>
      <div className="mb-8">
        <HeadingText>Spacing Tokens</HeadingText>
        <BodyText className="mt-2 text-muted-foreground">
          Scry uses an 8px grid system as the foundation for all spacing, creating a consistent rhythm throughout the interface.
          The spacing tokens control margins, padding, gaps, and layout measurements.
        </BodyText>
      </div>
      
      {/* Base Spacing Units */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Base Spacing Units</SubheadingText>
        <div className="space-y-8">
          {baseSpacingUnits.map((unit, index) => (
            <div key={index} className="flex items-center gap-4">
              <div 
                className="bg-primary h-8" 
                style={{ width: unit.value }}
              />
              <div className="flex-1">
                <BodyText weight="medium">{unit.name}</BodyText>
                <BodyText className="text-muted-foreground">{unit.description}</BodyText>
              </div>
              <code className="text-body-size font-mono bg-muted px-2 py-1 rounded">p-{unit.tailwind}, m-{unit.tailwind}</code>
            </div>
          ))}
        </div>
      </div>
      
      {/* Special Spacing */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Special Spacing Values</SubheadingText>
        <div className="space-y-8">
          {specialSpacing.map((unit, index) => (
            <div key={index}>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <BodyText weight="medium">{unit.name}</BodyText>
                  <div className="flex items-center gap-2">
                    <BodyText className="text-muted-foreground">CSS Variable:</BodyText>
                    <code className="text-body-size font-mono">{unit.variable}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <BodyText className="text-muted-foreground">Value:</BodyText>
                    <BodyText>{unit.value}</BodyText>
                  </div>
                </div>
                <code className="text-body-size font-mono bg-muted px-2 py-1 rounded">my-{unit.tailwind}</code>
              </div>
              <div className="relative h-24 border border-dashed border-border">
                <div className="absolute inset-x-0 bottom-0 h-px bg-primary"></div>
                <div className="absolute inset-x-0 top-0 h-px bg-primary"></div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-muted">
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {unit.value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Container Gaps */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">Container Gap Options</SubheadingText>
        <BodyText className="mb-6">
          The Container component supports different gap sizes between grid items:
        </BodyText>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Name</th>
              <th className="border border-border p-2 text-left">Value</th>
              <th className="border border-border p-2 text-left">Component Prop</th>
              <th className="border border-border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {containerGaps.map((gap, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                <td className="border border-border p-2 font-medium">{gap.name}</td>
                <td className="border border-border p-2">{gap.value}</td>
                <td className="border border-border p-2 font-mono text-sm">{gap.prop}</td>
                <td className="border border-border p-2">{gap.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-8">
          <SubheadingText as="h3" className="mb-4">Visual Example</SubheadingText>
          <div className="grid grid-cols-2 gap-8">
            {/* Small Gap Example */}
            <div>
              <BodyText weight="medium" className="mb-2">Small Gap (8px)</BodyText>
              <div className="grid grid-cols-2 gap-2 p-4 border border-border rounded-md">
                <div className="bg-muted h-16 rounded-md"></div>
                <div className="bg-muted h-16 rounded-md"></div>
                <div className="bg-muted h-16 rounded-md"></div>
                <div className="bg-muted h-16 rounded-md"></div>
              </div>
            </div>
            
            {/* Large Gap Example */}
            <div>
              <BodyText weight="medium" className="mb-2">Large Gap (32px)</BodyText>
              <div className="grid grid-cols-2 gap-8 p-4 border border-border rounded-md">
                <div className="bg-muted h-16 rounded-md"></div>
                <div className="bg-muted h-16 rounded-md"></div>
                <div className="bg-muted h-16 rounded-md"></div>
                <div className="bg-muted h-16 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Usage Examples */}
      <div>
        <SubheadingText as="h2" className="mb-4">Usage Examples</SubheadingText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-6">
{`/* Tailwind Classes */
<div className="p-4 m-8">
  <h2 className="mb-4">Heading with bottom margin</h2>
  <p className="mb-2">Paragraph with bottom margin</p>
</div>`}
        </div>
        
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-6">
{`/* Container with Gap */
<Container gap="md">
  <GridItem span={12} md={6}>Column 1</GridItem>
  <GridItem span={12} md={6}>Column 2</GridItem>
</Container>`}
        </div>
        
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`/* Using Special Spacing */
<main className="my-vertical-lg">
  Content with vertical margin
</main>`}
        </div>
      </div>
    </div>
  )
}