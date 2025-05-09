import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { NoiseBackground } from '@/components/ui/noise-background';

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('NoiseBackground Component', () => {
  it('renders correctly with default props', () => {
    render(<NoiseBackground data-testid="noise-bg">Content</NoiseBackground>);
    
    const container = screen.getByTestId('noise-bg');
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Content');
    
    // Default background color should be set as an inline style
    expect(container).toHaveStyle({ backgroundColor: 'var(--background)' });
    
    // Noise overlay should exist and be aria-hidden
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom baseColor', () => {
    const customColor = '#123456';
    render(<NoiseBackground baseColor={customColor} data-testid="noise-bg">Content</NoiseBackground>);
    
    const container = screen.getByTestId('noise-bg');
    expect(container).toHaveStyle({ backgroundColor: customColor });
  });

  it('applies custom noiseOpacity', () => {
    const customOpacity = 0.5;
    render(<NoiseBackground noiseOpacity={customOpacity} data-testid="noise-bg">Content</NoiseBackground>);
    
    const container = screen.getByTestId('noise-bg');
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ opacity: customOpacity });
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<NoiseBackground className={customClass} data-testid="noise-bg">Content</NoiseBackground>);
    
    const container = screen.getByTestId('noise-bg');
    expect(container).toHaveClass(customClass);
    expect(container).toHaveClass('relative'); // Default class should still be applied
  });

  it('renders children correctly', () => {
    render(
      <NoiseBackground data-testid="noise-bg">
        <div data-testid="child-element">Child content</div>
      </NoiseBackground>
    );
    
    const container = screen.getByTestId('noise-bg');
    const child = screen.getByTestId('child-element');
    
    expect(container).toContainElement(child);
    expect(child).toHaveTextContent('Child content');
  });

  it('passes additional props to the element', () => {
    const customAttr = 'custom-attr';
    render(
      <NoiseBackground 
        data-testid="noise-bg" 
        data-custom={customAttr}
        id="test-id"
      >
        Content
      </NoiseBackground>
    );
    
    const container = screen.getByTestId('noise-bg');
    expect(container).toHaveAttribute('data-custom', customAttr);
    expect(container).toHaveAttribute('id', 'test-id');
  });

  it('handles edge case: noiseOpacity of 0', () => {
    render(<NoiseBackground noiseOpacity={0} data-testid="noise-bg">Content</NoiseBackground>);
    
    const container = screen.getByTestId('noise-bg');
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ opacity: 0 });
  });

  it('handles edge case: noiseOpacity of 1', () => {
    render(<NoiseBackground noiseOpacity={1} data-testid="noise-bg">Content</NoiseBackground>);
    
    const container = screen.getByTestId('noise-bg');
    const overlay = container.firstChild as HTMLElement;
    expect(overlay).toHaveStyle({ opacity: 1 });
  });

  it('handles edge case: CSS variable as baseColor', () => {
    const cssVariable = 'var(--custom-color)';
    render(<NoiseBackground baseColor={cssVariable} data-testid="noise-bg">Content</NoiseBackground>);
    
    const container = screen.getByTestId('noise-bg');
    expect(container).toHaveStyle({ backgroundColor: cssVariable });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <NoiseBackground>
        <button>Accessible button</button>
      </NoiseBackground>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});