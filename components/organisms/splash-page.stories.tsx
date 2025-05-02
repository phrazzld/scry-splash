import type { Meta, StoryObj } from "@storybook/react"
import { SplashPage } from "./splash-page"

const meta: Meta<typeof SplashPage> = {
  title: "Organisms/SplashPage",
  component: SplashPage,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    headline: { control: "text" },
    subheadline: { control: "text" },
    benefits: { control: { type: "object" } },
    buttonText: { control: "text" },
    microcopy: { control: "text" },
    backgroundColor: { control: "color" },
    centered: { control: "boolean" },
    animate: { control: "boolean" },
    staggerDelay: { control: { type: "range", min: 0, max: 500, step: 50 } },
    benefitsLayout: { 
      control: "radio", 
      options: ["horizontal", "vertical", "responsive"] 
    },
    onCtaClick: { action: "CTA button clicked" },
  },
}

export default meta
type Story = StoryObj<typeof SplashPage>

/**
 * Default splash page with all default content and styling
 */
export const Default: Story = {
  args: {},
}

/**
 * Animation disabled for testing and static rendering
 */
export const NoAnimation: Story = {
  args: {
    animate: false,
  },
}

/**
 * Left-aligned version of the splash page
 */
export const LeftAligned: Story = {
  args: {
    centered: false,
  },
}

/**
 * Custom content example
 */
export const CustomContent: Story = {
  args: {
    headline: "Unlock Your Knowledge",
    subheadline: "Transform your notes into a powerful learning system with AI-powered spaced repetition",
    benefits: ["Save time", "Improve retention", "Learn smarter"],
    buttonText: "Get Early Access",
    microcopy: "Join thousands of beta users today",
  },
}

/**
 * Vertical benefits layout variant
 */
export const VerticalBenefits: Story = {
  args: {
    benefitsLayout: "vertical",
  },
}

/**
 * Responsive benefits layout
 */
export const ResponsiveBenefits: Story = {
  args: {
    benefitsLayout: "responsive",
  },
}

/**
 * Custom background color
 */
export const CustomBackground: Story = {
  args: {
    backgroundColor: "#1a1a2e",
  },
}

/**
 * Faster stagger animation
 */
export const FastAnimation: Story = {
  args: {
    staggerDelay: 50,
  },
}

/**
 * Slower stagger animation
 */
export const SlowAnimation: Story = {
  args: {
    staggerDelay: 200,
  },
}