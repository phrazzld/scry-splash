import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { NoiseBackground } from '@/components/ui/noise-background';

describe('NoiseBackground Component', () => {
  it('renders correctly with default props', () => {
    render(<NoiseBackground data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toBeInTheDocument();
    expect(noiseBg).toHaveClass('relative');
    
    // Verify the style attribute exists for background color
    // Note: JSDOM might not fully process inline styles with CSS variables,
    // so we'll check the attribute rather than computed style
    expect(noiseBg).toHaveStyle({ backgroundColor: 'var(--background)' });
    
    // Verify component structure is correct
    expect(noiseBg.childNodes.length).toBeGreaterThanOrEqual(1); // At least the noise div
    expect(noiseBg.firstChild).toBeInstanceOf(HTMLDivElement); // First child should be the noise div
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
  
  it('renders multiple children correctly and preserves order', () => {
    render(
      <NoiseBackground data-testid="noise-bg">
        <div data-testid="first-child">First child</div>
        <span data-testid="second-child">Second child</span>
        <p data-testid="third-child">Third child</p>
      </NoiseBackground>
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    const firstChild = screen.getByTestId('first-child');
    const secondChild = screen.getByTestId('second-child');
    const thirdChild = screen.getByTestId('third-child');
    
    // Verify all children are present
    expect(firstChild).toBeInTheDocument();
    expect(secondChild).toBeInTheDocument();
    expect(thirdChild).toBeInTheDocument();
    
    // Verify children have correct content
    expect(firstChild).toHaveTextContent('First child');
    expect(secondChild).toHaveTextContent('Second child');
    expect(thirdChild).toHaveTextContent('Third child');
    
    // Verify parent contains children
    expect(noiseBg).toContainElement(firstChild);
    expect(noiseBg).toContainElement(secondChild);
    expect(noiseBg).toContainElement(thirdChild);
    
    // Verify order is preserved (we need to check DOM order excluding the noise div)
    const childNodes = Array.from(noiseBg.childNodes).filter(
      node => node !== noiseBg.firstChild // Filter out the noise div
    );
    expect(childNodes[0]).toBe(firstChild);
    expect(childNodes[1]).toBe(secondChild);
    expect(childNodes[2]).toBe(thirdChild);
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<NoiseBackground className={customClass} data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveClass('relative'); // Default class is still applied
  });

  it('applies default and custom baseColor correctly', () => {
    // First test with default baseColor
    const { rerender } = render(<NoiseBackground data-testid="noise-bg" />);
    
    let noiseBg = screen.getByTestId('noise-bg');
    // Verify default baseColor is applied
    expect(noiseBg).toHaveStyle({ backgroundColor: 'var(--background)' });
    
    // Then test with custom baseColor
    const customColor = '#333333';
    rerender(<NoiseBackground baseColor={customColor} data-testid="noise-bg" />);
    
    noiseBg = screen.getByTestId('noise-bg');
    // JSDOM converts hex colors to rgb format
    const expectedRgbColor = 'rgb(51, 51, 51)';
    expect(noiseBg.style.backgroundColor).toBe(expectedRgbColor);
    
    // Test with another color format (RGB)
    const rgbColor = 'rgb(100, 150, 200)';
    rerender(<NoiseBackground baseColor={rgbColor} data-testid="noise-bg" />);
    
    noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg.style.backgroundColor).toBe(rgbColor);
  });

  it('applies custom noiseOpacity and verifies default opacity', () => {
    // First test with default opacity
    const { rerender } = render(<NoiseBackground data-testid="noise-bg" />);
    
    let noiseBg = screen.getByTestId('noise-bg');
    let noiseLayer = noiseBg.querySelector('div');
    
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer?.style.opacity).toBe('0.02'); // Default noiseOpacity is 0.02
    
    // Then test with custom opacity
    const customOpacity = 0.5;
    rerender(<NoiseBackground noiseOpacity={customOpacity} data-testid="noise-bg" />);
    
    noiseBg = screen.getByTestId('noise-bg');
    noiseLayer = noiseBg.querySelector('div');
    
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer?.style.opacity).toBe(customOpacity.toString());
  });

  it('includes an inner div for the noise effect with aria-hidden', () => {
    render(<NoiseBackground data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    const noiseLayer = noiseBg.querySelector('div');
    
    // Verify noise layer exists and is correctly positioned
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer).toHaveClass('absolute');
    expect(noiseLayer).toHaveClass('inset-0');
    
    // Verify aria-hidden attribute for accessibility
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
    
    // Verify it's the first child of the container
    expect(noiseBg.firstChild).toBe(noiseLayer);
    
    // Verify it has no children of its own (is empty except for styles)
    expect(noiseLayer?.childNodes.length).toBe(0);
  });

  it('verifies noise layer has background related properties', () => {
    render(<NoiseBackground data-testid="noise-bg" />);
    
    const noiseBg = screen.getByTestId('noise-bg');
    const noiseLayer = noiseBg.querySelector('div');
    
    // Verify the noise layer exists
    expect(noiseLayer).toBeInTheDocument();
    
    // Verify it has the background-repeat style
    expect(noiseLayer).toHaveStyle({
      backgroundRepeat: 'repeat'
    });
    
    // JSDOM limitations make it difficult to fully test inline style properties like backgroundImage 
    // but we can verify the style attribute exists and has some properties
    expect(noiseLayer).toHaveAttribute('style');
    const styleAttr = noiseLayer?.getAttribute('style') || '';
    expect(styleAttr).toContain('background-repeat');
    expect(styleAttr).toContain('opacity');
    
    // Instead of focusing on JSDOM's quirks, we can infer from the component implementation
    // that if the noise div exists with the expected attributes, the background image is also applied
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
  
  it('applies all props correctly when used together', () => {
    // Test multiple props simultaneously
    const customClass = 'combined-test-class';
    const customColor = 'rgb(200, 100, 50)';
    const customOpacity = 0.75;
    
    render(
      <NoiseBackground 
        className={customClass}
        baseColor={customColor}
        noiseOpacity={customOpacity}
        data-testid="noise-bg" 
      />
    );
    
    // Verify main wrapper props
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveClass('relative'); // Default class still applied
    expect(noiseBg.style.backgroundColor).toBe(customColor);
    
    // Verify noise layer props
    const noiseLayer = noiseBg.querySelector('div');
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer?.style.opacity).toBe(customOpacity.toString());
    
    // Verify structure is correct
    expect(noiseLayer).toHaveClass('absolute');
    expect(noiseLayer).toHaveClass('inset-0');
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('NoiseBackground Accessibility', () => {
  it('has no accessibility violations in default state', async () => {
    const { container } = render(
      <NoiseBackground data-testid="noise-bg" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with custom className', async () => {
    const { container } = render(
      <NoiseBackground className="custom-test-class" data-testid="noise-bg" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with custom baseColor', async () => {
    const { container } = render(
      <NoiseBackground baseColor="#333333" data-testid="noise-bg" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with custom noiseOpacity', async () => {
    const { container } = render(
      <NoiseBackground noiseOpacity={0.5} data-testid="noise-bg" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with children content', async () => {
    const { container } = render(
      <NoiseBackground data-testid="noise-bg">
        <div>Child content</div>
        <p>More content</p>
      </NoiseBackground>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('has no accessibility violations with all props combined', async () => {
    const { container } = render(
      <NoiseBackground 
        className="custom-test-class"
        baseColor="rgb(200, 100, 50)"
        noiseOpacity={0.75}
        data-testid="noise-bg"
      >
        <div>Inner content</div>
      </NoiseBackground>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});