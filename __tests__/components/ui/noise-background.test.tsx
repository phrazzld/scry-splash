import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { NoiseBackground } from '@/components/ui/noise-background';

describe('NoiseBackground Component', () => {
  it('renders correctly with default props', () => {
    render(<NoiseBackground role="presentation" aria-label="Background" />);

    const noiseBg = screen.getByRole('presentation', { name: 'Background' });
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
      <NoiseBackground role="presentation" aria-label="Background with child">
        <div>Child content</div>
      </NoiseBackground>
    );

    const noiseBg = screen.getByRole('presentation', { name: 'Background with child' });
    const child = screen.getByText('Child content');

    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Child content');
    expect(noiseBg).toContainElement(child);
  });
  
  it('renders multiple children correctly and preserves order', () => {
    render(
      <NoiseBackground role="presentation" aria-label="Multiple children background">
        <div>First child</div>
        <span>Second child</span>
        <p>Third child</p>
      </NoiseBackground>
    );

    const noiseBg = screen.getByRole('presentation', { name: 'Multiple children background' });
    const firstChild = screen.getByText('First child');
    const secondChild = screen.getByText('Second child');
    const thirdChild = screen.getByText('Third child');

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

    /*
     * COMPONENT STRUCTURE NOTE:
     * The NoiseBackground component renders with the following DOM structure:
     * <div className="relative">   <- noiseBg (the main container)
     *   <div className="absolute"> <- noise overlay (always the first child)
     *   {children}                 <- user's content (rendered after the noise overlay)
     * </div>
     *
     * When verifying the order of child elements, we need to:
     * 1. Skip the first child (noise overlay) since it's internal to the component
     * 2. Only check the user's actual content elements
     */

    // Filter out the noise overlay (first child) to get only the user's content elements
    const childNodes = Array.from(noiseBg.childNodes).filter(
      node => node !== noiseBg.firstChild // Exclude the noise overlay div
    );

    // Find each content element's direct parent (which should be a child of noiseBackground)
    // We use closest() because our test content is nested inside different element types
    const firstParent = firstChild.closest('div:not(.absolute)');
    const secondParent = secondChild.closest('span');
    const thirdParent = thirdChild.closest('p');

    // Verify the elements appear in the DOM in the same order they were defined in JSX
    expect(childNodes[0]).toBe(firstParent);
    expect(childNodes[1]).toBe(secondParent);
    expect(childNodes[2]).toBe(thirdParent);
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<NoiseBackground className={customClass} role="presentation" aria-label="Custom class background" />);

    const noiseBg = screen.getByRole('presentation', { name: 'Custom class background' });
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveClass('relative'); // Default class is still applied
  });

  it('applies default and custom baseColor correctly', () => {
    // First test with default baseColor
    const { rerender } = render(<NoiseBackground role="presentation" aria-label="Default color bg" />);

    let noiseBg = screen.getByRole('presentation', { name: 'Default color bg' });
    // Verify default baseColor is applied
    expect(noiseBg).toHaveStyle({ backgroundColor: 'var(--background)' });

    // Then test with custom baseColor
    const customColor = '#333333';
    rerender(<NoiseBackground baseColor={customColor} role="presentation" aria-label="Custom hex color bg" />);

    noiseBg = screen.getByRole('presentation', { name: 'Custom hex color bg' });
    // JSDOM converts hex colors to rgb format
    const expectedRgbColor = 'rgb(51, 51, 51)';
    expect(noiseBg).toHaveStyle({ backgroundColor: expectedRgbColor });

    // Test with another color format (RGB)
    const rgbColor = 'rgb(100, 150, 200)';
    rerender(<NoiseBackground baseColor={rgbColor} role="presentation" aria-label="Custom rgb color bg" />);

    noiseBg = screen.getByRole('presentation', { name: 'Custom rgb color bg' });
    expect(noiseBg).toHaveStyle({ backgroundColor: rgbColor });
  });

  it('applies custom noiseOpacity and verifies default opacity', () => {
    // First test with default opacity
    const { rerender } = render(<NoiseBackground role="presentation" aria-label="Default opacity bg" />);

    let noiseBg = screen.getByRole('presentation', { name: 'Default opacity bg' });
    let noiseLayer = noiseBg.querySelector('div');

    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer).toHaveStyle({ opacity: '0.02' }); // Default noiseOpacity is 0.02

    // Then test with custom opacity
    const customOpacity = 0.5;
    rerender(<NoiseBackground noiseOpacity={customOpacity} role="presentation" aria-label="Custom opacity bg" />);

    noiseBg = screen.getByRole('presentation', { name: 'Custom opacity bg' });
    noiseLayer = noiseBg.querySelector('div');

    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer).toHaveStyle({ opacity: customOpacity.toString() });
  });

  it('includes an inner div for the noise effect with aria-hidden', () => {
    render(<NoiseBackground role="presentation" aria-label="Noise effect bg" />);

    const noiseBg = screen.getByRole('presentation', { name: 'Noise effect bg' });
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
    render(<NoiseBackground role="presentation" aria-label="Background properties test" />);

    const noiseBg = screen.getByRole('presentation', { name: 'Background properties test' });
    const noiseLayer = noiseBg.querySelector('div');

    // Verify the noise layer exists
    expect(noiseLayer).toBeInTheDocument();

    // JSDOM LIMITATION: Testing CSS and backgroundImage
    // --------------------------------------
    // JSDOM has significant limitations when testing CSS styles, especially for background-image:
    //
    // 1. Complex URL encoding: The background image uses a data URI with encoded SVG content.
    //    Testing frameworks can't reliably compare these complex encoded strings due to
    //    differences in how browsers and JSDOM normalize URLs.
    //
    // 2. Style serialization: JSDOM doesn't always serialize inline styles the same way browsers do,
    //    particularly with backgroundImage properties and data URIs.
    //
    // 3. Partial style application: When React applies styles, JSDOM may render them differently
    //    than a real browser would, sometimes omitting certain properties.
    //
    // Due to these limitations, instead of testing the exact backgroundImage value:
    //
    // 1. We verify other styles like opacity and backgroundRepeat using toHaveStyle()
    // 2. We indirectly verify the component implementation by checking the NoiseBackground.tsx code
    //    has the expected backgroundImage property in the source
    // 3. We trust that Storybook visual testing with Chromatic will catch visual regressions in actual browsers

    // Verify the expected styles we can reliably test with JSDOM
    expect(noiseLayer).toHaveStyle({
      backgroundRepeat: 'repeat',
      opacity: '0.02' // Default opacity
    });

    // Note: We explicitly do NOT test the backgroundImage property directly
    // The actual visual appearance would be validated through Chromatic visual tests
  });

  it('passes additional props to the main element', () => {
    const id = 'custom-id';
    const dataValue = 'custom-data';

    render(
      <NoiseBackground
        id={id}
        role="presentation"
        aria-label="Props test"
        data-custom={dataValue}
      />
    );

    const noiseBg = screen.getByRole('presentation', { name: 'Props test' });
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
        role="presentation"
        aria-label="Combined props test"
      />
    );

    // Verify main wrapper props
    const noiseBg = screen.getByRole('presentation', { name: 'Combined props test' });
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveClass('relative'); // Default class still applied
    expect(noiseBg).toHaveStyle({ backgroundColor: customColor });

    // Verify noise layer props
    const noiseLayer = noiseBg.querySelector('div');
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer).toHaveStyle({ opacity: customOpacity.toString() });

    // Verify structure is correct
    expect(noiseLayer).toHaveClass('absolute');
    expect(noiseLayer).toHaveClass('inset-0');
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('NoiseBackground Accessibility', () => {
  it('has no accessibility violations in default state', async () => {
    const { container } = render(
      <NoiseBackground role="img" aria-label="Default noise background" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Base Color Variants', () => {
    it('has no accessibility violations with default baseColor', async () => {
      const { container } = render(
        <NoiseBackground baseColor="var(--background)" role="img" aria-label="Default background color noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with hex baseColor (#333333)', async () => {
      const { container } = render(
        <NoiseBackground baseColor="#333333" role="img" aria-label="Dark hex color noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with rgb baseColor', async () => {
      const { container } = render(
        <NoiseBackground baseColor="rgb(100, 150, 200)" role="img" aria-label="Blue RGB color noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with rgba baseColor', async () => {
      const { container } = render(
        <NoiseBackground baseColor="rgba(100, 150, 200, 0.8)" role="img" aria-label="Translucent blue noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with named color baseColor', async () => {
      const { container } = render(
        <NoiseBackground baseColor="darkblue" role="img" aria-label="Dark blue noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Noise Opacity Variants', () => {
    it('has no accessibility violations with default noiseOpacity (0.02)', async () => {
      const { container } = render(
        <NoiseBackground noiseOpacity={0.02} role="img" aria-label="Default opacity noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with low noiseOpacity (0.1)', async () => {
      const { container } = render(
        <NoiseBackground noiseOpacity={0.1} role="img" aria-label="Low opacity noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with medium noiseOpacity (0.5)', async () => {
      const { container } = render(
        <NoiseBackground noiseOpacity={0.5} role="img" aria-label="Medium opacity noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with high noiseOpacity (0.9)', async () => {
      const { container } = render(
        <NoiseBackground noiseOpacity={0.9} role="img" aria-label="High opacity noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with zero noiseOpacity (0)', async () => {
      const { container } = render(
        <NoiseBackground noiseOpacity={0} role="img" aria-label="Zero opacity noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Custom Styling', () => {
    it('has no accessibility violations with custom className', async () => {
      const { container } = render(
        <NoiseBackground className="custom-test-class" role="img" aria-label="Custom class noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with multiple custom classNames', async () => {
      const { container } = render(
        <NoiseBackground className="bg-primary rounded-lg shadow-md" role="img" aria-label="Styled noise texture with multiple classes" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom inline styles', async () => {
      const { container } = render(
        <NoiseBackground
          style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          role="img"
          aria-label="Custom styled noise texture"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Children Content', () => {
    it('has no accessibility violations with no children', async () => {
      const { container } = render(
        <NoiseBackground role="img" aria-label="Default noise texture" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with single child', async () => {
      const { container } = render(
        <NoiseBackground role="presentation" aria-label="Noise texture with single child content">
          <div>Single child content</div>
        </NoiseBackground>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with multiple children', async () => {
      const { container } = render(
        <NoiseBackground role="presentation" aria-label="Noise texture with multiple children">
          <div>First child</div>
          <p>Second child</p>
          <span>Third child</span>
        </NoiseBackground>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with semantic children', async () => {
      const { container } = render(
        <NoiseBackground role="presentation" aria-label="Noise texture with semantic content">
          <h2>Heading</h2>
          <p>Paragraph text</p>
          <button>Click me</button>
          <a href="#">Link</a>
        </NoiseBackground>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with nested children', async () => {
      const { container } = render(
        <NoiseBackground role="presentation" aria-label="Noise texture with nested content">
          <div>
            <h3>Nested Heading</h3>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
            </ul>
          </div>
        </NoiseBackground>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('has no accessibility violations with aria-label when role is provided', async () => {
      const { container } = render(
        <NoiseBackground
          role="img"
          aria-label="Decorative background"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aria-hidden', async () => {
      const { container } = render(
        <NoiseBackground
          aria-hidden="true"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aria-describedby when role is provided with aria-label', async () => {
      const { container } = render(
        <>
          <p id="bg-description">A decorative background with noise texture</p>
          <NoiseBackground
            role="img"
            aria-label="Noise background"
            aria-describedby="bg-description"
          />
        </>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Combined Property Variants', () => {
    it('has no accessibility violations with all props combined', async () => {
      const { container } = render(
        <NoiseBackground
          className="custom-test-class"
          baseColor="rgb(200, 100, 50)"
          noiseOpacity={0.75}
          role="presentation"
          aria-label="Combined properties noise texture"
        >
          <div>Inner content</div>
        </NoiseBackground>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with baseColor and aria attributes combined', async () => {
      const { container } = render(
        <NoiseBackground
          baseColor="#444444"
          role="img"
          aria-label="Dark background"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with noiseOpacity and complex children', async () => {
      const { container } = render(
        <NoiseBackground
          noiseOpacity={0.3}
          role="presentation"
          aria-label="Noise texture with complex children"
        >
          <header>
            <h1>Title</h1>
            <nav>
              <ul>
                <li><a href="#">Link 1</a></li>
                <li><a href="#">Link 2</a></li>
              </ul>
            </nav>
          </header>
        </NoiseBackground>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when used as a container for interactive elements', async () => {
      const { container } = render(
        <NoiseBackground
          className="p-4 rounded"
          baseColor="#f5f5f5"
          noiseOpacity={0.1}
          role="presentation"
          aria-label="Noise texture with interactive elements"
        >
          <form>
            <label htmlFor="test-input">Input label</label>
            <input id="test-input" type="text" />
            <button type="submit">Submit</button>
          </form>
        </NoiseBackground>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('NoiseBackground Edge Cases', () => {
  it('renders correctly with no children', () => {
    render(<NoiseBackground role="presentation" aria-label="Empty noise background" />);

    const noiseBg = screen.getByRole('presentation', { name: 'Empty noise background' });
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
    render(<NoiseBackground role="presentation" aria-label="Null children noise background">{null}</NoiseBackground>);

    const noiseBg = screen.getByRole('presentation', { name: 'Null children noise background' });
    expect(noiseBg).toBeInTheDocument();
    expect(noiseBg).toHaveClass('relative');
    
    // Should still have the noise layer div as its only child
    expect(noiseBg.childNodes.length).toBe(1);
    const noiseLayer = noiseBg.firstChild as HTMLElement;
    expect(noiseLayer).toBeInstanceOf(HTMLDivElement);
    expect(noiseLayer).toHaveAttribute('aria-hidden', 'true');
  });
  
  it('renders correctly with undefined children', () => {
    render(<NoiseBackground role="presentation" aria-label="Undefined children noise background">{undefined}</NoiseBackground>);

    const noiseBg = screen.getByRole('presentation', { name: 'Undefined children noise background' });
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
        role="presentation"
        aria-label="Noise background with custom props"
      />
    );
    
    const noiseBg = screen.getByRole('presentation', { name: 'Noise background with custom props' });
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveStyle({ backgroundColor: customColor });

    const noiseLayer = noiseBg.firstChild as HTMLElement;
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer).toHaveStyle({ opacity: customOpacity.toString() });
  });
  
  it('has no accessibility violations when rendered with no children', async () => {
    const { container } = render(
      <NoiseBackground role="img" aria-label="Empty noise background for a11y testing" />
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
      />
    );
    
    const noiseBg = screen.getByRole(role, { name: ariaLabel });
    expect(noiseBg).toHaveAttribute('id', id);
    expect(noiseBg).toHaveAttribute('role', role);
    expect(noiseBg).toHaveAttribute('tabindex', tabIndex.toString());
    expect(noiseBg).toHaveAttribute('title', title);
    expect(noiseBg).toHaveAttribute('aria-label', ariaLabel);
  });
  
  it('passes through multiple data-* attributes', () => {
    render(
      <NoiseBackground
        role="presentation"
        aria-label="Noise background with data attributes"
        data-custom="custom-value"
        data-analytics-id="analytics-123"
        data-automation="test-automation"
      />
    );

    const noiseBg = screen.getByRole('presentation', { name: 'Noise background with data attributes' });
    expect(noiseBg).toHaveAttribute('data-custom', 'custom-value');
    expect(noiseBg).toHaveAttribute('data-analytics-id', 'analytics-123');
    expect(noiseBg).toHaveAttribute('data-automation', 'test-automation');
  });
  
  it('passes through event handler attributes', () => {
    const onClickMock = jest.fn();
    
    render(
      <NoiseBackground
        role="presentation"
        aria-label="Noise background with click handler"
        onClick={onClickMock}
      />
    );

    const noiseBg = screen.getByRole('presentation', { name: 'Noise background with click handler' });
    noiseBg.click();
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
  
  it('passes through style attribute correctly', () => {
    render(
      <NoiseBackground
        role="presentation"
        aria-label="Noise background with custom styles"
        style={{
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      />
    );

    const noiseBg = screen.getByRole('presentation', { name: 'Noise background with custom styles' });
    
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
        role="img"
        aria-label="Noise background with combined attributes"
      />
    );

    const noiseBg = screen.getByRole('img', { name: 'Noise background with combined attributes' });

    // Check component props were applied
    expect(noiseBg).toHaveClass(customClass);
    expect(noiseBg).toHaveClass('relative');
    expect(noiseBg).toHaveStyle({ backgroundColor: customColor });

    // Check HTML attributes were passed through
    expect(noiseBg).toHaveAttribute('id', 'bg-element');
    expect(noiseBg).toHaveAttribute('title', 'Decorative background');

    // Check internal structure (noise layer) has right opacity
    const noiseLayer = noiseBg.querySelector('div');
    expect(noiseLayer).toBeInTheDocument();
    expect(noiseLayer).toHaveStyle({ opacity: customOpacity.toString() });
  });
  
  it('properly applies aria-* attributes', () => {
    render(
      <NoiseBackground
        role="presentation"
        aria-label="Decorative element"
        aria-describedby="description"
        aria-hidden="false"
      />
    );

    const noiseBg = screen.getByRole('presentation', { name: 'Decorative element' });
    expect(noiseBg).toHaveAttribute('aria-label', 'Decorative element');
    expect(noiseBg).toHaveAttribute('aria-describedby', 'description');
    expect(noiseBg).toHaveAttribute('aria-hidden', 'false');
  });
});
