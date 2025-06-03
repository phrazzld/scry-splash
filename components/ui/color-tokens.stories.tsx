import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "./theme-provider";
import { Typography } from "./typography";

interface ColorToken {
  name: string;
  variable: string;
  category: "base" | "semantic" | "component";
  description?: string;
}

const ColorPalette = () => {
  const baseTokens: ColorToken[] = [
    {
      name: "Cobalt",
      variable: "--color-cobalt",
      category: "base",
      description: "Primary brand color",
    },
    {
      name: "Chalk",
      variable: "--color-chalk",
      category: "base",
      description: "Light neutral color",
    },
    {
      name: "Ink",
      variable: "--color-ink",
      category: "base",
      description: "Dark neutral color",
    },
    {
      name: "Purple",
      variable: "--color-purple",
      category: "base",
      description: "Accent color",
    },
  ];

  const semanticTokens: ColorToken[] = [
    {
      name: "Background",
      variable: "--background",
      category: "semantic",
      description: "Main page background",
    },
    {
      name: "Foreground",
      variable: "--foreground",
      category: "semantic",
      description: "Main text color",
    },
    {
      name: "Primary",
      variable: "--primary",
      category: "semantic",
      description: "Primary action color",
    },
    {
      name: "Primary Foreground",
      variable: "--primary-foreground",
      category: "semantic",
      description: "Text on primary background",
    },
    {
      name: "Secondary",
      variable: "--secondary",
      category: "semantic",
      description: "Secondary UI elements",
    },
    {
      name: "Secondary Foreground",
      variable: "--secondary-foreground",
      category: "semantic",
      description: "Text on secondary background",
    },
    {
      name: "Muted",
      variable: "--muted",
      category: "semantic",
      description: "Subtle background areas",
    },
    {
      name: "Muted Foreground",
      variable: "--muted-foreground",
      category: "semantic",
      description: "De-emphasized text",
    },
    {
      name: "Accent",
      variable: "--accent",
      category: "semantic",
      description: "Accent/highlight color",
    },
    {
      name: "Accent Foreground",
      variable: "--accent-foreground",
      category: "semantic",
      description: "Text on accent background",
    },
    {
      name: "Destructive",
      variable: "--destructive",
      category: "semantic",
      description: "Error/warning color",
    },
    {
      name: "Destructive Foreground",
      variable: "--destructive-foreground",
      category: "semantic",
      description: "Text on destructive background",
    },
  ];

  const componentTokens: ColorToken[] = [
    {
      name: "Border",
      variable: "--border",
      category: "component",
      description: "Border color for UI elements",
    },
    {
      name: "Input",
      variable: "--input",
      category: "component",
      description: "Input field background",
    },
    {
      name: "Ring",
      variable: "--ring",
      category: "component",
      description: "Focus ring color",
    },
    {
      name: "Card",
      variable: "--card",
      category: "component",
      description: "Card component background",
    },
    {
      name: "Card Foreground",
      variable: "--card-foreground",
      category: "component",
      description: "Card component text",
    },
    {
      name: "Popover",
      variable: "--popover",
      category: "component",
      description: "Popover/dropdown background",
    },
    {
      name: "Popover Foreground",
      variable: "--popover-foreground",
      category: "component",
      description: "Popover/dropdown text",
    },
  ];

  const ColorSwatch = ({ token }: { token: ColorToken }) => {
    return (
      <div className="mb-4">
        <div
          className="h-12 w-full rounded-md mb-2"
          style={{ backgroundColor: `var(${token.variable})` }}
        />
        <div className="space-y-1">
          <Typography variant="small" weight="bold" className="block">
            {token.name}
          </Typography>
          <Typography variant="small" className="block text-muted-foreground">
            <code>{token.variable}</code>
          </Typography>
          {token.description && (
            <Typography variant="small" className="block text-muted-foreground">
              {token.description}
            </Typography>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-background text-foreground">
      <div className="mb-8">
        <Typography variant="heading" className="mb-2">
          Theme Color Tokens
        </Typography>
        <Typography variant="body">
          This story demonstrates all color tokens in the current theme. Toggle
          between light and dark themes using the theme selector in the toolbar
          to see how colors adapt.
        </Typography>
      </div>

      <div className="mb-12">
        <Typography variant="subheading" className="mb-4">
          Base Color Tokens
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {baseTokens.map((token) => (
            <ColorSwatch key={token.variable} token={token} />
          ))}
        </div>
      </div>

      <div className="mb-12">
        <Typography variant="subheading" className="mb-4">
          Semantic Color Tokens
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {semanticTokens.map((token) => (
            <ColorSwatch key={token.variable} token={token} />
          ))}
        </div>
      </div>

      <div className="mb-12">
        <Typography variant="subheading" className="mb-4">
          Component Color Tokens
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {componentTokens.map((token) => (
            <ColorSwatch key={token.variable} token={token} />
          ))}
        </div>
      </div>

      <div className="p-6 border border-border rounded-lg bg-card text-card-foreground">
        <Typography variant="subheading" className="mb-2">
          Color Token Usage Examples
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div className="p-4 bg-background text-foreground border border-border rounded-md">
              <Typography variant="small" weight="medium">
                Background & Foreground
              </Typography>
            </div>

            <div className="p-4 bg-primary text-primary-foreground rounded-md">
              <Typography variant="small" weight="medium">
                Primary
              </Typography>
            </div>

            <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
              <Typography variant="small" weight="medium">
                Secondary
              </Typography>
            </div>

            <div className="p-4 bg-muted text-muted-foreground rounded-md">
              <Typography variant="small" weight="medium">
                Muted
              </Typography>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-accent text-accent-foreground rounded-md">
              <Typography variant="small" weight="medium">
                Accent
              </Typography>
            </div>

            <div className="p-4 bg-destructive text-destructive-foreground rounded-md">
              <Typography variant="small" weight="medium">
                Destructive
              </Typography>
            </div>

            <div className="p-4 bg-popover text-popover-foreground rounded-md">
              <Typography variant="small" weight="medium">
                Popover
              </Typography>
            </div>

            <div className="p-4 bg-card text-card-foreground border-2 border-border rounded-md">
              <Typography variant="small" weight="medium">
                Card with Border
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "UI/ColorTokens",
  component: ColorPalette,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
          This story displays all color tokens used in the Scry theming system.
          It shows the relationship between base tokens, semantic tokens, and component tokens.
          Use the theme toggle in the toolbar to see colors in both light and dark themes.
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider
        defaultTheme="system"
        storageKey="storybook-theme"
        enableSystem
      >
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = {
  parameters: {
    chromatic: {
      theme: "dark",
    },
  },
};

export const LightTheme: Story = {
  parameters: {
    chromatic: {
      theme: "light",
    },
  },
};
