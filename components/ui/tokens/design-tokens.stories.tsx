import type { Meta, StoryObj } from '@storybook/react';
import { DesignTokens } from './design-tokens';

const meta = {
  title: 'Design System/Tokens',
  component: DesignTokens,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DesignTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * This story showcases all design tokens used in the Scry design system and their
 * mappings to shadcn/ui semantic tokens. It serves as both documentation and a design
 * reference.
 */
export const AllTokens: Story = {
  args: {},
};

/**
 * Dark mode version of the design tokens (default for Scry)
 */
export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' }
  }
};

/**
 * Light mode version of the design tokens (for testing)
 */
export const LightMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'light' }
  }
};