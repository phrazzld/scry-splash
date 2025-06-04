import React from "react";
import { cn } from "@/lib/utils";
import {
  HeadingText,
  SubheadingText,
  BodyText,
} from "@/components/ui/typography";
import { Container, GridItem } from "@/components/ui/container";

export interface LayoutTokensProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * LayoutTokens component documents the layout system
 */
export function LayoutTokens({ className, ...props }: LayoutTokensProps) {
  // Breakpoints
  const breakpoints = [
    {
      name: "Default",
      value: "< 640px",
      description: "Mobile devices, portrait orientation",
    },
    {
      name: "sm",
      value: "≥ 640px",
      description: "Small devices, large phone or small tablet",
    },
    {
      name: "md",
      value: "≥ 768px",
      description: "Medium devices, tablets",
    },
    {
      name: "lg",
      value: "≥ 1024px",
      description: "Large devices, desktops",
    },
    {
      name: "xl",
      value: "≥ 1280px",
      description: "Extra large devices, large desktops",
    },
    {
      name: "2xl",
      value: "≥ 1536px",
      description: "Very large devices and monitors",
    },
  ];

  // Container max widths
  const containerMaxWidths = [
    {
      name: "sm",
      value: "640px",
      description: "Small container for compact content",
    },
    {
      name: "md",
      value: "768px",
      description: "Medium container for standard content",
    },
    {
      name: "lg",
      value: "1024px",
      description: "Large container for expanded content",
    },
    {
      name: "xl",
      value: "1280px",
      description: "Extra large container, default for most pages",
    },
    {
      name: "2xl",
      value: "1400px",
      description: "Maximum container width for very large screens",
    },
    {
      name: "full",
      value: "100%",
      description: "Full width container with no maximum",
    },
    {
      name: "none",
      value: "none",
      description: "No maximum width applied",
    },
  ];

  // Container padding options
  const containerPadding = [
    {
      name: "none",
      value: "0",
      description: "No padding",
    },
    {
      name: "sm",
      value: "1rem (16px)",
      description: "Small padding",
    },
    {
      name: "md",
      value: "1.5rem (24px)",
      description: "Medium padding, default",
    },
    {
      name: "lg",
      value: "2rem (32px)",
      description: "Large padding",
    },
    {
      name: "xl",
      value: "3rem (48px)",
      description: "Extra large padding",
    },
    {
      name: "responsive",
      value: "Varies by breakpoint",
      description: "Adjusts automatically based on screen size",
    },
  ];

  return (
    <div className={cn("w-full p-8", className)} {...props}>
      <div className="mb-8">
        <HeadingText>Layout Tokens</HeadingText>
        <BodyText className="mt-2 text-muted-foreground">
          Scry uses a responsive 12-column grid system as the foundation for all
          layouts. The layout tokens control breakpoints, container sizes, and
          grid configurations.
        </BodyText>
      </div>

      {/* Grid System Overview */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          12-Column Grid System
        </SubheadingText>
        <BodyText className="mb-6">
          The 12-column grid system provides a flexible layout framework that
          adapts to different screen sizes. It&apos;s implemented through the
          Container and GridItem components.
        </BodyText>

        {/* Grid Visualization */}
        <div className="mb-8 border border-border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted">
            <BodyText weight="medium">Grid Visualization</BodyText>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-12 gap-2 mb-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted h-16 flex items-center justify-center"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <BodyText className="text-sm text-muted-foreground">
              The grid divides the available width into 12 equal columns with
              configurable gaps.
            </BodyText>
          </div>
        </div>

        {/* Responsive Examples */}
        <SubheadingText as="h3" className="mb-4">
          Responsive Layout Examples
        </SubheadingText>
        <Container gap="md" className="mb-8">
          <GridItem span={12}>
            <BodyText weight="medium" className="mb-2">
              Default (Mobile): Full Width
            </BodyText>
            <div className="p-4 border border-dashed border-border">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 bg-muted h-16 flex items-center justify-center">
                  span=12
                </div>
              </div>
            </div>
          </GridItem>

          <GridItem span={12}>
            <BodyText weight="medium" className="mb-2">
              Medium Breakpoint: Two Columns
            </BodyText>
            <div className="p-4 border border-dashed border-border">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 md:col-span-6 bg-muted h-16 flex items-center justify-center">
                  span=12 md=6
                </div>
                <div className="col-span-12 md:col-span-6 bg-muted h-16 flex items-center justify-center">
                  span=12 md=6
                </div>
              </div>
            </div>
          </GridItem>

          <GridItem span={12}>
            <BodyText weight="medium" className="mb-2">
              Large Breakpoint: Three Columns
            </BodyText>
            <div className="p-4 border border-dashed border-border">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-muted h-16 flex items-center justify-center">
                  span=12 md=6 lg=4
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-muted h-16 flex items-center justify-center">
                  span=12 md=6 lg=4
                </div>
                <div className="col-span-12 lg:col-span-4 bg-muted h-16 flex items-center justify-center">
                  span=12 lg=4
                </div>
              </div>
            </div>
          </GridItem>

          <GridItem span={12}>
            <BodyText weight="medium" className="mb-2">
              Column Positioning
            </BodyText>
            <div className="p-4 border border-dashed border-border">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-10 col-start-2 bg-muted h-16 flex items-center justify-center">
                  span=10 start=2
                </div>
              </div>
            </div>
          </GridItem>
        </Container>
      </div>

      {/* Breakpoints */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          Breakpoints
        </SubheadingText>
        <BodyText className="mb-6">
          Breakpoints define the responsive behavior of the layout at different
          screen sizes:
        </BodyText>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Name</th>
              <th className="border border-border p-2 text-left">Width</th>
              <th className="border border-border p-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {breakpoints.map((breakpoint, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
              >
                <td className="border border-border p-2 font-medium">
                  {breakpoint.name}
                </td>
                <td className="border border-border p-2">{breakpoint.value}</td>
                <td className="border border-border p-2">
                  {breakpoint.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <BodyText className="mb-4">
          These breakpoints are used in the GridItem component to define
          responsive column spans:
        </BodyText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-6">
          {`<GridItem 
  span={12}   // Default: full width on mobile 
  sm={6}      // Small screens: half width
  md={4}      // Medium screens: one-third width
  lg={3}      // Large screens: one-quarter width
>
  Content here
</GridItem>`}
        </div>
      </div>

      {/* Container Configuration */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          Container Configuration
        </SubheadingText>
        <BodyText className="mb-6">
          The Container component can be configured with various properties:
        </BodyText>

        <SubheadingText as="h3" className="mb-3">
          Maximum Width
        </SubheadingText>
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Name</th>
              <th className="border border-border p-2 text-left">Value</th>
              <th className="border border-border p-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {containerMaxWidths.map((width, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
              >
                <td className="border border-border p-2 font-medium">
                  {width.name}
                </td>
                <td className="border border-border p-2">{width.value}</td>
                <td className="border border-border p-2">
                  {width.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <SubheadingText as="h3" className="mb-3">
          Padding
        </SubheadingText>
        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Name</th>
              <th className="border border-border p-2 text-left">Value</th>
              <th className="border border-border p-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {containerPadding.map((padding, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
              >
                <td className="border border-border p-2 font-medium">
                  {padding.name}
                </td>
                <td className="border border-border p-2">{padding.value}</td>
                <td className="border border-border p-2">
                  {padding.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <BodyText className="mb-4">
          Example of a Container with configuration:
        </BodyText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-6">
          {`<Container 
  maxWidth="lg"    // Maximum width of 1024px
  padding="md"     // 24px padding
  center={true}    // Center horizontally
  gap="md"         // 16px gap between grid items
>
  <GridItem span={12} md={6}>Column 1</GridItem>
  <GridItem span={12} md={6}>Column 2</GridItem>
</Container>`}
        </div>
      </div>

      {/* Common Layout Patterns */}
      <div>
        <SubheadingText as="h2" className="mb-4">
          Common Layout Patterns
        </SubheadingText>

        <SubheadingText as="h3" className="mb-3">
          DefaultLayout
        </SubheadingText>
        <BodyText className="mb-4">
          The DefaultLayout component provides a standard centered layout with
          common settings:
        </BodyText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-8">
          {`<DefaultLayout>
  {/* Content is centered in the middle 8 columns on large screens */}
  <YourContent />
</DefaultLayout>

// Equivalent to:
<PageLayout>
  <GridItem 
    span={12} 
    md={10} 
    lg={8} 
    mdStart={2}
    lgStart={3}
    className="flex flex-col items-center"
  >
    <YourContent />
  </GridItem>
</PageLayout>`}
        </div>

        <SubheadingText as="h3" className="mb-3">
          Full-Width Layout
        </SubheadingText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-8">
          {`<PageLayout maxWidth="full">
  <GridItem span={12}>
    <YourContent />
  </GridItem>
</PageLayout>`}
        </div>

        <SubheadingText as="h3" className="mb-3">
          Two-Column Layout
        </SubheadingText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-8">
          {`<PageLayout>
  <GridItem span={12} md={6}>Left Column</GridItem>
  <GridItem span={12} md={6}>Right Column</GridItem>
</PageLayout>`}
        </div>

        <SubheadingText as="h3" className="mb-3">
          Three-Column Layout
        </SubheadingText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto">
          {`<PageLayout>
  <GridItem span={12} md={6} lg={4}>Column 1</GridItem>
  <GridItem span={12} md={6} lg={4}>Column 2</GridItem>
  <GridItem span={12} lg={4}>Column 3</GridItem>
</PageLayout>`}
        </div>
      </div>
    </div>
  );
}
