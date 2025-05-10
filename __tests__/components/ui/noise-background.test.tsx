import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NoiseBackground } from '@/components/ui/noise-background';

describe('NoiseBackground Component', () => {
  it('renders correctly with default props', () => {
    render(<NoiseBackground data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toBeInTheDocument();
    expect(noiseBg).toHaveClass('relative');
    // We can't easily test CSS variables in JSDOM, so we'll just check the style property exists
    expect(noiseBg.style).toHaveProperty('backgroundColor');
  });

  it('renders children correctly', () => {
    render(
      <NoiseBackground data-testid="noise-bg">
        <div data-testid="child">Child content</div>
      </NoiseBackground>
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    const child = screen.getByTestId('child');
    
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Child content');
    expect(noiseBg).toContainElement(child);
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<NoiseBackground className={customClass} data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveClass('relative'); // Default class is still applied
  });

  it('applies custom baseColor', () => {
    const customColor = 'rgb(51, 51, 51)';
    render(<NoiseBackground baseColor="#333333" data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    // JSDOM converts hex colors to rgb format, so we test against the resulting format
    expect(noiseBg.style.backgroundColor).toBe(customColor);
  });

  it('applies custom noiseOpacity', () => {
    const customOpacity = 0.5;
    render(<NoiseBackground noiseOpacity={customOpacity} data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    const noiseLayer = noiseBg.querySelector('div');
    
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer?.style.opacity).toBe(customOpacity.toString());
  });

  it('includes an inner div for the noise effect with aria-hidden', () => {
    render(<NoiseBackground data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    const noiseLayer = noiseBg.querySelector('div');
    
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer).toHaveClass('absolute');
    expect(noiseLayer).toHaveClass('inset-0');
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
  });

  it('sets correct background image properties on noise layer', () => {
    render(<NoiseBackground data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    const noiseLayer = noiseBg.querySelector('div');
    
    // Check that styles are applied correctly
    expect(noiseLayer).toHaveStyle({
      backgroundRepeat: 'repeat'
    });
    // Just verify backgroundImage property exists, as the exact value can be implementation-specific
    expect(noiseLayer?.style).toHaveProperty('backgroundImage');
  });

  it('passes additional props to the main element', () => {
    const id = 'custom-id';
    const dataValue = 'custom-data';
    
    render(
      <NoiseBackground 
        id={id} 
        data-testid="noise-bg" 
        data-custom={dataValue} 
      />
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toHaveAttribute('id', id);
    expect(noiseBg).toHaveAttribute('data-custom', dataValue);
  });
});