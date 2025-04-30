import React from 'react';

interface TypographyTokenProps {
  name: string;
  size: string;
  lineHeight: string;
  weight: string;
  children: React.ReactNode;
}

const TypographyToken: React.FC<TypographyTokenProps> = ({ 
  name, 
  size, 
  lineHeight, 
  weight, 
  children 
}) => {
  return (
    <div className="mb-8">
      <div style={{ 
        fontSize: size, 
        lineHeight: lineHeight, 
        fontWeight: weight 
      }}>
        {children}
      </div>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span>Name:</span>
          <code>{name}</code>
        </div>
        <div className="flex justify-between">
          <span>Size:</span>
          <code>{size}</code>
        </div>
        <div className="flex justify-between">
          <span>Line Height:</span>
          <code>{lineHeight}</code>
        </div>
        <div className="flex justify-between">
          <span>Weight:</span>
          <code>{weight}</code>
        </div>
      </div>
    </div>
  );
};

export interface TypographyTokensProps {
  /**
   * Optional className to apply to the container
   */
  className?: string;
}

/**
 * Display of typography tokens used in the Scry design system
 */
export const TypographyTokens: React.FC<TypographyTokensProps> = ({ 
  className = '' 
}) => {
  const typographyTokens = [
    { 
      name: 'display', 
      size: '5.33rem', 
      lineHeight: '1.1', 
      weight: '700',
      text: 'Display Text'
    },
    { 
      name: 'heading', 
      size: '2.67rem', 
      lineHeight: '1.2', 
      weight: '400',
      text: 'Heading Text'
    },
    { 
      name: 'subheading', 
      size: '1.5rem', 
      lineHeight: '1.3', 
      weight: '500',
      text: 'Subheading Text'
    },
    { 
      name: 'body', 
      size: '1.17rem', 
      lineHeight: '1.5', 
      weight: '400',
      text: 'Body text which is used for regular paragraphs and general content throughout the application.'
    },
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      <h3 className="text-lg font-medium mb-4">Typography Scale</h3>
      
      {typographyTokens.map((token) => (
        <TypographyToken
          key={token.name}
          name={token.name}
          size={token.size}
          lineHeight={token.lineHeight}
          weight={token.weight}
        >
          {token.text}
        </TypographyToken>
      ))}
      
      <section className="mt-8">
        <h3 className="text-lg font-medium mb-4">Font Weights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-md">
            <div className="text-xl font-regular mb-2">Regular (400)</div>
            <code className="text-sm">font-regular</code>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-xl font-medium mb-2">Medium (500)</div>
            <code className="text-sm">font-medium</code>
          </div>
          <div className="p-4 border rounded-md">
            <div className="text-xl font-bold mb-2">Bold (700)</div>
            <code className="text-sm">font-bold</code>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TypographyTokens;