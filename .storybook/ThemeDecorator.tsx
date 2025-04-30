import React, { useEffect } from 'react';
import type { Decorator } from '@storybook/react';

/**
 * Theme decorator that wraps stories in the appropriate theme context
 */
export const ThemeDecorator: Decorator = (Story, context) => {
  const { globals } = context;
  
  // Apply the theme class to the html element to mimic Next.js behavior
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Set the theme class based on the global theme
    if (globals.theme === 'dark' || globals.theme === undefined) {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
      document.body.style.backgroundColor = '#121212'; // --color-ink
      document.body.style.color = '#FAFAFA'; // --color-chalk
    } else {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FAFAFA'; // --color-chalk
      document.body.style.color = '#121212'; // --color-ink
    }
  }, [globals.theme]);
  
  return <Story />;
};