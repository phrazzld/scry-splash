import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Logo } from '@/components/ui/logo';

describe('Logo Component', () => {
  it('renders correctly with default props and element is h1', () => {
    render(<Logo data-testid="logo" />);
    
    // Verify it's an h1 element
    const logo = screen.getByTestId('logo');
    expect(logo.tagName).toBe('H1');
    
    // Also verify via role
    const headingLogo = screen.getByRole('heading', { level: 1 });
    expect(headingLogo).toBe(logo);
    
    // Verify basic properties
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('font-bold');
    expect(logo).toHaveTextContent('Scry.');
    expect(logo).toHaveAttribute('aria-label', 'Scry');
  });

  it('renders with a different HTML element when as prop is provided', () => {
    // Test div element
    const { rerender } = render(<Logo as="div" data-testid="logo" />);
    
    // Should be a div, not a heading
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    let logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('DIV');
    
    // Test p element
    rerender(<Logo as="p" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    expect(logo.tagName).toBe('P');
    
    // Test span element
    rerender(<Logo as="span" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    expect(logo.tagName).toBe('SPAN');
    
    // Test article element
    rerender(<Logo as="article" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    expect(logo.tagName).toBe('ARTICLE');
  });

  it('uses custom aria-label when provided', () => {
    render(<Logo aria-label="Custom Label" />);
    
    const logo = screen.getByLabelText('Custom Label');
    expect(logo).toBeInTheDocument();
    expect(logo).not.toHaveAttribute('aria-label', 'Scry');
  });

  it('applies custom className and merges with default classes', () => {
    const customClass = 'test-class';
    render(<Logo className={customClass} data-testid="logo" />);

    const logo = screen.getByTestId('logo');

    // Check custom class is applied
    expect(logo).toHaveClass(customClass);

    // Check default classes are still applied
    expect(logo).toHaveClass('font-bold');

    // Verify both classes are applied simultaneously (merged properly)
    expect(logo).toHaveClass(`${customClass} font-bold`, { exact: false });
  });
  
  it('renders with "Scry." text and period has reduced opacity', () => {
    render(<Logo data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    
    // Verify the text content is "Scry."
    expect(logo).toHaveTextContent('Scry.');
    
    // Verify the period is in a span
    const periodSpan = logo.querySelector('span');
    expect(periodSpan).toBeInTheDocument();
    expect(periodSpan).toHaveClass('opacity-70');
    expect(periodSpan).toHaveTextContent('.');
    
    // Ensure the period is the only content in the span
    expect(periodSpan?.textContent).toBe('.');
    
    // Verify the structure: "Scry" text node + span element with "."
    const textNodes = Array.from(logo.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent);
    
    expect(textNodes.join('')).toBe('Scry');
  });

  it('accepts and processes size prop variants', () => {
    // Rather than testing implementation details like class names,
    // we'll verify the component accepts and processes the size prop
    
    // Test with various size props
    render(<Logo size="small" data-testid="logo-small" />);
    render(<Logo size="medium" data-testid="logo-medium" />);
    render(<Logo size="large" data-testid="logo-large" />);
    render(<Logo size="default" data-testid="logo-default" />);
    
    // Verify each size renders successfully
    expect(screen.getByTestId('logo-small')).toBeInTheDocument();
    expect(screen.getByTestId('logo-medium')).toBeInTheDocument();
    expect(screen.getByTestId('logo-large')).toBeInTheDocument();
    expect(screen.getByTestId('logo-default')).toBeInTheDocument();
    
    // Verify the prop was successfully processed (not passed to DOM)
    expect(screen.getByTestId('logo-small')).not.toHaveAttribute('size');
    expect(screen.getByTestId('logo-medium')).not.toHaveAttribute('size');
    expect(screen.getByTestId('logo-large')).not.toHaveAttribute('size');
    expect(screen.getByTestId('logo-default')).not.toHaveAttribute('size');
    
    // Verify all variants maintain the required base class
    expect(screen.getByTestId('logo-small')).toHaveClass('font-bold');
    expect(screen.getByTestId('logo-medium')).toHaveClass('font-bold');
    expect(screen.getByTestId('logo-large')).toHaveClass('font-bold');
    expect(screen.getByTestId('logo-default')).toHaveClass('font-bold');
    
    // Note: Due to JSDOM limitations, we can't directly test computed font-size styles.
    // Instead, we verify the component properly accepts the size prop variants
    // and renders without errors, which is more resilient to implementation changes.
  });

  it('applies correct color variants', () => {
    // Render each color variant for comparison
    const { getByTestId } = render(
      <>
        <Logo color="chalk" data-testid="logo-chalk" />
        <Logo color="ink" data-testid="logo-ink" />
        <Logo color="cobalt" data-testid="logo-cobalt" />
      </>
    );

    // Get all logo variants
    const chalkLogo = getByTestId('logo-chalk');
    const inkLogo = getByTestId('logo-ink');
    const cobaltLogo = getByTestId('logo-cobalt');

    // Verify each logo has the base class
    expect(chalkLogo).toHaveClass('font-bold');
    expect(inkLogo).toHaveClass('font-bold');
    expect(cobaltLogo).toHaveClass('font-bold');

    // Verify all logos have different class combinations (different styling)
    // We're testing that different color props result in different styling
    // without depending on specific class name implementation details
    function getClassSet(element: HTMLElement): Set<string> {
      return new Set(element.className.split(' '));
    }

    const chalkClasses = getClassSet(chalkLogo);
    const inkClasses = getClassSet(inkLogo);
    const cobaltClasses = getClassSet(cobaltLogo);

    // For each pair of elements, there should be at least one class that differs
    const chalkInkDiff = [...chalkClasses].some(cls => !inkClasses.has(cls)) ||
                        [...inkClasses].some(cls => !chalkClasses.has(cls));
    const inkCobaltDiff = [...inkClasses].some(cls => !cobaltClasses.has(cls)) ||
                          [...cobaltClasses].some(cls => !inkClasses.has(cls));
    const chalkCobaltDiff = [...chalkClasses].some(cls => !cobaltClasses.has(cls)) ||
                            [...cobaltClasses].some(cls => !chalkClasses.has(cls));

    expect(chalkInkDiff).toBe(true);
    expect(inkCobaltDiff).toBe(true);
    expect(chalkCobaltDiff).toBe(true);

    // Verify the color prop was successfully processed by checking
    // that it doesn't appear as a DOM attribute
    expect(chalkLogo).not.toHaveAttribute('color');
    expect(inkLogo).not.toHaveAttribute('color');
    expect(cobaltLogo).not.toHaveAttribute('color');
  });
  
  it('combines multiple props correctly', () => {
    // Test combining size, color, className and aria-label
    const customClass = 'custom-test-class';
    const customAriaLabel = 'Custom Logo Label';

    // First render with default props
    const { getByTestId } = render(
      <>
        <Logo data-testid="logo-default" />
        <Logo
          size="small"
          color="cobalt"
          className={customClass}
          aria-label={customAriaLabel}
          data-testid="logo-combined"
        />
      </>
    );

    const defaultLogo = getByTestId('logo-default');
    const combinedLogo = getByTestId('logo-combined');

    // Verify custom aria-label is applied
    expect(combinedLogo).toHaveAttribute('aria-label', customAriaLabel);

    // Verify custom class is present
    expect(combinedLogo).toHaveClass(customClass);

    // Verify base class is still present (this is a documented API aspect)
    expect(combinedLogo).toHaveClass('font-bold');

    // Verify the class combinations are different
    function getClassSet(element: HTMLElement): Set<string> {
      return new Set(element.className.split(' '));
    }

    const defaultClasses = getClassSet(defaultLogo);
    const combinedClasses = getClassSet(combinedLogo);

    // There should be at least one class that differs
    const hasDifference = [...defaultClasses].some(cls => !combinedClasses.has(cls)) ||
                         [...combinedClasses].some(cls => !defaultClasses.has(cls));
    expect(hasDifference).toBe(true);

    // Verify the props were processed (not passed directly to DOM)
    expect(combinedLogo).not.toHaveAttribute('size');
    expect(combinedLogo).not.toHaveAttribute('color');
  });
});

describe('Logo Accessibility', () => {
  it('has no accessibility violations in default state', async () => {
    const { container } = render(
      <Logo data-testid="logo">Scry.</Logo>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe('Element type variants', () => {
    it('has no accessibility violations with h1 element (default)', async () => {
      const { container } = render(
        <Logo as="h1" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with div element', async () => {
      const { container } = render(
        <Logo as="div" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with p element', async () => {
      const { container } = render(
        <Logo as="p" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with span element', async () => {
      const { container } = render(
        <Logo as="span" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with article element', async () => {
      const { container } = render(
        <Logo as="article" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with h2 element', async () => {
      const { container } = render(
        <Logo as="h2" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA attributes', () => {
    it('has no accessibility violations with custom aria-label', async () => {
      const { container } = render(
        <Logo aria-label="Custom Logo Label" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aria-hidden', async () => {
      const { container } = render(
        <Logo aria-hidden="true" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="logo-label">Scry Application Logo</span>
          <Logo aria-labelledby="logo-label" data-testid="logo">Scry.</Logo>
        </>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Size variants', () => {
    it('has no accessibility violations with size="default"', async () => {
      const { container } = render(
        <Logo size="default" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with size="small"', async () => {
      const { container } = render(
        <Logo size="small" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with size="medium"', async () => {
      const { container } = render(
        <Logo size="medium" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with size="large"', async () => {
      const { container } = render(
        <Logo size="large" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color variants', () => {
    it('has no accessibility violations with color="chalk"', async () => {
      const { container } = render(
        <Logo color="chalk" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with color="ink"', async () => {
      const { container } = render(
        <Logo color="ink" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with color="cobalt"', async () => {
      const { container } = render(
        <Logo color="cobalt" data-testid="logo">Scry.</Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Combined variants and edge cases', () => {
    it('has no accessibility violations with combined props', async () => {
      const { container } = render(
        <Logo
          as="div"
          size="small"
          color="cobalt"
          className="custom-test-class"
          aria-label="Custom Logo Label"
          data-testid="logo"
        >
          Scry.
        </Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom style attributes', async () => {
      const { container } = render(
        <Logo
          style={{ letterSpacing: '2px', textDecoration: 'underline' }}
          data-testid="logo"
        >
          Scry.
        </Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when nested within a container', async () => {
      const { container } = render(
        <div role="banner" className="header">
          <Logo data-testid="logo">Scry.</Logo>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with tabIndex attribute', async () => {
      const { container } = render(
        <Logo
          tabIndex={0}
          data-testid="logo"
        >
          Scry.
        </Logo>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('Logo HTML Attribute Passthrough', () => {
  it('passes through standard HTML attributes to the underlying element', () => {
    const id = 'test-logo-id';
    const role = 'banner';
    const tabIndex = 0;
    const title = 'Logo Title';
    
    render(
      <Logo 
        id={id}
        role={role}
        tabIndex={tabIndex}
        title={title}
        data-testid="logo"
      />
    );
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveAttribute('id', id);
    expect(logo).toHaveAttribute('role', role);
    expect(logo).toHaveAttribute('tabindex', tabIndex.toString());
    expect(logo).toHaveAttribute('title', title);
  });
  
  it('passes through multiple data-* attributes', () => {
    render(
      <Logo 
        data-testid="logo"
        data-custom="custom-value"
        data-analytics-id="analytics-123"
        data-automation="test-automation"
      />
    );
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveAttribute('data-custom', 'custom-value');
    expect(logo).toHaveAttribute('data-analytics-id', 'analytics-123');
    expect(logo).toHaveAttribute('data-automation', 'test-automation');
  });
  
  it('passes through event handler attributes', () => {
    const onClickMock = jest.fn();
    
    render(
      <Logo 
        data-testid="logo"
        onClick={onClickMock}
      />
    );
    
    const logo = screen.getByTestId('logo');
    logo.click();
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
  
  it('passes through style attribute correctly', () => {
    render(
      <Logo 
        data-testid="logo"
        style={{ letterSpacing: '2px', textDecoration: 'underline' }}
      />
    );
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveStyle({
      letterSpacing: '2px',
      textDecoration: 'underline'
    });
  });
  
  it('correctly applies both component props and HTML attributes', () => {
    // Render both default and customized Logo for comparison
    const { getByTestId } = render(
      <>
        <Logo data-testid="logo-default" />
        <Logo
          size="small"
          color="cobalt"
          as="div"
          id="logo-id"
          title="Brand Logo"
          data-custom="custom-value"
          data-testid="logo-custom"
        />
      </>
    );

    const defaultLogo = getByTestId('logo-default');
    const customLogo = getByTestId('logo-custom');

    // Check component props were applied
    expect(customLogo.tagName).toBe('DIV'); // as="div"
    expect(defaultLogo.tagName).toBe('H1'); // default is h1

    // Check both logos have the base class
    expect(defaultLogo).toHaveClass('font-bold');
    expect(customLogo).toHaveClass('font-bold');

    // Verify the class combinations are different
    function getClassSet(element: HTMLElement): Set<string> {
      return new Set(element.className.split(' '));
    }

    const defaultClasses = getClassSet(defaultLogo);
    const customClasses = getClassSet(customLogo);

    // There should be at least one class that differs
    const hasDifference = [...defaultClasses].some(cls => !customClasses.has(cls)) ||
                         [...customClasses].some(cls => !defaultClasses.has(cls));
    expect(hasDifference).toBe(true);

    // Check HTML attributes are correctly applied
    expect(customLogo).toHaveAttribute('id', 'logo-id');
    expect(customLogo).toHaveAttribute('title', 'Brand Logo');
    expect(customLogo).toHaveAttribute('data-custom', 'custom-value');
  });
  
  it('has precedence for aria-label over default aria-label', () => {
    const customAriaLabel = 'Custom Scry Logo';
    render(<Logo aria-label={customAriaLabel} data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveAttribute('aria-label', customAriaLabel);
    expect(logo).not.toHaveAttribute('aria-label', 'Scry'); // Default value
  });
});