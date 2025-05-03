import type { Meta, StoryObj } from '@storybook/react';
import { ThemeTest } from './theme-test';
import { ThemeProvider } from './theme-provider';

const meta = {
  title: 'UI/ThemeTest',
  component: ThemeTest,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          Theme Test component demonstrates how components look in both dark and light themes.
          Use the theme toggle in the toolbar to switch between themes.
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="system" storageKey="storybook-theme" enableSystem>
        <div className="p-6 bg-background rounded-lg">
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
} satisfies Meta<typeof ThemeTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Theme Test Component',
  },
};

export const CustomText: Story = {
  args: {
    text: 'Custom Theme Test',
  },
};

// For visual regression testing with specific themes
export const DarkTheme: Story = {
  args: {
    text: 'Dark Theme Component',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    chromatic: { theme: 'dark' }
  }
};

export const LightTheme: Story = {
  args: {
    text: 'Light Theme Component',
  },
  parameters: {
    backgrounds: { default: 'light' },
    chromatic: { theme: 'light' }
  }
};