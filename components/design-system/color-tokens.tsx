import React from "react";
import { cn } from "@/lib/utils";
import {
  HeadingText,
  SubheadingText,
  BodyText,
} from "@/components/ui/typography";
import { Container, GridItem } from "@/components/ui/container";

export interface ColorTokensProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * ColorTokens component documents the color system
 */
export function ColorTokens({ className, ...props }: ColorTokensProps) {
  // Core brand colors
  const brandColors = [
    {
      name: "Ink",
      variable: "--color-ink",
      value: "#121212",
      description:
        "Primary dark color, used for backgrounds and text in light mode",
      contrastWithChalk: "15.85:1", // High contrast
      textColor: "var(--color-chalk)", // For visibility against this background
    },
    {
      name: "Chalk",
      variable: "--color-chalk",
      value: "#FAFAFA",
      description: "Primary light color, used for text on dark backgrounds",
      contrastWithInk: "15.85:1", // High contrast
      textColor: "var(--color-ink)", // For visibility against this background
    },
    {
      name: "Cobalt",
      variable: "--color-cobalt",
      value: "#0047AB",
      description:
        "Primary accent color, used for interactive elements and emphasis",
      contrastWithChalk: "7.15:1", // Passes WCAG AA for all text
      contrastWithInk: "3.45:1", // Passes WCAG AA for large text
      textColor: "var(--color-chalk)", // For visibility against this background
    },
    {
      name: "Cobalt Light",
      variable: "--color-cobalt-light",
      value: "#0051C4",
      description: "Lighter cobalt for hover states",
      contrastWithChalk: "6.42:1", // Passes WCAG AA for all text
      textColor: "var(--color-chalk)", // For visibility against this background
    },
    {
      name: "Purple",
      variable: "--color-purple",
      value: "#B494E9",
      description: "Secondary accent color",
      contrastWithInk: "8.17:1", // Passes WCAG AAA for normal text
      textColor: "var(--color-ink)", // For visibility against this background
    },
  ];

  // shadcn/ui semantic colors
  const semanticColors = [
    {
      name: "Background",
      variable: "--background",
      value: "var(--color-ink)",
      description: "Page background color",
      textColor: "var(--color-chalk)",
    },
    {
      name: "Foreground",
      variable: "--foreground",
      value: "var(--color-chalk)",
      description: "Primary text color",
      textColor: "var(--color-ink)",
    },
    {
      name: "Primary",
      variable: "--primary",
      value: "var(--color-cobalt)",
      description: "Primary elements like buttons",
      textColor: "var(--color-chalk)",
    },
    {
      name: "Secondary",
      variable: "--secondary",
      value: "#333333 (dark) / #E5E5E5 (light)",
      description: "Secondary elements",
      textColor: "var(--color-chalk)",
    },
    {
      name: "Accent",
      variable: "--accent",
      value: "var(--color-purple)",
      description: "Accent elements",
      textColor: "var(--color-ink)",
    },
    {
      name: "Muted",
      variable: "--muted",
      value: "#333333 (dark) / #E5E5E5 (light)",
      description: "Muted backgrounds",
      textColor: "var(--color-chalk)",
    },
    {
      name: "Muted Foreground",
      variable: "--muted-foreground",
      value: "#A0A0A0 (dark) / #737373 (light)",
      description: "Muted text",
      textColor: "var(--color-ink)",
    },
    {
      name: "Border",
      variable: "--border",
      value: "#333333 (dark) / #E5E5E5 (light)",
      description: "Border color",
      textColor: "var(--color-chalk)",
    },
    {
      name: "Ring",
      variable: "--ring",
      value: "var(--focus-outline-color)",
      description: "Focus ring color",
      textColor: "var(--color-chalk)",
    },
  ];

  return (
    <div className={cn("w-full p-8", className)} {...props}>
      <div className="mb-8">
        <HeadingText>Color Tokens</HeadingText>
        <BodyText className="mt-2 text-muted-foreground">
          The Scry color system is built around a high-contrast palette
          featuring Ink (dark), Chalk (light), and Cobalt (accent). All colors
          meet WCAG AA accessibility standards for their intended use.
        </BodyText>
      </div>

      {/* Brand Colors */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          Brand Colors
        </SubheadingText>
        <Container gap="md">
          {brandColors.map((color, index) => (
            <GridItem key={index} span={12} md={6} lg={4} className="mb-6">
              <div className="rounded-md overflow-hidden border border-border">
                <div
                  className="h-24 flex items-end p-4"
                  style={{
                    backgroundColor: color.value,
                    color: color.textColor,
                  }}
                >
                  <SubheadingText weight="bold">{color.name}</SubheadingText>
                </div>
                <div className="p-4 bg-card">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <BodyText weight="medium">Variable:</BodyText>
                      <code className="text-body-size font-mono">
                        {color.variable}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <BodyText weight="medium">HEX:</BodyText>
                      <code className="text-body-size font-mono">
                        {color.value}
                      </code>
                    </div>
                    {color.contrastWithChalk && (
                      <div className="flex justify-between">
                        <BodyText weight="medium">
                          Contrast with Chalk:
                        </BodyText>
                        <BodyText>{color.contrastWithChalk}</BodyText>
                      </div>
                    )}
                    {color.contrastWithInk && (
                      <div className="flex justify-between">
                        <BodyText weight="medium">Contrast with Ink:</BodyText>
                        <BodyText>{color.contrastWithInk}</BodyText>
                      </div>
                    )}
                  </div>
                  <BodyText className="mt-3 text-muted-foreground">
                    {color.description}
                  </BodyText>
                </div>
              </div>
            </GridItem>
          ))}
        </Container>
      </div>

      {/* Semantic Colors */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          Semantic Colors (shadcn/ui Integration)
        </SubheadingText>
        <BodyText className="mb-6">
          Scry maps its brand colors to shadcn/ui semantic color variables to
          ensure consistent theming across all components.
        </BodyText>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Name</th>
              <th className="border border-border p-2 text-left">Variable</th>
              <th className="border border-border p-2 text-left">Value</th>
              <th className="border border-border p-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {semanticColors.map((color, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
              >
                <td className="border border-border p-2 font-medium">
                  {color.name}
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  {color.variable}
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  {color.value}
                </td>
                <td className="border border-border p-2">
                  {color.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Usage Guidelines */}
      <div className="mb-8">
        <SubheadingText as="h2" className="mb-4">
          Usage Guidelines
        </SubheadingText>
        <Container gap="md">
          <GridItem span={12} md={6}>
            <div className="p-4 rounded-md border border-border">
              <SubheadingText as="h3" className="mb-2">
                Do
              </SubheadingText>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Use Ink for dark backgrounds and Chalk for light backgrounds
                </li>
                <li>
                  Use Cobalt for interactive elements like buttons and links
                </li>
                <li>Ensure text has sufficient contrast with its background</li>
                <li>
                  Use semantic color variables in components for consistency
                </li>
              </ul>
            </div>
          </GridItem>

          <GridItem span={12} md={6}>
            <div className="p-4 rounded-md border border-border">
              <SubheadingText as="h3" className="mb-2">
                Don&apos;t
              </SubheadingText>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use colors not defined in the design system</li>
                <li>
                  Place text directly on colors that don&apos;t provide
                  sufficient contrast
                </li>
                <li>
                  Override semantic colors without understanding their purpose
                </li>
                <li>Use HEX values directly; always use CSS variables</li>
              </ul>
            </div>
          </GridItem>
        </Container>
      </div>

      {/* Code Examples */}
      <div>
        <SubheadingText as="h2" className="mb-4">
          Code Examples
        </SubheadingText>
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto">
          {`/* CSS usage */
.my-element {
  background-color: var(--color-ink);
  color: var(--color-chalk);
}

/* Tailwind usage */
<div className="bg-ink text-chalk">
  Content
</div>

/* shadcn/ui semantic usage */
<div className="bg-background text-foreground">
  Content
</div>`}
        </div>
      </div>
    </div>
  );
}
