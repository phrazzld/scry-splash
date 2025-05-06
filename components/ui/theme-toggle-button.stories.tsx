/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggleButton } from './theme-toggle-button';
import { ThemeProvider } from './theme-provider';

const meta = {
  title: 'UI/ThemeToggleButton',
  component: ThemeToggleButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A minimal, accessible button that allows users to toggle between light and dark modes.
          The button displays a sun icon in dark mode and a moon icon in light mode,
          indicating what the theme will change to when clicked.
          
          Uses the theme context from ThemeProvider via useTheme hook.
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
          },
          {
            id: 'button-name',
            enabled: true
          }
        ]
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
    'aria-label': {
      control: 'text',
      description: 'Accessibility label for the button',
    },
  },
  // ThemeProvider is necessary to supply the theme context
  decorators: [
    (Story) => (
      <div className="flex flex-col items-center gap-8">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ThemeToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The button showing the sun icon (for switching to light theme).
 * This is how the button appears in dark mode.
 */
export const InDarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="dark" storageKey="storybook-theme" enableSystem={false}>
        <div className="p-8 bg-background text-foreground rounded-lg flex justify-center items-center">
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

/**
 * The button showing the moon icon (for switching to dark theme).
 * This is how the button appears in light mode.
 */
export const InLightMode: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme" enableSystem={false}>
        <div className="p-8 bg-background text-foreground rounded-lg flex justify-center items-center">
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

/**
 * The button integrated into a header component.
 */
export const InHeader: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme" enableSystem={false}>
        <div className="w-full max-w-3xl p-4 bg-background border-b border-border flex justify-between items-center">
          <div className="text-xl font-bold">Scry</div>
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
};

/**
 * The button integrated into a footer component.
 */
export const InFooter: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="dark" storageKey="storybook-theme" enableSystem={false}>
        <div className="w-full max-w-3xl p-6 bg-background border-t border-border flex justify-between items-center">
          <div className="text-sm opacity-70">© 2025 Scry</div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Theme</span>
            <Story />
          </div>
        </div>
      </ThemeProvider>
    )
  ]
};

/**
 * Demonstrates button interaction states.
 */
export const InteractionStates: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="storybook-theme" enableSystem={false}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 bg-background text-foreground rounded-lg">
          <div className="flex flex-col items-center">
            <ThemeToggleButton />
            <span className="mt-2 text-sm">Normal</span>
          </div>
          <div className="flex flex-col items-center">
            <ThemeToggleButton className="hover:bg-accent" />
            <span className="mt-2 text-sm">Hover</span>
          </div>
          <div className="flex flex-col items-center">
            <ThemeToggleButton className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            <span className="mt-2 text-sm">Focus</span>
          </div>
          <div className="flex flex-col items-center">
            <ThemeToggleButton disabled />
            <span className="mt-2 text-sm">Disabled</span>
          </div>
        </div>
      </ThemeProvider>
    )
  ]
};

/**
 * Theme comparison demonstrating how the button adapts to light and dark themes
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
      <div className="p-6 border border-border rounded-lg bg-background flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">Light Theme</h3>
        <div className="flex justify-center rounded-md bg-background p-4">
          <ThemeProvider defaultTheme="light" storageKey="theme-example-1" enableSystem={false}>
            <ThemeToggleButton />
          </ThemeProvider>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Shows moon icon when in light mode
        </p>
      </div>
      
      <div className="p-6 border border-border rounded-lg bg-background flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">Dark Theme</h3>
        <div className="flex justify-center rounded-md bg-background p-4">
          <ThemeProvider defaultTheme="dark" storageKey="theme-example-2" enableSystem={false}>
            <ThemeToggleButton />
          </ThemeProvider>
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Shows sun icon when in dark mode
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    chromatic: {
      modes: {
        dark: { theme: 'dark' },
        light: { theme: 'light' }
      }
    }
  }
};