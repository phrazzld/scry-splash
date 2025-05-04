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
      description: "Microcopy text displayed below the form",
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
    inputPlaceholder: {
      control: "text",
      description: "Placeholder text for the input field",
    },
    inputType: {
      control: "text",
      description: "Input type (e.g., email, text)",
    },
    inputAriaLabel: {
      control: "text",
      description: "Aria label for the input field",
    },
    onFormSubmit: {
      action: "form submitted",
      description: "Callback function when form is submitted with the input value",
    },
    onButtonClick: {
      action: "button clicked",
      description: "Legacy callback function when button is clicked (deprecated)",
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
  <NoiseBackground baseColor="var(--background)" className="p-12">
    <Story />
  </NoiseBackground>
)

// Default (matches production configuration)
export const Default: Story = {
  args: {
    buttonText: "Get early access",
    microcopy: "Beta invites roll out weekly.",
    inputPlaceholder: "Your email address",
    buttonVariant: "default",
    buttonSize: "default",
    centered: false, // Left-aligned in production
    microcopyColor: "text-foreground", // Theme-aware color in production
  },
  decorators: [(Story) => (
    <NoiseBackground baseColor="var(--background)" className="p-12">
      <Story />
    </NoiseBackground>
  )],
}

// Different button variant (outline)
export const OutlineVariant: Story = {
  args: {
    buttonText: "Get early access",
    microcopy: "Beta invites roll out weekly.",
    inputPlaceholder: "Your email address",
    buttonVariant: "outline",
    buttonSize: "lg",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// Custom placeholders
export const CustomPlaceholder: Story = {
  args: {
    buttonText: "Join waitlist",
    microcopy: "We'll notify you when Scry is ready",
    inputPlaceholder: "Enter your email to join waitlist",
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
    inputPlaceholder: "Email address",
    buttonVariant: "cta",
    buttonSize: "lg",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [withBackground],
}

// Secondary button style
export const SecondaryButton: Story = {
  args: {
    buttonText: "Join beta",
    microcopy: "See how Scry works",
    inputPlaceholder: "Enter your email",
    buttonVariant: "secondary",
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
    inputPlaceholder: "Your email address",
    buttonVariant: "gradient",
    buttonSize: "lg",
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
    inputPlaceholder: "Your email address",
    buttonVariant: "cta",
    buttonSize: "lg",
    centered: true,
  },
  decorators: [withBackground],
}

// Alternative color scheme
export const AlternativeColorScheme: Story = {
  args: {
    buttonText: "Subscribe",
    microcopy: "Stay updated on our progress",
    inputPlaceholder: "Your email address",
    buttonVariant: "secondary",
    buttonSize: "lg",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [(Story) => (
    <NoiseBackground baseColor="#1a1a1a" className="p-12">
      <Story />
    </NoiseBackground>
  )],
}

// Mobile stacked view (small container)
export const MobileStacked: Story = {
  args: {
    buttonText: "Get early access",
    microcopy: "Beta invites roll out weekly.",
    inputPlaceholder: "Your email address",
    buttonVariant: "gradient",
    buttonSize: "lg",
    centered: true,
    microcopyColor: "text-chalk",
  },
  decorators: [(Story) => (
    <NoiseBackground baseColor="var(--color-ink)" className="p-6" style={{ maxWidth: "375px" }}>
      <Story />
    </NoiseBackground>
  )],
}