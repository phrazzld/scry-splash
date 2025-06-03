"use client";

import * as React from "react";
import { useTheme } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

/**
 * Props for the ThemeToggleButton component
 */
export interface ThemeToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * ThemeToggleButton component
 *
 * A minimal, accessible button that allows users to toggle between light and dark modes.
 * The button displays a sun icon in dark mode and a moon icon in light mode,
 * indicating what the theme will change to when clicked.
 *
 * Uses the theme context from ThemeProvider via useTheme hook.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeToggleButton />
 *
 * // With custom class
 * <ThemeToggleButton className="absolute top-4 right-4" />
 *
 * // With custom aria-label
 * <ThemeToggleButton aria-label="Toggle dark mode" />
 * ```
 */
export function ThemeToggleButton({
  className,
  ...props
}: ThemeToggleButtonProps) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Determine the current theme (accounting for system setting)
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Toggle between light and dark modes
  const toggleTheme = () => {
    // If current theme is dark, switch to light, otherwise switch to dark
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  // Handle mouse/touch events for the press effect
  const handlePointerDown = () => setIsPressed(true);
  const handlePointerUp = () => setIsPressed(false);
  const handlePointerLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
  };

  // Handle hover states
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Remove press state if user navigates away or cancels
  React.useEffect(() => {
    const handleBlur = () => setIsPressed(false);
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPressed(false);
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Determine descriptive text for screen readers
  const currentThemeDescription =
    currentTheme === "dark"
      ? "Currently in dark mode"
      : "Currently in light mode";
  const actionDescription =
    currentTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      onClick={toggleTheme}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2.5 text-sm font-medium",
        "bg-background hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "transition-all duration-[var(--theme-toggle-duration)] [transition-timing-function:var(--theme-toggle-timing)]",
        isPressed
          ? "scale-[var(--theme-toggle-scale-press)]"
          : isHovered
            ? "scale-[var(--theme-toggle-scale-expand)]"
            : "scale-100",
        className,
      )}
      aria-label={actionDescription}
      aria-pressed={currentTheme === "dark"} // For toggle button semantics
      aria-live="polite"
      type="button"
      {...props}
    >
      {/* Visually hidden text for screen readers */}
      <span className="sr-only">{currentThemeDescription}</span>

      {/* Container div for both icons with positioning */}
      <div
        className={cn(
          "relative w-5 h-5",
          "transition-transform duration-[var(--theme-toggle-duration)] [transition-timing-function:var(--theme-toggle-timing)]",
          isHovered && !isPressed ? "animate-subtle-pulse" : "",
        )}
        aria-hidden="true" // Hide decorative icons from screen readers
      >
        {/* Sun icon (shown in dark mode) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          role="presentation"
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all",
            "transform-gpu scale-100 rotate-0",
            "duration-[var(--theme-toggle-duration)] [transition-timing-function:var(--theme-toggle-timing)]",
            currentTheme === "dark"
              ? "opacity-100"
              : "opacity-0 rotate-[var(--theme-toggle-rotation)]",
          )}
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>

        {/* Moon icon (shown in light mode) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          role="presentation"
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all",
            "transform-gpu scale-100 rotate-0",
            "duration-[var(--theme-toggle-duration)] [transition-timing-function:var(--theme-toggle-timing)]",
            currentTheme === "light"
              ? "opacity-100"
              : "opacity-0 rotate-[calc(var(--theme-toggle-rotation)*-1)]",
          )}
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </button>
  );
}

export default ThemeToggleButton;
