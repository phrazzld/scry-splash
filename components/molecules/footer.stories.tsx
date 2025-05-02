import type { Meta, StoryObj } from "@storybook/react"
import { Footer } from "./footer"
import { NoiseBackground } from "@/components/ui/noise-background"

const meta: Meta<typeof Footer> = {
  title: "Molecules/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    projectText: {
      control: "text",
      description: "The project attribution text",
    },
    textColor: {
      control: "text",
      description: "Text color class for the attribution text",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the content",
    },
  },
}

export default meta
type Story = StoryObj<typeof Footer>

// Default footer with standard text
export const Default: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-chalk/40",
    centered: false,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[100px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}

// Centered footer
export const Centered: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-chalk/40",
    centered: true,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[100px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}

// Footer with custom text
export const CustomText: Story = {
  args: {
    projectText: "built with care by misty step",
    textColor: "text-chalk/40",
    centered: false,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-ink)" className="min-h-[100px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}

// Footer with alternate color scheme
export const AlternateColors: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-cobalt/60",
    centered: false,
  },
  decorators: [
    (Story) => (
      <NoiseBackground baseColor="var(--color-chalk)" className="min-h-[100px]">
        <Story />
      </NoiseBackground>
    ),
  ],
}