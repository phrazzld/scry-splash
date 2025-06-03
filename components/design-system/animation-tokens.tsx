import React from "react";
import { cn } from "@/lib/utils";
import {
  HeadingText,
  SubheadingText,
  BodyText,
} from "@/components/ui/typography";
import { Container, GridItem } from "@/components/ui/container";

export interface AnimationTokensProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * AnimationTokens component documents the animation system
 */
export function AnimationTokens({ className, ...props }: AnimationTokensProps) {
  // Animation timing tokens
  const animationTokens = [
    {
      name: "Fade Duration",
      variable: "--animation-fade-duration",
      value: "200ms",
      description: "Duration for fade animations",
    },
    {
      name: "Fade Timing",
      variable: "--animation-fade-timing",
      value: "ease-out",
      description: "Timing function for fade animations",
    },
  ];

  // Animation classes
  const animationClasses = [
    {
      name: "animate-fade-in",
      description: "Fades in an element from transparent to opaque",
      keyframes: "fadeIn",
      css: `
.animate-fade-in {
  animation: fadeIn var(--animation-fade-duration) var(--animation-fade-timing) forwards;
  animation-fill-mode: both;
  opacity: 0;
}`,
    },
    {
      name: "animate-accordion-down",
      description: "Expands an accordion panel downward",
      keyframes: "accordion-down",
      css: `
.animate-accordion-down {
  animation: accordion-down 0.2s ease-out;
}`,
    },
    {
      name: "animate-accordion-up",
      description: "Collapses an accordion panel upward",
      keyframes: "accordion-up",
      css: `
.animate-accordion-up {
  animation: accordion-up 0.2s ease-out;
}`,
    },
  ];

  // Keyframes
  const keyframes = [
    {
      name: "fadeIn",
      description: "Fades in an element",
      code: `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    },
    {
      name: "accordion-down",
      description: "Expands an element vertically",
      code: `
@keyframes accordion-down {
  from { height: "0"; }
  to { height: "var(--radix-accordion-content-height)"; }
}`,
    },
    {
      name: "accordion-up",
      description: "Collapses an element vertically",
      code: `
@keyframes accordion-up {
  from { height: "var(--radix-accordion-content-height)"; }
  to { height: "0"; }
}`,
    },
  ];

  return (
    <div className={cn("w-full p-8", className)} {...props}>
      <div className="mb-8">
        <HeadingText>Animation Tokens</HeadingText>
        <BodyText className="mt-2 text-muted-foreground">
          Scry uses subtle animations to enhance the user experience. The
          animation system provides consistent timing and easing functions to
          ensure smooth transitions throughout the interface.
        </BodyText>
      </div>

      {/* Animation Tokens */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          Animation Tokens
        </SubheadingText>

        <table className="w-full border-collapse mb-8">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-2 text-left">Token</th>
              <th className="border border-border p-2 text-left">Variable</th>
              <th className="border border-border p-2 text-left">Value</th>
              <th className="border border-border p-2 text-left">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {animationTokens.map((token, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
              >
                <td className="border border-border p-2 font-medium">
                  {token.name}
                </td>
                <td className="border border-border p-2 font-mono text-sm">
                  {token.variable}
                </td>
                <td className="border border-border p-2">{token.value}</td>
                <td className="border border-border p-2">
                  {token.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <SubheadingText as="h3" className="mb-4">
          Animation Examples
        </SubheadingText>
        <Container gap="md">
          <GridItem span={12} md={6} className="mb-6">
            <div className="p-6 border border-border rounded-lg h-full">
              <SubheadingText as="h4" className="mb-4">
                Fade In
              </SubheadingText>
              <button
                className="block w-full h-24 bg-primary rounded-md mb-4 hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  // Toggle animation by removing and re-adding element
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) {
                    const demo = parent.querySelector("[data-demo='fade-in']");
                    if (demo) {
                      const clone = demo.cloneNode(true);
                      demo.parentElement?.replaceChild(clone, demo);
                    }
                  }
                }}
              >
                Click to Replay
              </button>
              <div
                data-demo="fade-in"
                className="w-full h-24 bg-muted rounded-md animate-fade-in"
              ></div>
            </div>
          </GridItem>

          <GridItem span={12} md={6} className="mb-6">
            <div className="p-6 border border-border rounded-lg h-full">
              <SubheadingText as="h4" className="mb-4">
                Button Interactions
              </SubheadingText>
              <div className="space-y-4">
                <div>
                  <BodyText weight="medium" className="mb-2">
                    Hover State
                  </BodyText>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md w-full hover:bg-primary/90 transition-colors">
                    Hover me
                  </button>
                </div>
                <div>
                  <BodyText weight="medium" className="mb-2">
                    Active State
                  </BodyText>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md w-full active:scale-[0.98] transition-transform">
                    Click me
                  </button>
                </div>
              </div>
            </div>
          </GridItem>
        </Container>
      </div>

      {/* Animation Classes */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          Animation Classes
        </SubheadingText>

        <div className="space-y-6">
          {animationClasses.map((animClass, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="p-4 bg-muted">
                <BodyText weight="medium">{animClass.name}</BodyText>
              </div>
              <div className="p-4">
                <BodyText className="mb-2">{animClass.description}</BodyText>
                <BodyText weight="medium" className="text-sm mt-4 mb-2">
                  CSS Implementation:
                </BodyText>
                <pre className="p-3 bg-muted rounded-md text-sm overflow-auto">
                  <code>{animClass.css}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <div className="mb-12">
        <SubheadingText as="h2" className="mb-4">
          Keyframes
        </SubheadingText>

        <div className="space-y-6">
          {keyframes.map((keyframe, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <div className="p-4 bg-muted">
                <BodyText weight="medium">@keyframes {keyframe.name}</BodyText>
              </div>
              <div className="p-4">
                <BodyText className="mb-2">{keyframe.description}</BodyText>
                <pre className="p-3 bg-muted rounded-md text-sm overflow-auto">
                  <code>{keyframe.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="mb-12">
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
                <li>Use animations sparingly to enhance the user experience</li>
                <li>Keep animations subtle and quick (under 300ms)</li>
                <li>Use the provided animation tokens for consistency</li>
                <li>Consider users who prefer reduced motion</li>
              </ul>
            </div>
          </GridItem>

          <GridItem span={12} md={6}>
            <div className="p-4 rounded-md border border-border">
              <SubheadingText as="h3" className="mb-2">
                Don&apos;t
              </SubheadingText>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create animations that are too long or distracting</li>
                <li>Use animations that could trigger motion sickness</li>
                <li>Animate too many elements simultaneously</li>
                <li>Recreate animations that already exist in the system</li>
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
        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-6">
          {`/* Using animation classes */
<div className="animate-fade-in">
  This content will fade in
</div>`}
        </div>

        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto mb-6">
          {`/* Using animation with delay in SplashPage */
export function SplashPage({ animate = true, staggerDelay = 100 }) {
  const heroDelay = animate ? { style: { animationDelay: "0ms" } } : {};
  const benefitsDelay = animate ? { style: { animationDelay: \`\${staggerDelay}ms\` } } : {};
  
  return (
    <>
      <div className="animate-fade-in" {...heroDelay}>Hero content</div>
      <div className="animate-fade-in" {...benefitsDelay}>Benefits</div>
    </>
  );
}`}
        </div>

        <div className="p-4 rounded-md bg-muted font-mono text-sm whitespace-pre overflow-auto">
          {`/* Transition utilities with Tailwind */
<button className="transition-colors hover:bg-primary/90">
  Button with hover effect
</button>`}
        </div>
      </div>
    </div>
  );
}
