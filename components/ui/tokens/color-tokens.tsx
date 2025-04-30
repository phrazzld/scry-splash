import React from 'react';

interface ColorTokenProps {
  name: string;
  value: string;
  textColor?: string;
}

const ColorToken: React.FC<ColorTokenProps> = ({ name, value, textColor = '#FAFAFA' }) => {
  return (
    <div className="flex flex-col mb-4">
      <div 
        className="w-full h-16 rounded-md mb-2 flex items-center justify-center"
        style={{ backgroundColor: value, color: textColor }}
      >
        {name}
      </div>
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <code>{value}</code>
      </div>
    </div>
  );
};

export interface ColorTokensProps {
  /**
   * Optional className to apply to the container
   */
  className?: string;
}

/**
 * Display of color tokens used in the Scry design system
 */
export const ColorTokens: React.FC<ColorTokensProps> = ({ className = '' }) => {
  // Primary brand colors
  const brandColors = [
    { name: 'ink', value: '#121212', textColor: '#FAFAFA' },
    { name: 'chalk', value: '#FAFAFA', textColor: '#121212' },
    { name: 'cobalt', value: '#0047AB', textColor: '#FAFAFA' },
  ];

  // Accent and utility colors
  const accentColors = [
    { name: 'cobalt-light', value: '#0051c4', textColor: '#FAFAFA' },
    { name: 'focus-outline', value: '#0060E6', textColor: '#FAFAFA' },
    { name: 'purple', value: '#b494e9', textColor: '#121212' },
  ];

  return (
    <div className={`grid gap-8 ${className}`}>
      <section>
        <h3 className="text-lg font-medium mb-4">Brand Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brandColors.map((color) => (
            <ColorToken 
              key={color.name} 
              name={color.name} 
              value={color.value} 
              textColor={color.textColor} 
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium mb-4">Accent Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accentColors.map((color) => (
            <ColorToken 
              key={color.name} 
              name={color.name} 
              value={color.value} 
              textColor={color.textColor} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ColorTokens;