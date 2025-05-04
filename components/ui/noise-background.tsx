"use client"

import React from "react";
import { cn } from "@/lib/utils";

export interface NoiseBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: string;
  noiseOpacity?: number;
  className?: string;
}

export function NoiseBackground({
  baseColor = "var(--background)",
  noiseOpacity = 0.02,
  className,
  children,
  ...props
}: NoiseBackgroundProps) {
  // SVG noise pattern - using fractalNoise with feTurbulence
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
          backgroundRepeat: 'repeat',
          opacity: noiseOpacity
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}