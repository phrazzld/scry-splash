import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          Button component for Scry application, following shadcn/ui patterns.
          Supports multiple variants, sizes, and interaction states.
          All buttons have proper focus states with high contrast outlines.
        `
      }
    },
    a11y: {
      // Accessibility checks
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'cta', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style variant of the button',
      table: {
        defaultValue: { summary: 'default' }
      }
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'md', 'lg', 'xl', 'icon'],
      description: 'The size of the button',
      table: {
        defaultValue: { summary: 'default' }
      }
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
    children: {
      control: 'text',
      description: 'The content of the button',
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
 * CTA button variant with active state scaling effect.
 * This is the most prominent button, used for primary calls to action.
 */
export const CTA: Story = {
  args: {
    children: 'Join the waitlist',
    variant: 'cta',
    size: 'xl',
    'aria-label': 'Join the waitlist for Scry',
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
      <div>
        <h3 className="text-lg font-medium mb-4">Button Variants</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button variant="default">Default</Button>
          <Button variant="cta">CTA</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Button Sizes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon">🔍</Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * Shows CTA button in context matching the design from the homepage.
 */
export const CTAExample: Story = {
  render: () => (
    <div className="flex flex-col items-center p-8 bg-ink rounded-lg max-w-lg">
      <h2 className="text-heading font-regular text-chalk text-center mb-4">
        Remember effortlessly.
      </h2>
      <p className="mb-8 text-body font-regular text-chalk text-center opacity-80">
        Turns your notes into spaced‑repetition prompts—automatically.
      </p>
      <Button 
        variant="cta"
        size="xl"
        aria-label="Join the wait-list for Scry to turn your notes into spaced-repetition prompts"
      >
        Join the wait‑list
      </Button>
      <p className="mt-4 text-body font-regular text-chalk opacity-70 text-center">
        Beta invites roll out weekly.
      </p>
    </div>
  ),
};

/**
 * Demonstrates button interaction states.
 */
export const InteractionStates: Story = {
  args: { children: 'Placeholder' }, // Required by type but not used in render function
  render: () => (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-medium mb-4">Default Button States</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <Button variant="default">Default</Button>
            <span className="text-sm mt-2">Normal</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="default" className="hover">Hover State</Button>
            <span className="text-sm mt-2">Hover</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="default" className="focus-visible">Focus State</Button>
            <span className="text-sm mt-2">Focus</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="default" disabled>Disabled</Button>
            <span className="text-sm mt-2">Disabled</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">CTA Button States</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <Button variant="cta" size="xl">CTA Button</Button>
            <span className="text-sm mt-2">Normal</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="cta" size="xl" className="hover">Hover State</Button>
            <span className="text-sm mt-2">Hover</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="cta" size="xl" className="focus-visible">Focus State</Button>
            <span className="text-sm mt-2">Focus</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="cta" size="xl" className="active scale-[0.98]">Active State</Button>
            <span className="text-sm mt-2">Active</span>
          </div>
        </div>
      </div>
    </div>
  ),
};