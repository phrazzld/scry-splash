import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Logo } from '@/components/ui/logo';

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('Logo Component', () => {
  it('renders correctly with default props', () => {
    render(<Logo />);
    
    // Default component should be h1
    const logo = screen.getByRole('heading', { level: 1 });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('font-bold');
    expect(logo).toHaveTextContent('Scry.');
    expect(logo).toHaveAttribute('aria-label', 'Scry');
  });

  it('renders with a different HTML element when as prop is provided', () => {
    render(<Logo as="div" />);
    
    // Should be a div, not a heading
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    
    // Find by aria-label instead
    const logo = screen.getByLabelText('Scry');
    expect(logo).toBeInTheDocument();
    expect(logo.tagName).toBe('DIV');
  });

  it('uses custom aria-label when provided', () => {
    render(<Logo aria-label="Custom Label" />);
    
    const logo = screen.getByLabelText('Custom Label');
    expect(logo).toBeInTheDocument();
    expect(logo).not.toHaveAttribute('aria-label', 'Scry');
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<Logo className={customClass} />);
    
    const logo = screen.getByRole('heading', { level: 1 });
    expect(logo).toHaveClass(customClass);
  });
  
  it('renders with a period that has reduced opacity', () => {
    render(<Logo />);
    
    const logo = screen.getByRole('heading', { level: 1 });
    const periodSpan = logo.querySelector('span');
    
    expect(periodSpan).toBeInTheDocument();
    expect(periodSpan).toHaveClass('opacity-70');
    expect(periodSpan).toHaveTextContent('.');
  });

  it('renders with size="small" variant correctly', () => {
    render(<Logo size="small" data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('text-body');
  });

  it('renders with size="medium" variant correctly', () => {
    render(<Logo size="medium" data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('text-subheading');
  });

  it('renders with size="large" variant correctly', () => {
    render(<Logo size="large" data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('text-[6rem]');
  });

  it('renders with color="chalk" variant correctly', () => {
    render(<Logo color="chalk" data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('text-foreground');
  });

  it('renders with color="ink" variant correctly', () => {
    render(<Logo color="ink" data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('text-background');
  });

  it('renders with color="cobalt" variant correctly', () => {
    render(<Logo color="cobalt" data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('text-primary');
  });

  it('combines multiple variants correctly', () => {
    render(<Logo size="small" color="cobalt" data-testid="logo" />);
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('text-body');
    expect(logo).toHaveClass('text-primary');
  });

  it('passes additional props to the element', () => {
    const customAttr = 'custom-attr';
    render(
      <Logo
        data-testid="logo"
        data-custom={customAttr}
        id="test-id"
      />
    );
    
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveAttribute('data-custom', customAttr);
    expect(logo).toHaveAttribute('id', 'test-id');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Logo />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with different variants', async () => {
    const { container } = render(
      <div>
        <Logo size="small" color="cobalt" />
        <Logo as="div" color="ink" />
      </div>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});