"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Represents the available theme options in the application.
 * - "dark": Forces dark theme regardless of system preference
 * - "light": Forces light theme regardless of system preference
 * - "system": Automatically follows the system color scheme preference
 */
type Theme = "dark" | "light" | "system";

/**
 * Props for the ThemeProvider component.
 */
interface ThemeProviderProps {
  /**
   * Child components that will have access to the theme context
   */
  children: React.ReactNode;
  
  /**
   * The theme to use when no preference is stored in localStorage
   * @default "system"
   */
  defaultTheme?: Theme;
  
  /**
   * The localStorage key to use for storing theme preference
   * @default "scry-ui-theme"
   */
  storageKey?: string;
  
  /**
   * The HTML attribute to use for applying theme
   * - "class": Applies theme as CSS class on the HTML element
   * - Other values: Uses a data-* attribute
   * @default "class"
   */
  attribute?: string;
  
  /**
   * Whether to enable system theme detection and updates
   * @default true
   */
  enableSystem?: boolean;
}

/**
 * The shape of the theme context state that will be shared via React context
 */
interface ThemeProviderState {
  /**
   * The current selected theme ("dark", "light", or "system")
   */
  theme: Theme;
  
  /**
   * The current system theme preference ("dark" or "light")
   * This is used when theme is set to "system"
   */
  systemTheme: "dark" | "light";
  
  /**
   * Function to change the current theme
   * This will update both state and localStorage
   */
  setTheme: (theme: Theme) => void;
}

/**
 * Initial state for the theme context
 * This is the default value used when no provider is present (for type safety)
 */
const initialState: ThemeProviderState = {
  theme: "system",
  systemTheme: "dark",
  setTheme: () => null,
};

/**
 * React context for theme state
 * This context provides theme information and controls to components
 */
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * ThemeProvider component that manages theme state and provides it to child components.
 * This component handles theme detection, persistence, and application to the DOM.
 * 
 * Features:
 * - Reads and saves theme preference in localStorage
 * - Detects system color scheme preference
 * - Updates theme when system preference changes
 * - Applies theme as a class or attribute to the HTML element
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "scry-ui-theme",
  attribute = "class",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  /**
   * Initialize theme state from localStorage or default to the provided defaultTheme.
   * This runs once during component initialization.
   */
  const [theme, setTheme] = useState<Theme>(
    () => {
      // Only run on client side
      if (typeof window !== "undefined") {
        // Try to read the theme from localStorage
        const storedTheme = localStorage.getItem(storageKey);
        // Only use the stored theme if it's a valid theme option
        if (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system") {
          return storedTheme;
        }
      }
      // Fall back to the default theme if not running on client or no valid theme found
      return defaultTheme;
    }
  );
  
  /**
   * Track the current system color scheme preference.
   * This is used when the theme is set to "system".
   * We initialize with "dark" as a default and update it in the useEffect below.
   */
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  /**
   * Effect to detect the system theme preference using matchMedia.
   * This sets up an event listener to update the theme when the system preference changes.
   */
  useEffect(() => {
    // Only run on client side and if system theme detection is enabled
    if (typeof window !== "undefined" && enableSystem) {
      // Check initial system preference using the prefers-color-scheme media query
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setSystemTheme(isDarkMode ? "dark" : "light");

      // Set up listener for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };

      // Add listener for theme changes (modern API)
      mediaQuery.addEventListener("change", handleChange);
      
      // Clean up listener on component unmount
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [enableSystem]);

  /**
   * Effect to apply the theme to the document.
   * This updates the DOM whenever the theme or systemTheme changes.
   */
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      
      // Get the active theme (use systemTheme when theme is set to "system")
      const activeTheme = theme === "system" ? systemTheme : theme;
      
      // Store the active theme for debugging and tooling
      root.dataset.theme = activeTheme;
      
      // Apply theme via class if attribute is "class"
      if (attribute === "class") {
        // Remove both theme classes first to ensure clean state
        root.classList.remove("light", "dark");
        
        // Only add class if it's a valid theme class name
        if (activeTheme === "light" || activeTheme === "dark") {
          root.classList.add(activeTheme);
        }
      } else {
        // For other attribute types (e.g., data-theme)
        root.setAttribute(attribute, activeTheme);
      }
    }
  }, [theme, systemTheme, attribute]);

  /**
   * The value object that will be provided to consumers of the context.
   * This includes the current theme state and a function to update it.
   */
  const value = {
    theme,
    systemTheme,
    // Function to update the theme and save it to localStorage
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

/**
 * Hook to access the theme context.
 * 
 * This hook provides access to:
 * - Current theme ("dark", "light", "system")
 * - Current system theme preference ("dark" or "light")
 * - Function to change the theme
 * 
 * @throws Error if used outside of a ThemeProvider
 * 
 * @example
 * ```tsx
 * const { theme, setTheme } = useTheme();
 * 
 * // To switch to dark theme
 * setTheme("dark");
 * 
 * // To use system preference
 * setTheme("system");
 * ```
 * 
 * @returns ThemeProviderState object containing theme information and controls
 */
export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);

  // Safety check to ensure the hook is used within a ThemeProvider
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export default ThemeProvider;