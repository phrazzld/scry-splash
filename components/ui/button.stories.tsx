import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { ThemeProvider } from "./theme-provider";
import { Typography } from "./typography";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
          Button component for Scry application, following shadcn/ui patterns.
          Supports multiple variants, sizes, and interaction states.
          All buttons have proper focus states with high contrast outlines.
          
          This component is theme-aware and adapts to both light and dark themes.
        `,
      },
    },
    a11y: {
      // Accessibility checks
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "cta",
        "gradient",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      description: "The visual style variant of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["default", "sm", "md", "lg", "xl", "icon"],
      description: "The size of the button",
      table: {
        defaultValue: { summary: "default" },
      },
    },
    "aria-label": {
      control: "text",
      description: "Accessibility label for the button",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
    children: {
      control: "text",
      description: "The content of the button",
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="system"
        storageKey="storybook-theme"
        enableSystem
      >
        <div className="p-6 bg-background text-foreground rounded-lg">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary button using the Cobalt Blue color.
 */
export const Primary: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

/**
 * CTA button variant with active state scaling effect.
 * This is the most prominent button, used for primary calls to action.
 */
export const CTA: Story = {
  args: {
    children: "Get early access",
    variant: "gradient",
    size: "default",
    "aria-label": "Get early access to Scry",
    className: "whitespace-nowrap h-12 text-base font-bold px-10 py-3",
  },
};

/**
 * Secondary button with a darker gray background.
 */
export const Secondary: Story = {
  args: {
    children: "Button",
    variant: "secondary",
  },
};

/**
 * Outline button with a border and transparent background.
 */
export const Outline: Story = {
  args: {
    children: "Button",
    variant: "outline",
  },
};

/**
 * Destructive button for dangerous actions.
 */
export const Destructive: Story = {
  args: {
    children: "Button",
    variant: "destructive",
  },
};

/**
 * Ghost button with no background until hovered.
 */
export const Ghost: Story = {
  args: {
    children: "Button",
    variant: "ghost",
  },
};

/**
 * Link button appears as a text link.
 */
export const Link: Story = {
  args: {
    children: "Button",
    variant: "link",
  },
};

/**
 * Large button with larger text and padding.
 */
export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

/**
 * Small button with less padding.
 */
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

/**
 * A button grid showing all variants and sizes.
 */
export const ButtonGrid: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <Typography variant="subheading" className="mb-4">
          Button Variants
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button variant="default">Default</Button>
          <Button variant="cta">CTA</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      <div>
        <Typography variant="subheading" className="mb-4">
          Button Sizes
        </Typography>
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
    <div className="flex flex-col items-center p-8 bg-primary/5 border border-border rounded-lg max-w-lg">
      <Typography variant="heading" className="text-center mb-4">
        Remember effortlessly.
      </Typography>
      <Typography variant="body" className="mb-8 text-center opacity-80">
        Turns your notes into spaced‑repetition prompts—automatically.
      </Typography>
      <Button
        variant="gradient"
        size="default"
        className="whitespace-nowrap h-12 text-base font-bold px-10 py-3"
        aria-label="Get early access to Scry to turn your notes into spaced-repetition prompts"
      >
        Get early access
      </Button>
      <Typography variant="small" className="mt-4 opacity-70 text-center">
        Beta invites roll out weekly.
      </Typography>
    </div>
  ),
};

/**
 * Demonstrates button interaction states.
 */
export const InteractionStates: Story = {
  args: { children: "Placeholder" }, // Required by type but not used in render function
  render: () => (
    <div className="space-y-10">
      <div>
        <Typography variant="subheading" className="mb-4">
          Default Button States
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <Button variant="default">Default</Button>
            <Typography variant="small" className="mt-2">
              Normal
            </Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="default" className="hover">
              Hover State
            </Button>
            <Typography variant="small" className="mt-2">
              Hover
            </Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="default" className="focus-visible">
              Focus State
            </Button>
            <Typography variant="small" className="mt-2">
              Focus
            </Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button variant="default" disabled>
              Disabled
            </Button>
            <Typography variant="small" className="mt-2">
              Disabled
            </Typography>
          </div>
        </div>
      </div>

      <div>
        <Typography variant="subheading" className="mb-4">
          CTA Button States
        </Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="gradient"
              size="default"
              className="whitespace-nowrap h-12 text-base font-bold px-10 py-3"
            >
              CTA Button
            </Button>
            <Typography variant="small" className="mt-2">
              Normal
            </Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="gradient"
              size="default"
              className="whitespace-nowrap h-12 text-base font-bold px-10 py-3 hover"
            >
              Hover State
            </Button>
            <Typography variant="small" className="mt-2">
              Hover
            </Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="gradient"
              size="default"
              className="whitespace-nowrap h-12 text-base font-bold px-10 py-3 focus-visible"
            >
              Focus State
            </Button>
            <Typography variant="small" className="mt-2">
              Focus
            </Typography>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="gradient"
              size="default"
              className="whitespace-nowrap h-12 text-base font-bold px-10 py-3 active scale-[0.98]"
            >
              Active State
            </Button>
            <Typography variant="small" className="mt-2">
              Active
            </Typography>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Theme comparison demonstrating how buttons adapt to light and dark themes
 */
export const ThemeComparison: Story = {
  args: { children: "Placeholder" }, // Required by type but not used in render function
  render: () => (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-3">
        <Typography variant="heading">Button Theme Adaptation</Typography>
        <Typography variant="body">
          This example demonstrates how buttons adapt to theme changes. Toggle
          between dark and light themes in the toolbar to see the difference.
        </Typography>
      </div>

      <div className="p-6 border border-border rounded-lg bg-card text-card-foreground">
        <Typography variant="subheading" className="mb-4">
          Default Backgrounds
        </Typography>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Button variant="default">Default</Button>
            <Typography variant="small" className="block text-center">
              Primary
            </Typography>
          </div>
          <div className="space-y-2">
            <Button variant="secondary">Secondary</Button>
            <Typography variant="small" className="block text-center">
              Secondary
            </Typography>
          </div>
          <div className="space-y-2">
            <Button variant="outline">Outline</Button>
            <Typography variant="small" className="block text-center">
              Outline
            </Typography>
          </div>
          <div className="space-y-2">
            <Button variant="ghost">Ghost</Button>
            <Typography variant="small" className="block text-center">
              Ghost
            </Typography>
          </div>
        </div>
      </div>

      <div className="p-6 border border-border rounded-lg bg-muted text-muted-foreground">
        <Typography variant="subheading" className="mb-4 text-foreground">
          On Muted Background
        </Typography>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Button variant="default">Default</Button>
            <Typography
              variant="small"
              className="block text-center text-foreground"
            >
              Primary
            </Typography>
          </div>
          <div className="space-y-2">
            <Button variant="secondary">Secondary</Button>
            <Typography
              variant="small"
              className="block text-center text-foreground"
            >
              Secondary
            </Typography>
          </div>
          <div className="space-y-2">
            <Button variant="outline">Outline</Button>
            <Typography
              variant="small"
              className="block text-center text-foreground"
            >
              Outline
            </Typography>
          </div>
          <div className="space-y-2">
            <Button variant="ghost">Ghost</Button>
            <Typography
              variant="small"
              className="block text-center text-foreground"
            >
              Ghost
            </Typography>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    chromatic: {
      // Removed modes to fix Chromatic error - viewports and modes cannot be used together
      // Theme comparison is handled by the global theme toolbar instead
    },
  },
};
