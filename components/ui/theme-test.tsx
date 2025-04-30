import React from 'react';

interface ThemeTestProps {
  /**
   * Test text to display
   */
  text?: string;
}

/**
 * Simple component to test theme variables and styling
 */
export const ThemeTest = ({
  text = 'Theme Test Component'
}: ThemeTestProps) => {
  return (
    <div className="p-6 flex flex-col gap-4 max-w-md">
      <h1 className="text-display font-bold text-chalk">
        {text}
      </h1>
      <p className="text-body font-regular text-chalk">
        This component tests that theme variables are properly applied in Storybook.
      </p>
      <div className="bg-cobalt p-4 rounded-lg text-chalk">
        Background color: Cobalt Blue
      </div>
      <div className="border border-cobalt p-4 rounded-lg">
        Border color: Cobalt Blue
      </div>
    </div>
  );
};

export default ThemeTest;