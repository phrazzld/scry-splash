'use client'

import React from 'react'

/**
 * This component renders an inline script that prevents FOUC (Flash of Unstyled Content)
 * by setting the theme class on the HTML element before React hydration.
 */
export function ThemeScript({
  defaultTheme = "system",
  storageKey = "scry-ui-theme",
  attribute = "class",
}: {
  defaultTheme?: "dark" | "light" | "system";
  storageKey?: string;
  attribute?: string;
}) {
  // Minified anti-FOUC script that runs before any visual rendering
  const script = `
    (function() {
      try {
        // Get stored theme from localStorage
        var theme = localStorage.getItem("${storageKey}") || "${defaultTheme}";
        
        // If theme is "system" or invalid, detect system preference
        if (theme === "system" || (theme !== "dark" && theme !== "light")) {
          var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          theme = systemTheme;
        }
        
        // Apply theme class to HTML element
        var root = document.documentElement;
        
        if ("${attribute}" === "class") {
          root.classList.remove("light", "dark");
          root.classList.add(theme);
        } else {
          root.setAttribute("${attribute}", theme);
        }
        
        // Store for debugging
        root.dataset.theme = theme;
      } catch (e) {
        // Fail silently if localStorage is not available
        console.warn("Theme detection failed:", e);
      }
    })();
  `.replace(/\n\s+/g, ' ').trim(); // Minify by removing newlines and extra spaces

  // Return an inline, blocking script in the head
  return (
    <script 
      id="theme-script"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}

export default ThemeScript;