import type { Meta, StoryObj } from "@storybook/react";
import { SplashPage } from "./splash-page";
import { ThemeProvider } from "@/components/ui/theme-provider";

const meta: Meta<typeof SplashPage> = {
  title: "Organisms/SplashPage",
  component: SplashPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
          The main splash page component for the Scry application.
          This component supports both light and dark themes, with automatic
          adaptation based on the selected theme.
        `,
      },
    },
  },
  argTypes: {
    headline: { control: "text" },
    subheadline: { control: "text" },
    buttonText: { control: "text" },
    microcopy: { control: "text" },
    backgroundColor: { control: "color" },
    centered: { control: "boolean" },
    animate: { control: "boolean" },
    staggerDelay: { control: { type: "range", min: 0, max: 500, step: 50 } },
    onCtaClick: { action: "CTA button clicked" },
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="system"
        storageKey="storybook-theme"
        enableSystem
      >
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SplashPage>;

/**
 * Default splash page matching production configuration with left alignment and theme-aware styling
 */
export const Default: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "", // Empty in production
    buttonText: "Get early access",
    microcopy: "", // Empty in production
    backgroundColor: "var(--background)", // Theme-aware background
    centered: false, // Left-aligned in production
    animate: true,
    staggerDelay: 100,
  },
};

/**
 * Animation disabled for testing and static rendering
 */
export const NoAnimation: Story = {
  args: {
    animate: false,
  },
};

/**
 * Centered version of the splash page (alternate layout)
 */
export const Centered: Story = {
  args: {
    centered: true,
  },
};

/**
 * Custom content example
 */
export const CustomContent: Story = {
  args: {
    headline: "Unlock Your Knowledge",
    subheadline:
      "Transform your notes into a powerful learning system with AI-powered spaced repetition",
    buttonText: "Get Early Access",
    microcopy: "Join thousands of beta users today",
  },
};

/**
 * Custom background color
 */
export const CustomBackground: Story = {
  args: {
    backgroundColor: "#1a1a2e",
  },
};

/**
 * Faster stagger animation
 */
export const FastAnimation: Story = {
  args: {
    staggerDelay: 50,
  },
};

/**
 * Slower stagger animation
 */
export const SlowAnimation: Story = {
  args: {
    staggerDelay: 200,
  },
};

/**
 * Dark theme variant
 */
export const DarkTheme: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "", // Empty in production
    buttonText: "Get early access",
    microcopy: "", // Empty in production
    backgroundColor: "var(--background)", // Theme-aware background
    centered: false, // Left-aligned in production
    animate: false, // Disabled for consistent screenshots
  },
  parameters: {
    backgrounds: { default: "dark" },
    chromatic: { theme: "dark" },
  },
};

/**
 * Light theme variant
 */
export const LightTheme: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "", // Empty in production
    buttonText: "Get early access",
    microcopy: "", // Empty in production
    backgroundColor: "var(--background)", // Theme-aware background
    centered: false, // Left-aligned in production
    animate: false, // Disabled for consistent screenshots
  },
  parameters: {
    backgrounds: { default: "light" },
    chromatic: { theme: "light" },
  },
};
