import React from 'react';
import ColorTokens from './color-tokens';
import TypographyTokens from './typography-tokens';
import SpacingTokens from './spacing-tokens';

export interface DesignTokensProps {
  /**
   * Optional className to apply to the container
   */
  className?: string;
}

/**
 * Complete display of design tokens used in the Scry design system
 */
export const DesignTokens: React.FC<DesignTokensProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`space-y-12 p-6 ${className}`}>
      <section>
        <h2 className="text-2xl font-medium mb-6">Design Tokens</h2>
        <p className="mb-6">
          These design tokens form the foundation of the Scry design system and are mapped to shadcn/ui
          components to ensure consistent styling throughout the application.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-medium mb-6">Color System</h2>
        <ColorTokens />
      </section>

      <section className="pt-8">
        <h2 className="text-2xl font-medium mb-6">Typography System</h2>
        <TypographyTokens />
      </section>

      <section className="pt-8">
        <h2 className="text-2xl font-medium mb-6">Spacing System</h2>
        <SpacingTokens />
      </section>

      <section className="pt-8">
        <h2 className="text-2xl font-medium mb-6">shadcn/ui Mapping</h2>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Color Mapping</h3>
            <p className="mb-4 text-sm">How Scry design tokens map to shadcn/ui semantic tokens:</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Scry Token</th>
                  <th className="text-left py-2">shadcn/ui Semantic Token</th>
                  <th className="text-left py-2">Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">ink (#121212)</td>
                  <td className="py-2">--background</td>
                  <td className="py-2">Dark mode background</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">chalk (#FAFAFA)</td>
                  <td className="py-2">--foreground</td>
                  <td className="py-2">Dark mode text</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">cobalt (#0047AB)</td>
                  <td className="py-2">--primary</td>
                  <td className="py-2">Primary action color</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">cobalt-light (#0051c4)</td>
                  <td className="py-2">--primary-hover</td>
                  <td className="py-2">Hover state for primary buttons</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">focus-outline (#0060E6)</td>
                  <td className="py-2">--ring</td>
                  <td className="py-2">Focus rings and outlines</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Typography Mapping</h3>
            <p className="mb-4 text-sm">How Scry typography maps to shadcn/ui components:</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Scry Type Scale</th>
                  <th className="text-left py-2">shadcn/ui Component</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">display (5.33rem)</td>
                  <td className="py-2">Typography.h1</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">heading (2.67rem)</td>
                  <td className="py-2">Typography.h2</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">subheading (1.5rem)</td>
                  <td className="py-2">Typography.h3</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">body (1.17rem)</td>
                  <td className="py-2">Typography.p</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignTokens;