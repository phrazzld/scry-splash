import type { Meta, StoryObj } from "@storybook/react";
import { TokensOverview } from "./tokens-overview";

const meta: Meta<typeof TokensOverview> = {
  title: "Design System/TokensOverview",
  component: TokensOverview,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TokensOverview>;

export const Default: Story = {};
