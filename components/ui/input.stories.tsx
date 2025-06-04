import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { NoiseBackground } from "@/components/ui/noise-background";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "text",
      description: "Type of input (text, email, password, etc.)",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    className: {
      control: "text",
      description: "Optional class name for styling override",
    },
    containerClassName: {
      control: "text",
      description: "Input container class name",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Helper for consistent decoration
const withBackground = (Story: React.ComponentType) => (
  <NoiseBackground baseColor="var(--color-ink)" className="p-12">
    <div className="max-w-md">
      <Story />
    </div>
  </NoiseBackground>
);

// Default
export const Default: Story = {
  args: {
    placeholder: "Input field",
  },
  decorators: [withBackground],
};

// Email input
export const EmailInput: Story = {
  args: {
    type: "email",
    placeholder: "Your email address",
  },
  decorators: [withBackground],
};

// Password input
export const PasswordInput: Story = {
  args: {
    type: "password",
    placeholder: "Enter password",
  },
  decorators: [withBackground],
};

// Disabled input
export const DisabledInput: Story = {
  args: {
    placeholder: "This input is disabled",
    disabled: true,
  },
  decorators: [withBackground],
};

// With value
export const WithValue: Story = {
  args: {
    placeholder: "Your email address",
    value: "user@example.com",
  },
  decorators: [withBackground],
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    placeholder: "Custom styled input",
    className: "border-purple-500 bg-purple-900/20",
  },
  decorators: [withBackground],
};
