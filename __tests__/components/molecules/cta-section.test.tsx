import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CTASection } from '@/components/molecules/cta-section';

// Mock component interfaces
interface ButtonProps {
  children: React.ReactNode;
  variant?: string;
  size?: string;
  onClick?: () => void;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: unknown;
}

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
}

// Mock the dependencies
jest.mock('@/components/ui/button', () => ({
  Button: ({ 
    children, 
    variant, 
    size, 
    onClick, 
    'aria-label': ariaLabel, 
    type,
    ...props 
  }: ButtonProps) => (
    <button 
      data-testid="mock-button" 
      data-variant={variant} 
      data-size={size} 
      data-aria-label={ariaLabel}
      data-type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/typography', () => ({
  BodyText: ({ children, className }: BodyTextProps) => (
    <div data-testid="mock-body-text" className={className}>{children}</div>
  ),
}));

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' ')
}));

describe('CTASection Component', () => {
  it('renders correctly with default props', () => {
    render(<CTASection />);
    
    // Check button renders with default text
    const button = screen.getByTestId('mock-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Join the wait‑list');
    expect(button).toHaveAttribute('data-variant', 'cta');
    expect(button).toHaveAttribute('data-size', 'xl');
    expect(button).toHaveAttribute('data-type', 'button');
    
    // Check microcopy renders
    const microcopy = screen.getByTestId('mock-body-text');
    expect(microcopy).toBeInTheDocument();
    expect(microcopy).toHaveTextContent('Beta invites roll out weekly.');
  });

  it('renders with custom button text and microcopy', () => {
    const customButtonText = 'Sign up now';
    const customMicrocopy = 'Limited time offer';
    
    render(<CTASection buttonText={customButtonText} microcopy={customMicrocopy} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveTextContent(customButtonText);
    
    const microcopy = screen.getByTestId('mock-body-text');
    expect(microcopy).toHaveTextContent(customMicrocopy);
  });

  it('renders with custom button variant and size', () => {
    render(<CTASection buttonVariant="outline" buttonSize="lg" />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('calls onButtonClick when button is clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<CTASection onButtonClick={handleClick} />);
    
    const button = screen.getByTestId('mock-button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom button aria-label', () => {
    const customAriaLabel = 'Custom aria label';
    render(<CTASection buttonAriaLabel={customAriaLabel} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-aria-label', customAriaLabel);
  });

  it('creates default aria-label from button text and microcopy', () => {
    const buttonText = 'Join now';
    const microcopy = 'Limited spots available';
    render(<CTASection buttonText={buttonText} microcopy={microcopy} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-aria-label', `${buttonText} - ${microcopy}`);
  });

  it('applies centered alignment when centered is true', () => {
    render(<CTASection centered={true} data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('text-center');
  });

  it('does not apply centered alignment when centered is false', () => {
    render(<CTASection centered={false} data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).not.toHaveClass('items-center');
    expect(container).not.toHaveClass('text-center');
  });

  it('applies custom microcopyColor', () => {
    const customColor = 'text-cobalt';
    render(<CTASection microcopyColor={customColor} />);
    
    const microcopy = screen.getByTestId('mock-body-text');
    expect(microcopy).toHaveClass(customColor);
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<CTASection className={customClass} data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).toHaveClass(customClass);
  });

  it('passes additional props to container div', () => {
    render(<CTASection data-custom="custom-attr" data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).toHaveAttribute('data-custom', 'custom-attr');
  });
});