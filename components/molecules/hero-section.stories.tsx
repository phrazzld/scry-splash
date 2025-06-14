import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "./hero-section";
import { NoiseBackground } from "@/components/ui/noise-background";

const meta: Meta<typeof HeroSection> = {
  title: "Molecules/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    logoSize: {
      control: "select",
      options: ["small", "medium", "default", "large"],
      description: "Size of the logo",
    },
    logoColor: {
      control: "select",
      options: ["chalk", "ink", "cobalt"],
      description: "Color of the logo",
    },
    headline: {
      control: "text",
      description:
        "Main headline text (used when typewriter effect is disabled)",
    },
    subheadline: {
      control: "text",
      description: "Subheadline text",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the content",
    },
    textColor: {
      control: "text",
      description: "Text color class for headline and subheadline",
    },
    useTypewriterEffect: {
      control: "boolean",
      description: "Enable typewriter animation for the headline",
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

// Default hero section with typewriter animation (matches production configuration)
export const Default: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "", // Empty in production
    logoSize: "large", // Large logo in production
    logoColor: "chalk",
    centered: false, // Left-aligned in production
    textColor: "text-foreground", // Uses theme-aware color in production
    useTypewriterEffect: true,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--background)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
};

// Static headline (no typewriter)
export const StaticHeadline: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline:
      "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "default",
    logoColor: "chalk",
    centered: true,
    textColor: "text-chalk",
    useTypewriterEffect: false,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
};

// Left-aligned variant
export const LeftAligned: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline:
      "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "default",
    logoColor: "chalk",
    centered: false,
    textColor: "text-chalk",
    useTypewriterEffect: true,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
};

// With larger logo
export const LargerLogo: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline:
      "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "large",
    logoColor: "chalk",
    centered: true,
    textColor: "text-chalk",
    useTypewriterEffect: true,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
};

// With custom content
export const CustomContent: Story = {
  args: {
    headline: "Transform your notes into knowledge",
    subheadline: "Scry uses AI to help you remember what matters most",
    logoSize: "default",
    logoColor: "chalk",
    centered: true,
    textColor: "text-chalk",
    useTypewriterEffect: false,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
};

// With different color scheme
export const AlternateColors: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline:
      "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "default",
    logoColor: "cobalt",
    centered: true,
    textColor: "text-cobalt",
    useTypewriterEffect: true,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-chalk)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
};
