import type { Preview } from '@storybook/react';
import '../app/globals.css';
import { ThemeDecorator } from './ThemeDecorator';

// Define viewports matching Tailwind breakpoints
const viewports = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  mobileLarge: {
    name: 'Mobile Large',
    styles: {
      width: '425px',
      height: '768px',
    },
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1024px',
      height: '768px',
    },
  },
  desktopLarge: {
    name: 'Desktop Large',
    styles: {
      width: '1280px',
      height: '800px',
    },
  },
  desktopXL: {
    name: 'Desktop XL',
    styles: {
      width: '1536px',
      height: '864px',
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports,
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#121212', // --color-ink
        },
        {
          name: 'light',
          value: '#FAFAFA', // --color-chalk
        },
      ],
    },
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark', icon: 'circle', title: 'Dark' },
          { value: 'light', icon: 'circlehollow', title: 'Light' },
        ],
        showName: true,
      },
    },
  },
  decorators: [ThemeDecorator],
};

export default preview;