"use client"

import React, { useEffect, useState } from "react"

export function ThemeDebug() {
  const [styles, setStyles] = useState<Record<string, string>>({})

  useEffect(() => {
    const computedStyles = window.getComputedStyle(document.documentElement)
    const vars = {
      "--background": computedStyles.getPropertyValue("--background"),
      "--foreground": computedStyles.getPropertyValue("--foreground"),
      "--muted-foreground": computedStyles.getPropertyValue("--muted-foreground"),
      "--primary": computedStyles.getPropertyValue("--primary"),
      "--primary-foreground": computedStyles.getPropertyValue("--primary-foreground"),
      "--border": computedStyles.getPropertyValue("--border"),
      "--input": computedStyles.getPropertyValue("--input"),
    }
    setStyles(vars)
  }, [])

  return (
    <div className="fixed bottom-0 right-0 bg-background p-4 border border-foreground/10 text-xs z-50">
      <pre className="text-foreground">
        {JSON.stringify(styles, null, 2)}
      </pre>
    </div>
  )
}