"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  systemTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  systemTheme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "scry-ui-theme",
  attribute = "class",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  // Initialize theme from localStorage or default
  const [theme, setTheme] = useState<Theme>(
    () => {
      if (typeof window !== "undefined") {
        const storedTheme = localStorage.getItem(storageKey);
        if (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system") {
          return storedTheme;
        }
      }
      return defaultTheme;
    }
  );
  
  // Track the current system theme 
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  // Detect system theme using matchMedia
  useEffect(() => {
    if (typeof window !== "undefined" && enableSystem) {
      // Check initial system preference
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setSystemTheme(isDarkMode ? "dark" : "light");

      // Set up listener for theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };

      // Add listener for theme changes (modern API)
      mediaQuery.addEventListener("change", handleChange);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [enableSystem]);

  // Apply theme to document - with fallback for server rendering
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      
      // Get the active theme
      const activeTheme = theme === "system" ? systemTheme : theme;
      
      // Store the active theme for debugging
      root.dataset.theme = activeTheme;
      
      if (attribute === "class") {
        // Remove both theme classes first
        root.classList.remove("light", "dark");
        
        // Only add class if it's a valid theme class name
        if (activeTheme === "light" || activeTheme === "dark") {
          root.classList.add(activeTheme);
        }
      } else {
        // For other attribute types (data-*)
        root.setAttribute(attribute, activeTheme);
      }
    }
  }, [theme, systemTheme, attribute]);

  const value = {
    theme,
    systemTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export default ThemeProvider;