"use client"

import React from "react"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

interface ThemeSwitchProps {
  className?: string
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
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