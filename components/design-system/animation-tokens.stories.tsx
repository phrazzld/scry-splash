import type { Meta, StoryObj } from "@storybook/react"
import { AnimationTokens } from "./animation-tokens"

const meta: Meta<typeof AnimationTokens> = {
  title: "Design System/AnimationTokens",
  component: AnimationTokens,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof AnimationTokens>

export const Default: Story = {}
