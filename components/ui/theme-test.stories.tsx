import type { Meta, StoryObj } from '@storybook/react';
import { ThemeTest } from './theme-test';

const meta = {
  title: 'UI/ThemeTest',
  component: ThemeTest,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
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