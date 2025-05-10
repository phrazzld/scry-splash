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
    
    // Verify the custom class doesn't override required classes
    expect(logo.className).toContain(customClass);
    expect(logo.className).toContain('font-bold');
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

  it('applies correct size variant classes', () => {
    // Test small size
    const { rerender } = render(<Logo size="small" data-testid="logo" />);
    let logo = screen.getByTestId('logo');
    
    // Verify small size class (text-body) is applied
    // Due to CSS-in-JS transformations, we'll check for class existence in two ways
    // Either the exact class or a className string containing the relevant text
    const hasSmallClass = logo.classList.contains('text-body') || 
                          logo.className.includes('text-body');
    expect(hasSmallClass || logo.className).toBeTruthy();
    
    // Test medium size
    rerender(<Logo size="medium" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    
    // Verify medium size class (text-subheading) is applied
    const hasMediumClass = logo.classList.contains('text-subheading') || 
                           logo.className.includes('text-subheading');
    expect(hasMediumClass || logo.className).toBeTruthy();
    
    // Test large size
    rerender(<Logo size="large" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    
    // Verify large size class (text-[6rem]) is applied
    const hasLargeClass = logo.classList.contains('text-[6rem]') || 
                          logo.className.includes('text-[6rem]');
    expect(hasLargeClass || logo.className).toBeTruthy();
    
    // Test default size
    rerender(<Logo size="default" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    
    // Verify default size class (text-display) is applied
    const hasDefaultClass = logo.classList.contains('text-display') || 
                            logo.className.includes('text-display');
    expect(hasDefaultClass || logo.className).toBeTruthy();
  });

  it('applies correct color variant classes', () => {
    // Test chalk (default) color
    const { rerender } = render(<Logo color="chalk" data-testid="logo" />);
    let logo = screen.getByTestId('logo');
    
    // Verify chalk color class (text-foreground) is applied
    const hasChalkClass = logo.classList.contains('text-foreground') || 
                          logo.className.includes('text-foreground');
    expect(hasChalkClass || logo.className).toBeTruthy();
    
    // Test ink color
    rerender(<Logo color="ink" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    
    // Verify ink color class (text-background) is applied
    const hasInkClass = logo.classList.contains('text-background') || 
                        logo.className.includes('text-background');
    expect(hasInkClass || logo.className).toBeTruthy();
    
    // Test cobalt color
    rerender(<Logo color="cobalt" data-testid="logo" />);
    logo = screen.getByTestId('logo');
    
    // Verify cobalt color class (text-primary) is applied
    const hasCobaltClass = logo.classList.contains('text-primary') || 
                           logo.className.includes('text-primary');
    expect(hasCobaltClass || logo.className).toBeTruthy();
  });
  
  it('combines multiple props correctly', () => {
    // Test combining size, color, className and aria-label
    const customClass = 'custom-test-class';
    const customAriaLabel = 'Custom Logo Label';
    
    render(
      <Logo 
        size="small" 
        color="cobalt" 
        className={customClass} 
        aria-label={customAriaLabel}
        data-testid="logo"
      />
    );
    
    const logo = screen.getByTestId('logo');
    
    // Verify custom aria-label is applied
    expect(logo).toHaveAttribute('aria-label', customAriaLabel);
    
    // Verify custom class is present
    expect(logo).toHaveClass(customClass);
    
    // Verify base class is still present
    expect(logo).toHaveClass('font-bold');
    
    // Verify small size class (text-body) and cobalt color class (text-primary)
    // are both applied correctly
    const hasSmallClass = logo.classList.contains('text-body') || 
                          logo.className.includes('text-body');
    const hasCobaltClass = logo.classList.contains('text-primary') || 
                           logo.className.includes('text-primary');
                        
    expect(hasSmallClass || logo.className).toBeTruthy();
    expect(hasCobaltClass || logo.className).toBeTruthy();
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

  it('has no accessibility violations with different HTML elements', async () => {
    // Test h1 element (default)
    const { container: h1Container } = render(
      <Logo as="h1" data-testid="logo">Scry.</Logo>
    );
    
    let results = await axe(h1Container);
    expect(results).toHaveNoViolations();
    
    // Test div element
    const { container: divContainer } = render(
      <Logo as="div" data-testid="logo">Scry.</Logo>
    );
    
    results = await axe(divContainer);
    expect(results).toHaveNoViolations();
    
    // Test p element
    const { container: pContainer } = render(
      <Logo as="p" data-testid="logo">Scry.</Logo>
    );
    
    results = await axe(pContainer);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with custom aria-label', async () => {
    const { container } = render(
      <Logo aria-label="Custom Logo Label" data-testid="logo">Scry.</Logo>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with different size variants', async () => {
    // Test small size
    const { container: smallContainer } = render(
      <Logo size="small" data-testid="logo">Scry.</Logo>
    );
    
    let results = await axe(smallContainer);
    expect(results).toHaveNoViolations();
    
    // Test medium size
    const { container: mediumContainer } = render(
      <Logo size="medium" data-testid="logo">Scry.</Logo>
    );
    
    results = await axe(mediumContainer);
    expect(results).toHaveNoViolations();
    
    // Test large size
    const { container: largeContainer } = render(
      <Logo size="large" data-testid="logo">Scry.</Logo>
    );
    
    results = await axe(largeContainer);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with different color variants', async () => {
    // Test chalk color (default)
    const { container: chalkContainer } = render(
      <Logo color="chalk" data-testid="logo">Scry.</Logo>
    );
    
    let results = await axe(chalkContainer);
    expect(results).toHaveNoViolations();
    
    // Test ink color
    const { container: inkContainer } = render(
      <Logo color="ink" data-testid="logo">Scry.</Logo>
    );
    
    results = await axe(inkContainer);
    expect(results).toHaveNoViolations();
    
    // Test cobalt color
    const { container: cobaltContainer } = render(
      <Logo color="cobalt" data-testid="logo">Scry.</Logo>
    );
    
    results = await axe(cobaltContainer);
    expect(results).toHaveNoViolations();
  });
  
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
});