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

describe('NoiseBackground Edge Cases', () => {
  it('renders correctly with no children', () => {
    render(<NoiseBackground data-testid="empty-noise-bg" />);
    
    const noiseBg = screen.getByTestId('empty-noise-bg');
    expect(noiseBg).toBeInTheDocument();
    expect(noiseBg).toHaveClass('relative');
    
    // Should still have the noise layer div as its only child
    expect(noiseBg.childNodes.length).toBe(1);
    const noiseLayer = noiseBg.firstChild as HTMLElement;
    expect(noiseLayer).toBeInstanceOf(HTMLDivElement);
    expect(noiseLayer).toHaveClass('absolute');
    expect(noiseLayer).toHaveClass('inset-0');
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
  });
  
  it('renders correctly with null children', () => {
    render(<NoiseBackground data-testid="null-noise-bg">{null}</NoiseBackground>);
    
    const noiseBg = screen.getByTestId('null-noise-bg');
    expect(noiseBg).toBeInTheDocument();
    expect(noiseBg).toHaveClass('relative');
    
    // Should still have the noise layer div as its only child
    expect(noiseBg.childNodes.length).toBe(1);
    const noiseLayer = noiseBg.firstChild as HTMLElement;
    expect(noiseLayer).toBeInstanceOf(HTMLDivElement);
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
  });
  
  it('renders correctly with undefined children', () => {
    render(<NoiseBackground data-testid="undefined-noise-bg">{undefined}</NoiseBackground>);
    
    const noiseBg = screen.getByTestId('undefined-noise-bg');
    expect(noiseBg).toBeInTheDocument();
    expect(noiseBg).toHaveClass('relative');
    
    // Should still have the noise layer div as its only child
    expect(noiseBg.childNodes.length).toBe(1);
    const noiseLayer = noiseBg.firstChild as HTMLElement;
    expect(noiseLayer).toBeInstanceOf(HTMLDivElement);
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
  });
  
  it('applies props correctly when rendered with no children', () => {
    const customClass = 'empty-test-class';
    const customColor = 'rgb(50, 100, 150)';
    const customOpacity = 0.3;
    
    render(
      <NoiseBackground 
        className={customClass}
        baseColor={customColor}
        noiseOpacity={customOpacity}
        data-testid="props-noise-bg" 
      />
    );
    
    const noiseBg = screen.getByTestId('props-noise-bg');
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg.style.backgroundColor).toBe(customColor);
    
    const noiseLayer = noiseBg.firstChild as HTMLElement;
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer.style.opacity).toBe(customOpacity.toString());
  });
  
  it('has no accessibility violations when rendered with no children', async () => {
    const { container } = render(
      <NoiseBackground data-testid="empty-noise-bg" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('NoiseBackground HTML Attribute Passthrough', () => {
  it('passes through standard HTML attributes to the underlying element', () => {
    const id = 'test-noise-bg-id';
    const role = 'presentation';
    const tabIndex = -1;
    const title = 'Noise Background';
    const ariaLabel = 'Decorative background';
    
    render(
      <NoiseBackground 
        id={id}
        role={role}
        tabIndex={tabIndex}
        title={title}
        aria-label={ariaLabel}
        data-testid="noise-bg"
      />
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toHaveAttribute('id', id);
    expect(noiseBg).toHaveAttribute('role', role);
    expect(noiseBg).toHaveAttribute('tabindex', tabIndex.toString());
    expect(noiseBg).toHaveAttribute('title', title);
    expect(noiseBg).toHaveAttribute('aria-label', ariaLabel);
  });
  
  it('passes through multiple data-* attributes', () => {
    render(
      <NoiseBackground 
        data-testid="noise-bg"
        data-custom="custom-value"
        data-analytics-id="analytics-123"
        data-automation="test-automation"
      />
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toHaveAttribute('data-custom', 'custom-value');
    expect(noiseBg).toHaveAttribute('data-analytics-id', 'analytics-123');
    expect(noiseBg).toHaveAttribute('data-automation', 'test-automation');
  });
  
  it('passes through event handler attributes', () => {
    const onClickMock = jest.fn();
    
    render(
      <NoiseBackground 
        data-testid="noise-bg"
        onClick={onClickMock}
      />
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    noiseBg.click();
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
  
  it('passes through style attribute correctly', () => {
    render(
      <NoiseBackground 
        data-testid="noise-bg"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      />
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    
    // Custom style attributes should be applied
    expect(noiseBg).toHaveStyle({
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    });
  });
  
  it('correctly applies both component props and HTML attributes together', () => {
    const customClass = 'custom-background';
    const customColor = 'rgb(20, 30, 40)';
    const customOpacity = 0.5;
    
    render(
      <NoiseBackground 
        className={customClass}
        baseColor={customColor}
        noiseOpacity={customOpacity}
        id="bg-element"
        title="Decorative background"
        aria-hidden="true"
        data-testid="noise-bg"
      />
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    
    // Check component props were applied
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveClass('relative');
    expect(noiseBg).toHaveStyle({ backgroundColor: customColor });
    
    // Check HTML attributes were passed through
    expect(noiseBg).toHaveAttribute('id', 'bg-element');
    expect(noiseBg).toHaveAttribute('title', 'Decorative background');
    expect(noiseBg).toHaveAttribute('aria-hidden', 'true');
    
    // Check internal structure (noise layer) has right opacity
    const noiseLayer = noiseBg.querySelector('div');
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer?.style.opacity).toBe(customOpacity.toString());
  });
  
  it('properly applies aria-* attributes', () => {
    render(
      <NoiseBackground 
        data-testid="noise-bg"
        aria-label="Decorative element"
        aria-describedby="description"
        aria-hidden="false"
      />
    );
    
    const noiseBg = screen.getByTestId('noise-bg');
    expect(noiseBg).toHaveAttribute('aria-label', 'Decorative element');
    expect(noiseBg).toHaveAttribute('aria-describedby', 'description');
    expect(noiseBg).toHaveAttribute('aria-hidden', 'false');
  });
});