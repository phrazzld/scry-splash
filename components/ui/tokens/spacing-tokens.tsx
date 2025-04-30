import React from 'react';

interface SpacingTokenProps {
  name: string;
  value: string;
  description?: string;
}

const SpacingToken: React.FC<SpacingTokenProps> = ({ 
  name, 
  value, 
  description 
}) => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-20 flex-shrink-0">
        <div 
          className="bg-cobalt h-6" 
          style={{ width: value, minWidth: '8px' }}
        ></div>
      </div>
      <div className="ml-6 flex-grow grid grid-cols-3 gap-2">
        <code className="font-medium">{name}</code>
        <code>{value}</code>
        <span className="text-sm text-neutral-400">{description}</span>
      </div>
    </div>
  );
};

export interface SpacingTokensProps {
  /**
   * Optional className to apply to the container
   */
  className?: string;
}

/**
 * Display of spacing tokens used in the Scry design system
 */
export const SpacingTokens: React.FC<SpacingTokensProps> = ({ 
  className = '' 
}) => {
  const spacingTokens = [
    { name: '1', value: '0.25rem', description: '4px' },
    { name: '2', value: '0.5rem', description: '8px - baseline grid unit' },
    { name: '3', value: '0.75rem', description: '12px' },
    { name: '4', value: '1rem', description: '16px' },
    { name: '6', value: '1.5rem', description: '24px' },
    { name: '8', value: '2rem', description: '32px' },
    { name: '10', value: '2.5rem', description: '40px' },
    { name: '12', value: '3rem', description: '48px' },
    { name: '16', value: '4rem', description: '64px' },
    { name: '20', value: '5rem', description: '80px' },
    { name: '24', value: '6rem', description: '96px' },
    { name: 'vertical-lg', value: '10rem', description: '160px (120pt) - large vertical spacing' },
  ];

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-medium mb-6">Spacing Scale</h3>
      <p className="mb-6 text-sm">Based on an 8pt grid system (0.5rem = 8px)</p>
      
      <div className="space-y-4">
        {spacingTokens.map((token) => (
          <SpacingToken
            key={token.name}
            name={token.name}
            value={token.value}
            description={token.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SpacingTokens;