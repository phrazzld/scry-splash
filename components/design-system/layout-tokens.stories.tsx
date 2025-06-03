import type { Meta, StoryObj } from "@storybook/react";
import { LayoutTokens } from "./layout-tokens";

const meta: Meta<typeof LayoutTokens> = {
  title: "Design System/LayoutTokens",
  component: LayoutTokens,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LayoutTokens>;

export const Default: Story = {};
