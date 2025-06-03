import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./footer";
import { NoiseBackground } from "@/components/ui/noise-background";
import { ThemeProvider } from "@/components/ui/theme-provider";

const meta: Meta<typeof Footer> = {
  title: "Molecules/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    projectText: {
      control: "text",
      description: "The project attribution text",
    },
    textColor: {
      control: "text",
      description: "Text color class for the attribution text",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the content",
    },
    showThemeToggle: {
      control: "boolean",
      description: "Whether to show the theme toggle button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

// Default footer with standard text
export const Default: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-chalk/40",
    centered: false,
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <NoiseBackground baseColor="var(--color-ink)" className="min-h-[100px]">
          <Story />
        </NoiseBackground>
      </ThemeProvider>
    ),
  ],
};

// Centered footer
export const Centered: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-chalk/40",
    centered: true,
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <NoiseBackground baseColor="var(--color-ink)" className="min-h-[100px]">
          <Story />
        </NoiseBackground>
      </ThemeProvider>
    ),
  ],
};

// Footer with custom text
export const CustomText: Story = {
  args: {
    projectText: "built with care by misty step",
    textColor: "text-chalk/40",
    centered: false,
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <NoiseBackground baseColor="var(--color-ink)" className="min-h-[100px]">
          <Story />
        </NoiseBackground>
      </ThemeProvider>
    ),
  ],
};

// Footer with alternate color scheme
export const AlternateColors: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-cobalt/60",
    centered: false,
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="light"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <NoiseBackground
          baseColor="var(--color-chalk)"
          className="min-h-[100px]"
        >
          <Story />
        </NoiseBackground>
      </ThemeProvider>
    ),
  ],
};

// Set up for testing theme toggle interactions
export const ThemeToggleInteraction: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-foreground/40",
    centered: false,
    showThemeToggle: true,
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="system"
        storageKey="storybook-theme"
        enableSystem={true}
      >
        <div className="bg-background text-foreground min-h-[100px]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "This story demonstrates the theme toggle button in the footer with system preference detection. Try clicking the theme toggle button to switch between light and dark modes.",
      },
    },
  },
};

// Footer without theme toggle
export const WithoutThemeToggle: Story = {
  args: {
    projectText: "a misty step project",
    textColor: "text-foreground/40",
    centered: false,
    showThemeToggle: false,
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="dark"
        storageKey="storybook-theme"
        enableSystem={false}
      >
        <NoiseBackground baseColor="var(--color-ink)" className="min-h-[100px]">
          <Story />
        </NoiseBackground>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "This story shows the footer without the theme toggle button.",
      },
    },
  },
};
