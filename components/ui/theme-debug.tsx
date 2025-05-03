"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

interface ThemeDebugProps {
  className?: string;
  showCssVars?: boolean;
}

export function ThemeDebug({ className, showCssVars = true }: ThemeDebugProps) {
  const { theme, systemTheme } = useTheme()
  const [cssVars, setCssVars] = useState<Record<string, string>>({})
  const [localStorage, setLocalStorage] = useState<string | null>(null)
  const [htmlClass, setHtmlClass] = useState<string>("")
  const [htmlDataTheme, setHtmlDataTheme] = useState<string>("")
  
  useEffect(() => {
    // Get computed CSS variables
    if (showCssVars && typeof window !== "undefined") {
      const computedStyle = window.getComputedStyle(document.documentElement)
      const variables = {
        "--background": computedStyle.getPropertyValue("--background").trim(),
        "--foreground": computedStyle.getPropertyValue("--foreground").trim(),
        "--primary": computedStyle.getPropertyValue("--primary").trim(),
        "--secondary": computedStyle.getPropertyValue("--secondary").trim(),
        "--muted": computedStyle.getPropertyValue("--muted").trim(),
        "--muted-foreground": computedStyle.getPropertyValue("--muted-foreground").trim(),
        "--border": computedStyle.getPropertyValue("--border").trim(),
        "--input": computedStyle.getPropertyValue("--input").trim(),
      }
      setCssVars(variables)
    }
    
    // Get localStorage theme
    if (typeof window !== "undefined") {
      setLocalStorage(window.localStorage.getItem("scry-ui-theme"))
      setHtmlClass(document.documentElement.classList.toString())
      setHtmlDataTheme(document.documentElement.dataset.theme || "")
    }
  }, [theme, showCssVars])
  
  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg",
      "bg-background border border-border",
      "text-xs max-w-xs overflow-auto",
      className
    )}>
      <h3 className="font-bold mb-2 text-foreground">Theme Debug</h3>
      
      <div className="space-y-2">
        <div>
          <div className="font-medium text-foreground">Theme Context:</div>
          <div className="text-muted-foreground">Selected: <span className="text-foreground">{theme}</span></div>
          <div className="text-muted-foreground">System: <span className="text-foreground">{systemTheme}</span></div>
          <div className="text-muted-foreground">Active: <span className="text-foreground">{theme === "system" ? systemTheme : theme}</span></div>
        </div>
        
        <div>
          <div className="font-medium text-foreground">DOM State:</div>
          <div className="text-muted-foreground">HTML classes: <span className="text-foreground">{htmlClass}</span></div>
          <div className="text-muted-foreground">data-theme: <span className="text-foreground">{htmlDataTheme}</span></div>
          <div className="text-muted-foreground">localStorage: <span className="text-foreground">{localStorage || "null"}</span></div>
        </div>
        
        {showCssVars && (
          <div>
            <div className="font-medium text-foreground">CSS Variables:</div>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(cssVars).map(([key, value]) => (
                <div key={key} className="text-muted-foreground">
                  <span>{key}:</span> <span className="text-foreground ml-1">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}