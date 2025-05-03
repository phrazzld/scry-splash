import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
  className?: string;
  [key: string]: unknown;
}

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
}

interface InputProps {
  type?: string;
  placeholder?: string;
  'aria-label'?: string;
  value?: string;
  onChange?: (e: any) => void;
  required?: boolean;
  className?: string;
  [key: string]: unknown;
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
    className,
    ...props 
  }: ButtonProps) => (
    <button 
      data-testid="mock-button" 
      data-variant={variant} 
      data-size={size} 
      data-aria-label={ariaLabel}
      data-type={type}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ 
    type, 
    placeholder, 
    'aria-label': ariaLabel, 
    value, 
    onChange, 
    required,
    className,
    ...props 
  }: InputProps) => (
    <input 
      data-testid="mock-input" 
      type={type}
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
      required={required}
      className={className}
      {...props}
    />
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
    
    // Check input field renders
    const input = screen.getByTestId('mock-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Your email address');
    expect(input).toHaveAttribute('aria-label', 'Enter your email address');
    expect(input).toHaveAttribute('required');
    
    // Check button renders with default text
    const button = screen.getByTestId('mock-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Get early access');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');
    expect(button).toHaveAttribute('data-type', 'submit');
    
    // Check form element exists
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
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

  it('renders with custom input placeholder and type', () => {
    const customPlaceholder = 'Enter email to join waitlist';
    const customType = 'text';
    
    render(<CTASection inputPlaceholder={customPlaceholder} inputType={customType} />);
    
    const input = screen.getByTestId('mock-input');
    expect(input).toHaveAttribute('placeholder', customPlaceholder);
    expect(input).toHaveAttribute('type', customType);
  });

  it('renders with custom button variant and size', () => {
    render(<CTASection buttonVariant="outline" buttonSize="xl" />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'xl');
  });

  it('calls onFormSubmit with input value when form is submitted', async () => {
    const handleSubmit = jest.fn();
    
    render(<CTASection onFormSubmit={handleSubmit} />);
    
    const form = screen.getByRole('form');
    const input = screen.getByTestId('mock-input');
    
    // Type in the input
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    // Submit the form
    fireEvent.submit(form);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('test@example.com');
  });

  it('calls onButtonClick for backward compatibility when form is submitted', async () => {
    const handleClick = jest.fn();
    
    render(<CTASection onButtonClick={handleClick} />);
    
    const form = screen.getByRole('form');
    
    // Submit the form
    fireEvent.submit(form);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom input aria-label', () => {
    const customAriaLabel = 'Custom input label';
    render(<CTASection inputAriaLabel={customAriaLabel} />);
    
    const input = screen.getByTestId('mock-input');
    expect(input).toHaveAttribute('aria-label', customAriaLabel);
  });

  it('applies custom button aria-label', () => {
    const customAriaLabel = 'Custom button label';
    render(<CTASection buttonAriaLabel={customAriaLabel} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-aria-label', customAriaLabel);
  });

  it('creates default button aria-label from button text', () => {
    const buttonText = 'Join now';
    render(<CTASection buttonText={buttonText} />);
    
    const button = screen.getByTestId('mock-button');
    expect(button).toHaveAttribute('data-aria-label', buttonText);
  });

  it('applies centered alignment when centered is true', () => {
    render(<CTASection centered={true} data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('text-center');
    
    const form = screen.getByRole('form');
    expect(form).toHaveClass('items-center');
  });

  it('does not apply centered alignment when centered is false', () => {
    render(<CTASection centered={false} data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).not.toHaveClass('items-center');
    expect(container).not.toHaveClass('text-center');
    
    const form = screen.getByRole('form');
    expect(form).not.toHaveClass('items-center');
  });

  it('applies default theme-aware text color to microcopy', () => {
    render(<CTASection />);
    
    const microcopy = screen.getByTestId('mock-body-text');
    expect(microcopy).toHaveClass('text-foreground');
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