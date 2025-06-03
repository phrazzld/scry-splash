import type { Meta, StoryObj } from "@storybook/react";
import { ShadcnIntegration } from "./shadcn-integration";

const meta: Meta<typeof ShadcnIntegration> = {
  title: "Design System/ShadcnIntegration",
  component: ShadcnIntegration,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ShadcnIntegration>;

export const Default: Story = {};
