import type { Meta, StoryObj } from "@storybook/react"
import { BenefitTrio } from "./benefit-trio"
import { NoiseBackground } from "@/components/ui/noise-background"

const meta: Meta<typeof BenefitTrio> = {
  title: "Molecules/BenefitTrio",
  component: BenefitTrio,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    benefits: {
      control: "array",
      description: "Array of benefit points to display",
    },
    separator: {
      control: "text",
      description: "Separator character between benefit points",
    },
    layout: {
      control: "select",
      options: ["horizontal", "vertical", "responsive"],
      description: "Layout direction for the benefit points",
    },
    variant: {
      control: "select",
      options: ["subheading", "body", "heading"],
      description: "Typography variant to use",
    },
    textColor: {
      control: "text",
      description: "Text color class",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the content",
    },
    weight: {
      control: "select",
      options: ["regular", "medium", "bold"],
      description: "Font weight",
    },
  },
}

export default meta
type Story = StoryObj<typeof BenefitTrio>

// Helper for consistent decoration
const withBackground = (Story: any) => (
  <NoiseBackground baseColor="var(--color-ink)" className="p-12">
    <Story />
  </NoiseBackground>
)

// Default (horizontal layout with default benefits)
export const Default: Story = {
  args: {
    benefits: ["Capture anything", "Review in moments", "Master for life"],
    separator: "·",
    layout: "horizontal",
    variant: "subheading",
    textColor: "text-chalk",
    centered: true,
    weight: "medium",
  },
  decorators: [withBackground],
}

// Vertical layout
export const VerticalLayout: Story = {
  args: {
    benefits: ["Capture anything", "Review in moments", "Master for life"],
    separator: "→",
    layout: "vertical",
    variant: "subheading",
    textColor: "text-chalk",
    centered: true,
    weight: "medium",
  },
  decorators: [withBackground],
}

// Responsive layout (horizontal on desktop, vertical on mobile)
export const ResponsiveLayout: Story = {
  args: {
    benefits: ["Capture anything", "Review in moments", "Master for life"],
    separator: "·",
    layout: "responsive",
    variant: "subheading",
    textColor: "text-chalk",
    centered: true,
    weight: "medium",
  },
  decorators: [withBackground],
}

// Different typography variant (body text)
export const BodyVariant: Story = {
  args: {
    benefits: ["Capture anything", "Review in moments", "Master for life"],
    separator: "·",
    layout: "horizontal",
    variant: "body",
    textColor: "text-chalk",
    centered: true,
    weight: "regular",
  },
  decorators: [withBackground],
}

// Custom benefits
export const CustomBenefits: Story = {
  args: {
    benefits: ["Effortless learning", "Spaced repetition", "Knowledge mastery"],
    separator: "•",
    layout: "horizontal",
    variant: "subheading",
    textColor: "text-chalk",
    centered: true,
    weight: "medium",
  },
  decorators: [withBackground],
}

// Left-aligned
export const LeftAligned: Story = {
  args: {
    benefits: ["Capture anything", "Review in moments", "Master for life"],
    separator: "·",
    layout: "horizontal",
    variant: "subheading",
    textColor: "text-chalk",
    centered: false,
    weight: "medium",
  },
  decorators: [withBackground],
}

// Alternative color scheme
export const AlternativeColors: Story = {
  args: {
    benefits: ["Capture anything", "Review in moments", "Master for life"],
    separator: "·",
    layout: "horizontal",
    variant: "subheading",
    textColor: "text-cobalt",
    centered: true,
    weight: "bold",
  },
  decorators: [(Story) => (
    <NoiseBackground baseColor="var(--color-chalk)" className="p-12">
      <Story />
    </NoiseBackground>
  )],
}