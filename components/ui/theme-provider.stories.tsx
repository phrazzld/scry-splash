import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme } from './theme-provider';
import { Button } from './button';
import { Typography } from './typography';

const ThemeDemo = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  
  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto bg-background text-foreground">
      <div className="flex flex-col gap-2">
        <Typography variant="heading">Theme Provider Demo</Typography>
        <Typography variant="body">
          This demonstrates the ThemeProvider functionality with real-time theme switching.
        </Typography>
      </div>
      
      <div className="p-4 rounded-lg border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Typography variant="subheading">Current Theme State</Typography>
            <div className="space-y-1">
              <Typography variant="body">Selected Theme: <span className="font-medium">{theme}</span></Typography>
              <Typography variant="body">System Theme: <span className="font-medium">{systemTheme}</span></Typography>
              <Typography variant="body">Active Theme: <span className="font-medium">{theme === 'system' ? systemTheme : theme}</span></Typography>
            </div>
          </div>
          
          <div className="space-y-2">
            <Typography variant="subheading">Theme Controls</Typography>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
              <Button 
                variant={theme === 'system' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTheme('system')}
              >
                System
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-card text-card-foreground rounded-lg border border-border">
          <Typography variant="subheading">Card Component</Typography>
          <Typography variant="body" className="mt-2">
            This card uses theme-aware variables like <code>bg-card</code> and <code>text-card-foreground</code>.
          </Typography>
        </div>
        
        <div className="p-4 bg-muted text-muted-foreground rounded-lg">
          <Typography variant="subheading">Muted Section</Typography>
          <Typography variant="body" className="mt-2">
            This section uses theme-aware variables like <code>bg-muted</code> and <code>text-muted-foreground</code>.
          </Typography>
        </div>
      </div>
      
      <div className="space-y-3">
        <Typography variant="subheading">Button Variants</Typography>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <Typography variant="subheading">Other UI Elements</Typography>
        <div className="space-y-3">
          <div className="p-3 border border-border rounded-md">
            <Typography variant="small">Border Element</Typography>
          </div>
          <div className="flex gap-2 items-center">
            <input 
              type="text" 
              className="px-3 py-2 rounded-md bg-input text-foreground border border-border"
              placeholder="Input field" 
            />
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'UI/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          ThemeProvider is the foundation of the Scry theming system.
          It manages theme state, reacts to system preference changes, and persists user preference in localStorage.
          This story demonstrates the ThemeProvider with interactive controls for switching themes.
        `
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="system" storageKey="storybook-theme" enableSystem>
        <Story />
      </ThemeProvider>
    )
  ]
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <ThemeDemo />,
    defaultTheme: "system",
    enableSystem: true
  },
  render: (args) => <ThemeProvider {...args} />
};

export const SystemThemeBased: Story = {
  args: {
    children: <ThemeDemo />,
    defaultTheme: "system",
    enableSystem: true
  },
  render: (args) => <ThemeProvider {...args} />,
  parameters: {
    chromatic: {
      modes: {
        dark: { theme: 'dark' },
        light: { theme: 'light' }
      }
    }
  }
};