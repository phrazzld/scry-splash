import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ColorTokens } from "./color-tokens"

const meta: Meta<typeof ColorTokens> = {
  title: "Design System/ColorTokens",
  component: ColorTokens,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof ColorTokens>

export const Default: Story = {}
