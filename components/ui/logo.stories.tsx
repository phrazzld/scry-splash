import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './logo';

const meta = {
  title: 'UI/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          The Scry Logo component represents the brand identity. 
          It's implemented as text with a period that has reduced opacity.
          Available in multiple sizes and supports semantic HTML elements.
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
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['default', 'small', 'medium', 'large'],
      description: 'The size variant of the logo',
      table: {
        defaultValue: { summary: 'default' }
      }
    },
    color: {
      control: { type: 'select' },
      options: ['chalk', 'ink', 'cobalt'],
      description: 'The color of the logo',
      table: {
        defaultValue: { summary: 'chalk' }
      }
    },
    as: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'div', 'span'],
      description: 'The HTML element to render the logo with',
      table: {
        defaultValue: { summary: 'h1' }
      }
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for the logo',
      table: {
        defaultValue: { summary: 'Scry' }
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Logo variants
export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

// Color variants
export const CobaltLogo: Story = {
  args: {
    color: 'cobalt',
  },
};

export const InkLogo: Story = {
  args: {
    color: 'ink',
    className: 'bg-chalk p-4 rounded-md' // Add background for visibility
  },
};

// HTML Element variants
export const AsDiv: Story = {
  args: {
    as: 'div',
  },
};

export const WithCustomAriaLabel: Story = {
  args: {
    "aria-label": "Scry Brand Logo",
  },
};

// All sizes showcase
export const AllSizes: Story = {
  args: { children: 'Placeholder' }, // Required by type but not used in render function
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm mb-2">Small:</h3>
        <Logo size="small" />
      </div>
      <div>
        <h3 className="text-sm mb-2">Medium:</h3>
        <Logo size="medium" />
      </div>
      <div>
        <h3 className="text-sm mb-2">Default:</h3>
        <Logo />
      </div>
      <div>
        <h3 className="text-sm mb-2">Large:</h3>
        <Logo size="large" />
      </div>
    </div>
  ),
};

// Logo in context (header example)
export const LogoInContext: Story = {
  args: { children: 'Placeholder' }, // Required by type but not used in render function
  render: () => (
    <div className="p-6 border rounded-lg max-w-4xl">
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <Logo size="medium" as="div" />
        
        <nav className="flex gap-4">
          <a href="#" className="text-cobalt">Features</a>
          <a href="#" className="text-cobalt">Pricing</a>
          <a href="#" className="text-cobalt">About</a>
        </nav>
      </header>
      
      <div className="prose">
        <h2>Welcome to Scry</h2>
        <p>Turns your notes into spaced-repetition prompts—automatically.</p>
      </div>
    </div>
  ),
};