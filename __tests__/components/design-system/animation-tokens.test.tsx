import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { AnimationTokens } from '@/components/design-system/animation-tokens';

describe('AnimationTokens Component', () => {
  it('renders without errors', () => {
    render(<AnimationTokens />);
    // Multiple elements with 'Animation Tokens' exist (main heading and section heading)
    const headings = screen.getAllByText('Animation Tokens');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('displays all animation timing tokens', () => {
    render(<AnimationTokens />);

    // The main Animation Tokens section contains the timing values in a table
    const heading = screen.getAllByText('Animation Tokens');
    expect(heading.length).toBeGreaterThan(0); // Main heading and section heading

    // Check table headers
    expect(screen.getByText('Token')).toBeInTheDocument();
    expect(screen.getByText('Variable')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    // Check individual tokens
    expect(screen.getByText('Fade Duration')).toBeInTheDocument();
    expect(screen.getByText('200ms')).toBeInTheDocument();
    expect(screen.getByText('--animation-fade-duration')).toBeInTheDocument();

    expect(screen.getByText('Fade Timing')).toBeInTheDocument();
    expect(screen.getByText('ease-out')).toBeInTheDocument();
    expect(screen.getByText('--animation-fade-timing')).toBeInTheDocument();
  });

  it('displays all animation classes', () => {
    render(<AnimationTokens />);

    // Check animation classes section
    expect(screen.getByText('Animation Classes')).toBeInTheDocument();

    // Check individual animation classes
    expect(screen.getByText('animate-fade-in')).toBeInTheDocument();
    // Multiple elements with fade text, use getAllByText
    const fadeTexts = screen.getAllByText(/Fades in an element/);
    expect(fadeTexts.length).toBeGreaterThan(0);

    expect(screen.getByText('animate-accordion-down')).toBeInTheDocument();
    expect(screen.getByText(/Expands an accordion panel/)).toBeInTheDocument();

    expect(screen.getByText('animate-accordion-up')).toBeInTheDocument();
    expect(screen.getByText(/Collapses an element/)).toBeInTheDocument();
  });

  it('displays code examples for animation classes', () => {
    const { container } = render(<AnimationTokens />);

    // Check that code examples are present in pre/code blocks
    const codeBlocks = container.querySelectorAll('pre code');
    expect(codeBlocks.length).toBeGreaterThan(0);

    // Check for CSS Implementation label
    const cssLabels = screen.getAllByText('CSS Implementation:');
    expect(cssLabels.length).toBeGreaterThan(0);
  });

  it('displays keyframes documentation', () => {
    render(<AnimationTokens />);

    // Check keyframes section
    expect(screen.getByText('Keyframes')).toBeInTheDocument();

    // Check that keyframes are displayed (they're named without dashes)
    expect(screen.getByText('@keyframes fadeIn')).toBeInTheDocument();
    expect(screen.getByText('@keyframes accordion-down')).toBeInTheDocument();
    expect(screen.getByText('@keyframes accordion-up')).toBeInTheDocument();
  });

  it('displays usage guidelines', () => {
    render(<AnimationTokens />);

    // Check usage guidelines section
    expect(screen.getByText('Usage Guidelines')).toBeInTheDocument();

    // Check Do and Don't sections
    expect(screen.getByText('Do')).toBeInTheDocument();
    expect(screen.getByText("Don't")).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-animation-tokens';
    const { container } = render(<AnimationTokens className={customClass} />);
    
    const component = container.firstChild;
    expect(component).toHaveClass(customClass);
  });

  it('forwards additional props', () => {
    const testId = 'animation-tokens-test';
    render(<AnimationTokens data-testid={testId} id="animation-tokens" />);
    
    const component = screen.getByTestId(testId);
    expect(component).toHaveAttribute('id', 'animation-tokens');
  });

  it('renders animation examples section', () => {
    render(<AnimationTokens />);

    // Check animation examples section exists
    expect(screen.getByText('Animation Examples')).toBeInTheDocument();

    // Check for demo boxes
    expect(screen.getByText('Fade In')).toBeInTheDocument();
    expect(screen.getByText('Button Interactions')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AnimationTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('uses container and grid system correctly', () => {
    const { container } = render(<AnimationTokens />);
    
    // Check for Container usage
    expect(container.querySelector('.container, .grid-container')).toBeInTheDocument();
    
    // Check for GridItem usage
    expect(container.querySelector('[class*="col-span"]')).toBeInTheDocument();
  });

  it('renders Typography components correctly', () => {
    const { container } = render(<AnimationTokens />);

    // Typography components should be used for headings and text
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('displays code examples section', () => {
    render(<AnimationTokens />);

    // Check code examples section
    expect(screen.getByText('Code Examples')).toBeInTheDocument();

    // Check for example code
    expect(screen.getByText(/\/\* Using animation classes \*\//)).toBeInTheDocument();
  });
});