import React, { useEffect } from 'react';
import type { Decorator } from '@storybook/react';

/**
 * Chromatic decorator for visual regression testing
 * This decorator disables animations and transitions for more consistent snapshots
 */
export const ChromaticDecorator: Decorator = (Story, context) => {
  // Disable animations when running in Chromatic
  useEffect(() => {
    // Only apply when running in Chromatic environment
    if (context.parameters.chromatic || process.env.CHROMATIC) {
      // Add a style tag to disable all animations and transitions
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0ms !important;
          transition-duration: 0ms !important;
          animation-delay: 0ms !important;
          transition-delay: 0ms !important;
          animation-iteration-count: 1 !important;
        }
      `;
      style.setAttribute('data-chromatic', 'true');
      document.head.appendChild(style);
      
      return () => {
        // Clean up on unmount
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    }
  }, [context.parameters.chromatic]);

  return <Story />;
};