import type { Meta, StoryObj } from "@storybook/react";
import { NoiseBackground } from "./noise-background";

const meta: Meta<typeof NoiseBackground> = {
  title: "UI/NoiseBackground",
  component: NoiseBackground,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    baseColor: { control: "color" },
    noiseOpacity: {
      control: { type: "range", min: 0, max: 0.2, step: 0.01 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NoiseBackground>;

export const Default: Story = {
  args: {
    baseColor: "var(--color-ink)",
    noiseOpacity: 0.02,
    style: { width: "400px", height: "200px" },
  },
};

export const WithContent: Story = {
  args: {
    baseColor: "var(--color-ink)",
    noiseOpacity: 0.02,
    style: { width: "400px", height: "200px" },
    children: (
      <div className="flex items-center justify-center w-full h-full z-10">
        <p className="text-chalk text-center font-medium p-4 relative z-10">
          Content appears on top of the noise background
        </p>
      </div>
    ),
  },
};

export const LighterBackground: Story = {
  args: {
    baseColor: "var(--color-cobalt)",
    noiseOpacity: 0.05,
    style: { width: "400px", height: "200px" },
  },
};

export const HigherOpacity: Story = {
  args: {
    baseColor: "var(--color-ink)",
    noiseOpacity: 0.1,
    style: { width: "400px", height: "200px" },
  },
};

export const FullPage: Story = {
  args: {
    baseColor: "var(--color-ink)",
    noiseOpacity: 0.02,
    className: "w-full h-96",
    children: (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 relative z-10">
        <h2 className="text-chalk text-2xl font-bold mb-4">Page Example</h2>
        <p className="text-chalk text-center max-w-md">
          This demonstrates how the NoiseBackground can be used as a full-page
          background with content placed on top.
        </p>
      </div>
    ),
  },
};
