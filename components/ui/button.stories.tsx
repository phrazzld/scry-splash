import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button using the Cobalt Blue color.
 */
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

/**
 * Secondary button with a darker gray background.
 */
export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
};

/**
 * Outline button with a border and transparent background.
 */
export const Outline: Story = {
  args: {
    children: 'Button',
    variant: 'outline',
  },
};

/**
 * Destructive button for dangerous actions.
 */
export const Destructive: Story = {
  args: {
    children: 'Button',
    variant: 'destructive',
  },
};

/**
 * Ghost button with no background until hovered.
 */
export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost',
  },
};

/**
 * Link button appears as a text link.
 */
export const Link: Story = {
  args: {
    children: 'Button',
    variant: 'link',
  },
};

/**
 * Large button with larger text and padding.
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

/**
 * Small button with less padding.
 */
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

/**
 * A button grid showing all variants and sizes.
 */
export const ButtonGrid: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  ),
};