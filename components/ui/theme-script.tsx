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
  // Use a more aggressive approach for preventing FOUC
  // This script runs synchronously before any other JavaScript
  const script = `
    (function() {
      function setTheme(theme) {
        // Apply theme class to HTML element
        var root = document.documentElement;
        
        // Clear existing theme classes
        root.classList.remove("light", "dark");
        
        // Add new theme class
        root.classList.add(theme);
        
        // Store for debugging and verification
        root.dataset.theme = theme;
        
        // Also store in document level data attribute for testing
        document.body.dataset.appliedTheme = theme;
      }
      
      try {
        // Get stored theme from localStorage
        var storedTheme = localStorage.getItem("${storageKey}");
        var theme = storedTheme || "${defaultTheme}";
        
        // If theme is "system" or invalid, detect system preference
        if (theme === "system" || (theme !== "dark" && theme !== "light")) {
          var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          theme = systemTheme;
        }
        
        // Apply theme immediately
        setTheme(theme);
        
        // Create a hidden element to indicate successful early theme application
        // This helps E2E tests verify the theme was applied before page render
        var indicator = document.createElement('div');
        indicator.id = 'theme-applied-early';
        indicator.style.display = 'none';
        indicator.dataset.appliedTheme = theme;
        document.head.appendChild(indicator);
        
        // Add event listener for media query changes when in system mode
        if (storedTheme === "system" || !storedTheme) {
          var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
          
          // Apply theme again if system preference changes
          mediaQuery.addEventListener("change", function(e) {
            var newTheme = e.matches ? "dark" : "light";
            setTheme(newTheme);
          });
        }
      } catch (e) {
        // Apply fallback theme if error occurs
        setTheme("${defaultTheme === "system" ? "light" : defaultTheme}");
        console.warn("Theme detection failed:", e);
      }
    })();
  `.replace(/\n\s+/g, ' ').trim(); // Minify by removing newlines and extra spaces

  // Create the ultimate anti-FOUC setup:
  // 1. Generate a blocking script - executes before anything else
  // 2. Add a <noscript> fallback for non-JS environments
  return (
    <>
      {/* High-priority blocking script that runs before anything else */}
      <script 
        id="theme-script"
        dangerouslySetInnerHTML={{ __html: script }}
        key="theme-script"
      />
      
      {/* Fallback for non-JS environments using media queries */}
      <noscript>
        <style 
          dangerouslySetInnerHTML={{
            __html: `
              @media (prefers-color-scheme: dark) {
                :root:not(.light) {
                  color-scheme: dark;
                }
              }
              @media (prefers-color-scheme: light) {
                :root:not(.dark) {
                  color-scheme: light;
                }
              }
            `
          }}
        />
      </noscript>
    </>
  );
}

export default ThemeScript;