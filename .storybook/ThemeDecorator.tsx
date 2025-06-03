import React, { useEffect } from "react";
import type { Decorator } from "@storybook/react";

/**
 * Theme decorator for Storybook
 *
 * This decorator applies the appropriate theme class to the HTML element
 * based on the theme selected in the Storybook toolbar.
 *
 * It mimics the behavior of the ThemeProvider in the actual application
 * by applying classes and setting data attributes.
 */
export const ThemeDecorator: Decorator = (Story, context) => {
  const { globals } = context;

  // Apply the theme class to the html element to mimic Next.js behavior
  useEffect(() => {
    const htmlElement = document.documentElement;
    const theme = globals.theme || "dark"; // Default to dark if not specified

    // Clear existing theme classes
    htmlElement.classList.remove("dark", "light");

    // Add the proper theme class
    htmlElement.classList.add(theme);

    // Store theme information in data attributes for tooling/debugging
    htmlElement.dataset.theme = theme;
    htmlElement.dataset.storybook = "true"; // Mark as running in Storybook

    // Update viewport colors for better preview
    if (theme === "dark") {
      document.body.style.backgroundColor = "var(--color-ink, #121212)";
      document.body.style.color = "var(--color-chalk, #FAFAFA)";
    } else {
      document.body.style.backgroundColor = "var(--color-chalk, #FAFAFA)";
      document.body.style.color = "var(--color-ink, #121212)";
    }

    // For stories with a component that uses ThemeProvider,
    // this ensures the initial render matches the toolbar selection
    localStorage.setItem("storybook-theme", theme);
  }, [globals.theme]);

  return <Story />;
};
