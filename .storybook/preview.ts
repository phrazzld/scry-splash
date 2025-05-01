import type { Preview } from '@storybook/react';
import '../app/globals.css';
import { ThemeDecorator } from './ThemeDecorator';
import { ChromaticDecorator } from './chromatic-decorator';

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
    // Chromatic parameters for visual testing
    chromatic: {
      // Disable animations to prevent flaky visual tests
      disableAnimations: true,
      // Capture snapshots at specific viewports
      viewports: [320, 768, 1024],
      // Default pauseAnimationAtEnd for consistent rendering
      pauseAnimationAtEnd: true,
    },
    // Global a11y configuration for all stories
    a11y: {
      // WCAG AA compliance level
      config: {
        rules: [
          {
            // High contrast requirement
            id: 'color-contrast',
            enabled: true
          }
        ]
      },
      // Options for the a11y addon
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'], // WCAG 2.1 AA compliance
        },
      },
      // Automatically check a11y for all stories
      manual: false,
    },
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
  decorators: [ChromaticDecorator, ThemeDecorator],
};

export default preview;