import type { Meta, StoryObj } from "@storybook/react"
import { PitchSection } from "./pitch-section"

const meta: Meta<typeof PitchSection> = {
  title: "Molecules/PitchSection",
  component: PitchSection,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    centered: {
      control: "boolean",
      description: "Whether to center the content",
      defaultValue: false,
    },
    textColor: {
      control: "text",
      description: "Text color class for pitch content",
      defaultValue: "text-foreground",
    },
    className: {
      control: "text",
      description: "Additional class names",
    },
  },
}

export default meta
type Story = StoryObj<typeof PitchSection>

export const Default: Story = {
  args: {},
}

export const Centered: Story = {
  args: {
    centered: true,
  },
}

export const CustomTextColor: Story = {
  args: {
    textColor: "text-blue-500",
  },
}

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  args: {},
}