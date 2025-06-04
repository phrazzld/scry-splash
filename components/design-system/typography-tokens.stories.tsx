import type { Meta, StoryObj } from "@storybook/react";
import { TypographyTokens } from "./typography-tokens";

const meta: Meta<typeof TypographyTokens> = {
  title: "Design System/TypographyTokens",
  component: TypographyTokens,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TypographyTokens>;

export const Default: Story = {};
