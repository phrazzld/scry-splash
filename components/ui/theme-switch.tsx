"use client"

import React from "react"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

/**
 * Props for the ThemeSwitch component
 */
interface ThemeSwitchProps {
  /**
   * Optional CSS class name to apply to the component
   * Allows for custom positioning and styling
   */
  className?: string
}

/**
 * ThemeSwitch component
 * 
 * A UI component that allows users to manually switch between light, dark, and system themes.
 * This component is primarily used for development and testing but can also be exposed
 * to end users to allow manual theme switching.
 * 
 * The component shows:
 * - The current active theme
 * - Buttons to switch between light, dark, and system themes
 * - The current system theme preference (when system mode is active)
 * 
 * By default, it's positioned in the bottom-right corner of the viewport.
 * 
 * @example
 * ```tsx
 * // Add to your page component
 * <ThemeSwitch />
 * 
 * // With custom positioning
 * <ThemeSwitch className="fixed top-4 left-4" />
 * ```
 */
export function ThemeSwitch({ className }: ThemeSwitchProps) {
  // Access theme state and controls from context
  const { theme, systemTheme, setTheme } = useTheme()
  
  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <div className={cn("fixed bottom-24 right-4 z-50 bg-background border border-border rounded-md shadow-lg p-3 text-xs", className)}>
      <div className="flex flex-col gap-2">
        <div className="text-foreground text-center mb-2 font-medium">
          Theme: {theme === "system" ? `System (${systemTheme})` : theme}
        </div>
        <button
          onClick={() => setTheme("light")}
          aria-label="Switch to light theme"
          className={cn(
            "px-3 py-1.5 rounded-sm font-medium",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            currentTheme === "light" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}
        >
          🌞 Light
        </button>
        <button
          onClick={() => setTheme("dark")}
          aria-label="Switch to dark theme"
          className={cn(
            "px-3 py-1.5 rounded-sm font-medium",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            currentTheme === "dark" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}
        >
          🌙 Dark
        </button>
        <button
          onClick={() => setTheme("system")}
          aria-label="Use system theme preference"
          className={cn(
            "px-3 py-1.5 rounded-sm font-medium",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            theme === "system" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}
        >
          💻 System ({systemTheme})
        </button>
      </div>
    </div>
  )
}