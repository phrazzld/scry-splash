"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the NoiseBackground component
 *
 * The NoiseBackground component provides a subtle noise texture overlay on
 * a colored background, creating visual depth and tactility without being distracting.
 */
export interface NoiseBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Base background color to apply underneath the noise texture
   *
   * Accepts any valid CSS color value. This is the "canvas" on which the
   * noise texture will be applied. For theme compatibility, using CSS
   * variables is recommended.
   *
   * @default "var(--background)" - Uses the current theme background color
   */
  baseColor?: string;

  /**
   * Opacity level of the noise texture overlay
   *
   * Controls how prominent the noise texture appears. Lower values create
   * a more subtle effect, while higher values make the noise more visible.
   *
   * @default 0.02 - Very subtle noise effect
   */
  noiseOpacity?: number;

  /**
   * Additional CSS classes to apply to the container element
   *
   * Used to extend the component with custom styles or utility classes.
   */
  className?: string;
}

/**
 * NoiseBackground component for Scry
 *
 * Applies a subtle noise texture over a background color to create depth and visual interest.
 * The component uses an SVG-based fractal noise pattern that is lightweight and scalable.
 *
 * Use this component for:
 * - Adding subtle texture to sections or cards
 * - Creating differentiated background areas
 * - Enhancing visual hierarchy with textural contrast
 *
 * The noise effect is intentionally subtle and non-distracting, designed to enhance
 * readability while adding depth to the UI.
 *
 * @example
 * ```tsx
 * // Basic usage with default settings
 * <NoiseBackground>
 *   <p>Content with subtle noise texture</p>
 * </NoiseBackground>
 *
 * // Custom background color and opacity
 * <NoiseBackground baseColor="#f8f9fa" noiseOpacity={0.05}>
 *   <p>Content with light gray background and slightly more visible noise</p>
 * </NoiseBackground>
 *
 * // Using with theme variables and custom class
 * <NoiseBackground
 *   baseColor="var(--primary)"
 *   className="rounded-lg p-4"
 * >
 *   <p className="text-white">Highlighted content</p>
 * </NoiseBackground>
 * ```
 */
export function NoiseBackground({
  baseColor = "var(--background)",
  noiseOpacity = 0.02,
  className,
  children,
  ...props
}: NoiseBackgroundProps) {
  // SVG noise pattern - using fractalNoise with feTurbulence
  // This creates a lightweight, data URL SVG pattern that doesn't require an external file.
  // The fractalNoise type produces a natural-looking texture, while the high baseFrequency
  // creates a fine grain. The SVG is URL-encoded for direct use in CSS.
  const noiseSvg = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E`;

  return (
    <div
      className={cn("relative", className)}
      style={{ backgroundColor: baseColor }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${noiseSvg}")`,
          backgroundRepeat: "repeat",
          opacity: noiseOpacity,
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
