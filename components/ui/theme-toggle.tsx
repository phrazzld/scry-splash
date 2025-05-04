"use client"

import React from "react"
import { useTheme } from "@/components/ui/theme-provider"
import { Button } from "@/components/ui/button"

/**
 * Simple theme toggle component for testing purposes
 * Allows toggling between light, dark, and system themes
 */
export function ThemeToggle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={`theme-toggle ${className || ""}`} {...props}>
      <div className="flex items-center space-x-2 p-4 border border-foreground/10 rounded-md bg-background shadow-sm">
        <span className="text-foreground text-sm">Current theme: {theme}</span>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("light")}
            className={theme === "light" ? "bg-primary/20" : ""}
          >
            Light
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("dark")}
            className={theme === "dark" ? "bg-primary/20" : ""}
          >
            Dark
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme("system")}
            className={theme === "system" ? "bg-primary/20" : ""}
          >
            System
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ThemeToggle