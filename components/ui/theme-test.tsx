import React from 'react';
import { useTheme } from './theme-provider';

interface ThemeTestProps {
  /**
   * Test text to display
   */
  text?: string;
}

/**
 * Simple component to test theme variables and styling
 * This component displays various theme elements and shows how they adapt between themes
 */
export const ThemeTest = ({
  text = 'Theme Test Component'
}: ThemeTestProps) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const activeTheme = theme === 'system' ? systemTheme : theme;
  
  return (
    <div className="p-6 flex flex-col gap-6 max-w-md border border-border rounded-lg bg-card">
      <div>
        <h1 className="text-heading font-bold text-foreground mb-2">
          {text}
        </h1>
        <p className="text-body font-regular text-foreground">
          This component tests theme variables across different themes.
          Current theme: <span className="font-medium">{activeTheme}</span>
        </p>
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={() => setTheme('light')}
          className={`px-3 py-1 rounded-md ${
            theme === 'light' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Light
        </button>
        <button 
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 rounded-md ${
            theme === 'dark' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          Dark
        </button>
        <button 
          onClick={() => setTheme('system')}
          className={`px-3 py-1 rounded-md ${
            theme === 'system' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          System
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-primary p-4 rounded-lg text-primary-foreground">
          Primary Color
        </div>
        <div className="bg-secondary p-4 rounded-lg text-secondary-foreground">
          Secondary Color
        </div>
        <div className="bg-muted p-4 rounded-lg text-muted-foreground">
          Muted Color
        </div>
        <div className="bg-accent p-4 rounded-lg text-accent-foreground">
          Accent Color
        </div>
        <div className="bg-destructive p-4 rounded-lg text-destructive-foreground">
          Destructive Color
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="border border-border p-4 rounded-lg">
          Border Color
        </div>
        <div className="border-2 border-primary p-4 rounded-lg">
          Primary Border
        </div>
        <input 
          type="text" 
          className="px-3 py-2 rounded-md border border-border bg-input text-foreground"
          placeholder="Input field with theme colors" 
        />
      </div>
    </div>
  );
};

export default ThemeTest;