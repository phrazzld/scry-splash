import type { Meta, StoryObj } from "@storybook/react";
import { SpacingTokens } from "./spacing-tokens";

const meta: Meta<typeof SpacingTokens> = {
  title: "Design System/SpacingTokens",
  component: SpacingTokens,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SpacingTokens>;

export const Default: Story = {};
