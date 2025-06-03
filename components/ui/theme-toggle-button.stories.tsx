import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggleButton } from "./theme-toggle-button";
import { ThemeProvider } from "./theme-provider";

const meta = {
  title: "UI/ThemeToggleButton",
  component: ThemeToggleButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
          A minimal, accessible button that allows users to toggle between light and dark modes.
          The button displays a sun icon in dark mode and a moon icon in light mode,
          indicating what the theme will change to when clicked.
          
          Uses the theme context from ThemeProvider via useTheme hook.
        `,
      },
    },
    a11y: {
      // Accessibility checks
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "button-name",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
    "aria-label": {
      control: "text",
      description: "Accessibility label for the button",
    },
  },
  // ThemeProvider is necessary to supply the theme context
  decorators: [
    (StoryComponent) => (
      <div className="flex flex-col items-center gap-8">
        <StoryComponent />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The button showing the sun icon (for switching to light theme).
 * This is how the button appears in dark mode.
 */
export const InDarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (StoryComponent) => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <div className="p-8 bg-background text-foreground rounded-lg flex justify-center items-center">
          <StoryComponent />
        </div>
      </ThemeProvider>
    ),
  ],
};

/**
 * The button showing the moon icon (for switching to dark theme).
 * This is how the button appears in light mode.
 */
export const InLightMode: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
  decorators: [
    (StoryComponent) => (
      <ThemeProvider
        defaultTheme="light"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <div className="p-8 bg-background text-foreground rounded-lg flex justify-center items-center">
          <StoryComponent />
        </div>
      </ThemeProvider>
    ),
  ],
};

/**
 * The button integrated into a header component.
 */
export const InHeader: Story = {
  decorators: [
    (StoryComponent) => (
      <ThemeProvider
        defaultTheme="light"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <div className="w-full max-w-3xl p-4 bg-background border-b border-border flex justify-between items-center">
          <div className="text-xl font-bold">Scry</div>
          <StoryComponent />
        </div>
      </ThemeProvider>
    ),
  ],
};

/**
 * The button integrated into a footer component.
 */
export const InFooter: Story = {
  decorators: [
    (StoryComponent) => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <div className="w-full max-w-3xl p-6 bg-background border-t border-border flex justify-between items-center">
          <div className="text-sm opacity-70">© 2025 Scry</div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Theme</span>
            <StoryComponent />
          </div>
        </div>
      </ThemeProvider>
    ),
  ],
};

/**
 * Demonstrates button interaction states.
 */
export const InteractionStates: Story = {
  render: () => (
    <ThemeProvider
      defaultTheme="light"
      storageKey="storybook-theme"
      enableSystem={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 bg-background text-foreground rounded-lg">
        <div className="flex flex-col items-center">
          <ThemeToggleButton />
          <span className="mt-2 text-sm">Normal</span>
        </div>
        <div className="flex flex-col items-center">
          <ThemeToggleButton className="hover:bg-accent" />
          <span className="mt-2 text-sm">Hover</span>
        </div>
        <div className="flex flex-col items-center">
          <ThemeToggleButton className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
          <span className="mt-2 text-sm">Focus</span>
        </div>
        <div className="flex flex-col items-center">
          <ThemeToggleButton disabled />
          <span className="mt-2 text-sm">Disabled</span>
        </div>
      </div>
    </ThemeProvider>
  ),
};

/**
 * Theme comparison demonstrating how the button adapts to light and dark themes
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
      <div className="p-6 border border-border rounded-lg bg-background flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">Light Theme</h3>
        <div className="flex justify-center rounded-md bg-background p-4">
          <ThemeProvider
            defaultTheme="light"
            storageKey="theme-example-1"
            enableSystem={false}
          >
            <ThemeToggleButton />
          </ThemeProvider>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Shows moon icon when in light mode
        </p>
      </div>

      <div className="p-6 border border-border rounded-lg bg-background flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">Dark Theme</h3>
        <div className="flex justify-center rounded-md bg-background p-4">
          <ThemeProvider
            defaultTheme="dark"
            storageKey="theme-example-2"
            enableSystem={false}
          >
            <ThemeToggleButton />
          </ThemeProvider>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Shows sun icon when in dark mode
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    chromatic: {
      // Removed modes to fix Chromatic error - viewports and modes cannot be used together
      // Theme comparison is handled by the global theme toolbar instead
    },
  },
};

/**
 * Animated demonstration showcasing all interactions
 */
export const AnimatedDemo: Story = {
  render: function AnimatedDemoRender() {
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">(
      "light",
    );

    // Toggle theme and trigger animation sequence
    const handleDemoClick = () => {
      if (isAnimating) return;

      setIsAnimating(true);

      // Schedule animations with appropriate timing
      setTimeout(() => {
        setCurrentTheme(currentTheme === "light" ? "dark" : "light");

        setTimeout(() => {
          setIsAnimating(false);
        }, 1500); // Allow time for the toggle animation to complete
      }, 1000); // Delay before triggering the theme change
    };

    return (
      <div className="p-8 border border-border rounded-lg bg-background flex flex-col items-center gap-6">
        <h3 className="text-lg font-semibold">Interactive Demo</h3>

        <div className="flex justify-center rounded-md bg-background p-4">
          <ThemeProvider
            defaultTheme={currentTheme}
            storageKey="theme-demo"
            enableSystem={false}
          >
            <ThemeToggleButton />
          </ThemeProvider>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleDemoClick}
            disabled={isAnimating}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isAnimating ? "Animating..." : "Toggle Theme Animation"}
          </button>
          <p className="text-sm text-center text-muted-foreground max-w-md">
            Click the button to see a full animation cycle of the theme toggle
            button. Watch for the smooth transition, icon rotation, and scaling
            effects.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "This story demonstrates the complete animation sequence of the ThemeToggleButton component, including hover, press, and theme change animations.",
      },
    },
  },
};
