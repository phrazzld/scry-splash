import type { Meta, StoryObj } from "@storybook/react"
import { CTASection } from "./cta-section"
import { NoiseBackground } from "@/components/ui/noise-background"

const meta: Meta<typeof CTASection> = {
  title: "Molecules/CTASection",
  component: CTASection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    buttonText: {
      control: "text",
      description: "Button text content",
    },
    microcopy: {
      control: "text",
      description: "Microcopy text displayed below the button",
    },
    buttonVariant: {
      control: "select",
      options: ["default", "cta", "gradient", "destructive", "outline", "secondary", "ghost", "link"],
      description: "Button variant style",
    },
    buttonSize: {
      control: "select",
      options: ["default", "sm", "md", "lg", "xl", "icon"],
      description: "Button size",
    },
    onButtonClick: {
      action: "clicked",
      description: "Callback function when button is clicked",
    },
    buttonAriaLabel: {
      control: "text",
      description: "Aria label for the button",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the content",
    },
    microcopyColor: {
      control: "text",
      description: "Text color class for microcopy",
    },
  },
}

export default meta
type Story = StoryObj<typeof CTASection>

// Helper for consistent decoration
const withBackground = (Story: React.ComponentType) => (
  <NoiseBackground baseColor="var(--color-ink)" className="p-12">
    <Story />
  </NoiseBackground>
)

// Default (with preset text and styles)
export const Default: Story = {
  args: {
    buttonText: "Get early access",
    microcopy: "Beta invites roll out weekly.",
    buttonVariant: "gradient",
    buttonSize: "xl",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// Different button variant (outline)
export const OutlineVariant: Story = {
  args: {
    buttonText: "Get early access",
    microcopy: "Beta invites roll out weekly.",
    buttonVariant: "outline",
    buttonSize: "xl",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// Smaller size
export const SmallerSize: Story = {
  args: {
    buttonText: "Sign up",
    microcopy: "Get early access",
    buttonVariant: "cta",
    buttonSize: "lg",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// Alternative content
export const AlternativeContent: Story = {
  args: {
    buttonText: "Request access",
    microcopy: "Get notified when we launch",
    buttonVariant: "cta",
    buttonSize: "xl",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// Ghost button style
export const GhostButton: Story = {
  args: {
    buttonText: "Learn more",
    microcopy: "See how Scry works",
    buttonVariant: "ghost",
    buttonSize: "lg",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// Left-aligned
export const LeftAligned: Story = {
  args: {
    buttonText: "Get early access",
    microcopy: "Beta invites roll out weekly.",
    buttonVariant: "gradient",
    buttonSize: "xl",
    centered: false,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// No microcopy
export const NoMicrocopy: Story = {
  args: {
    buttonText: "Join now",
    microcopy: "",
    buttonVariant: "cta",
    buttonSize: "xl",
    centered: true,
  },
  decorators: [withBackground],
}

// Alternative color scheme
export const AlternativeColorScheme: Story = {
  args: {
    buttonText: "Get early access",
    microcopy: "Beta invites roll out weekly.",
    buttonVariant: "secondary",
    buttonSize: "xl",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [(Story) => (
    <NoiseBackground baseColor="#1a1a1a" className="p-12">
      <Story />
    </NoiseBackground>
  )],
}