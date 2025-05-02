import type { Meta, StoryObj } from "@storybook/react"
import { HeroSection } from "./hero-section"
import { NoiseBackground } from "@/components/ui/noise-background"

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
      description: "Main headline text",
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
  },
}

export default meta
type Story = StoryObj<typeof HeroSection>

// Default hero section (centered with default text)
export const Default: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "default",
    logoColor: "chalk",
    centered: true,
    textColor: "text-chalk",
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}

// Left-aligned variant
export const LeftAligned: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "default",
    logoColor: "chalk",
    centered: false,
    textColor: "text-chalk",
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}

// With larger logo
export const LargerLogo: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "large",
    logoColor: "chalk",
    centered: true,
    textColor: "text-chalk",
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}

// With custom content
export const CustomContent: Story = {
  args: {
    headline: "Transform your notes into knowledge",
    subheadline: "Scry uses AI to help you remember what matters most",
    logoSize: "default",
    logoColor: "chalk",
    centered: true,
    textColor: "text-chalk",
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}

// With different color scheme
export const AlternateColors: Story = {
  args: {
    headline: "Remember effortlessly.",
    subheadline: "Turns your notes into spaced‑repetition prompts—automatically.",
    logoSize: "default",
    logoColor: "cobalt",
    centered: true,
    textColor: "text-cobalt",
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-chalk)" className="min-h-[400px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}