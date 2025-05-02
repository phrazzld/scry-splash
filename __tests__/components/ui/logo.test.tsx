import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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
});