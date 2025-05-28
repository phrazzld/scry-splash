import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CTASection } from '@/components/molecules/cta-section';
import { FORMSPARK } from '@/lib/constants';

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
  name?: string;
  id?: string;
  placeholder?: string;
  'aria-label'?: string;
  'aria-required'?: boolean | "true" | "false";
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
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
      data-testid={props['data-testid'] || "cta-submit-button"} 
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
      data-testid={props['data-testid'] || "cta-email-input"}
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
  BodyText: ({ children, className, id, role, 'aria-live': ariaLive, 'aria-atomic': ariaAtomic, ...props }: BodyTextProps & { 
    id?: string,
    role?: string, 
    'aria-live'?: "off" | "assertive" | "polite",
    'aria-atomic'?: boolean | "true" | "false"
  }) => (
    <div 
      data-testid={id || "mock-body-text"} 
      id={id}
      className={className}
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      {...props}
    >
      {children}
    </div>
  ),
}));

// Mock the cn utility function and other dependencies
jest.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' ')
}));

// Mock the constants
jest.mock('@/lib/constants', () => ({
  FORMSPARK: {
    FORM_ID: 'test-form-id',
    FORM_ACTION: 'https://submit-form.com/',
    SUBMIT_URL: 'https://submit-form.com/test-form-id'
  }
}));

// Mock fetch globally
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  } as unknown as Response)
);

describe('CTASection Component', () => {
  it('renders correctly with default props', () => {
    render(<CTASection />);
    
    // Check input field renders
    const input = screen.getByTestId('cta-email-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('placeholder', 'Your email address');
    expect(input).toHaveAttribute('aria-label', 'Enter your email address');
    expect(input).toHaveAttribute('required');
    
    // Check button renders with default text
    const button = screen.getByTestId('cta-submit-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Get early access');
    expect(button).toHaveAttribute('data-variant', 'cta'); // Now using cta variant by default
    expect(button).toHaveAttribute('data-size', 'default');
    expect(button).toHaveAttribute('data-type', 'submit');
    
    // Check form element exists
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    // Check honeypot field exists
    const honeypot = document.querySelector('input[name="_gotcha"]');
    expect(honeypot).toBeInTheDocument();
    
    // Check microcopy renders
    const microcopy = screen.getByTestId('cta-microcopy');
    expect(microcopy).toBeInTheDocument();
    expect(microcopy).toHaveTextContent('Beta invites roll out weekly.');
  });

  it('renders with custom button text and microcopy', () => {
    const customButtonText = 'Sign up now';
    const customMicrocopy = 'Limited time offer';
    
    render(<CTASection buttonText={customButtonText} microcopy={customMicrocopy} />);
    
    const button = screen.getByTestId('cta-submit-button');
    expect(button).toHaveTextContent(customButtonText);
    
    const microcopy = screen.getByTestId('cta-microcopy');
    expect(microcopy).toHaveTextContent(customMicrocopy);
  });

  it('renders with custom input placeholder and type', () => {
    const customPlaceholder = 'Enter email to join waitlist';
    const customType = 'text';
    
    render(<CTASection inputPlaceholder={customPlaceholder} inputType={customType} />);
    
    const input = screen.getByTestId('cta-email-input');
    expect(input).toHaveAttribute('placeholder', customPlaceholder);
    expect(input).toHaveAttribute('type', customType);
  });

  it('renders with custom button size', () => {
    render(<CTASection buttonSize="xl" />);
    
    const button = screen.getByTestId('cta-submit-button');
    expect(button).toHaveAttribute('data-size', 'xl');
  });

  it('calls onFormSubmit with input value when form is submitted', async () => {
    const handleSubmit = jest.fn();

    render(<CTASection onFormSubmit={handleSubmit} />);

    const form = screen.getByRole('form');
    const input = screen.getByTestId('cta-email-input');

    // Type in the input
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
    });

    // Submit the form and wait for all state updates
    await act(async () => {
      fireEvent.submit(form);
      // Wait for async operations to complete
      await Promise.resolve();
    });

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('test@example.com');
  });

  it('calls onButtonClick for backward compatibility when form is submitted', async () => {
    const handleClick = jest.fn();

    render(<CTASection onButtonClick={handleClick} />);

    const form = screen.getByRole('form');
    const input = screen.getByTestId('cta-email-input');

    // Type in the input so the form is valid
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
    });

    // Submit the form and wait for all state updates and async operations
    await act(async () => {
      fireEvent.submit(form);

      // Wait for all promises in the microtask queue to resolve
      await Promise.resolve();

      // Mock fetch response would resolve here
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom input aria-label', () => {
    const customAriaLabel = 'Custom input label';
    render(<CTASection inputAriaLabel={customAriaLabel} />);
    
    const input = screen.getByTestId('cta-email-input');
    expect(input).toHaveAttribute('aria-label', customAriaLabel);
  });

  it('applies custom button aria-label', () => {
    const customAriaLabel = 'Custom button label';
    render(<CTASection buttonAriaLabel={customAriaLabel} />);
    
    const button = screen.getByTestId('cta-submit-button');
    expect(button).toHaveAttribute('data-aria-label', customAriaLabel);
  });

  it('creates default button aria-label from button text', () => {
    const buttonText = 'Join now';
    render(<CTASection buttonText={buttonText} />);
    
    const button = screen.getByTestId('cta-submit-button');
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
    
    const microcopy = screen.getByTestId('cta-microcopy');
    expect(microcopy).toHaveClass('text-foreground');
  });

  it('applies custom microcopyColor', () => {
    const customColor = 'text-cobalt';
    render(<CTASection microcopyColor={customColor} />);
    
    const microcopy = screen.getByTestId('cta-microcopy');
    expect(microcopy).toHaveClass(customColor);
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<CTASection className={customClass} data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).toHaveClass(customClass);
  });
  
  it('has proper accessibility attributes for screen readers', () => {
    render(<CTASection />);
    
    // Check for form accessibility attributes
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-labelledby', 'cta-form-heading');
    expect(form).toHaveAttribute('novalidate');
    
    // Check for sr-only form heading
    const formHeading = document.getElementById('cta-form-heading');
    expect(formHeading).toBeInTheDocument();
    expect(formHeading).toHaveClass('sr-only');
    
    // Check for hidden label
    const inputLabel = screen.getByText('Enter your email address');
    expect(inputLabel).toBeInTheDocument();
    expect(inputLabel).toHaveClass('sr-only');
    
    // Check input has an id for label association
    const input = screen.getByTestId('cta-email-input');
    expect(input).toHaveAttribute('id', 'email-input');
    
    // Check microcopy has proper attributes
    const microcopy = screen.getByTestId('cta-microcopy');
    expect(microcopy).toHaveAttribute('id', 'cta-microcopy');
  });

  it('passes additional props to container div', () => {
    render(<CTASection data-custom="custom-attr" data-testid="cta-section" />);
    
    const container = screen.getByTestId('cta-section');
    expect(container).toHaveAttribute('data-custom', 'custom-attr');
  });

  it('uses default Formspark URL from constants', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockClear();

    render(<CTASection />);

    const form = screen.getByRole('form');
    const input = screen.getByTestId('cta-email-input');

    // Type in the input
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
    });

    // Submit the form and wait for all state updates and async operations
    await act(async () => {
      fireEvent.submit(form);

      // Wait for all promises in the microtask queue to resolve
      await Promise.resolve();

      // Mock fetch response would resolve here
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockFetch).toHaveBeenCalledWith(
      FORMSPARK.SUBMIT_URL,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        body: JSON.stringify({ email: 'test@example.com' })
      })
    );
  });

  it('uses custom formAction URL when provided', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockClear();

    const customFormAction = 'https://submit-form.com/custom-id';

    render(<CTASection formAction={customFormAction} />);

    const form = screen.getByRole('form');
    const input = screen.getByTestId('cta-email-input');

    // Type in the input
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
    });

    // Submit the form and wait for all state updates and async operations
    await act(async () => {
      fireEvent.submit(form);

      // Wait for all promises in the microtask queue to resolve
      await Promise.resolve();

      // Mock fetch response would resolve here
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockFetch).toHaveBeenCalledWith(
      customFormAction,
      expect.anything()
    );
  });
  
  it('displays accessible success message after successful submission', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockClear();
    
    render(<CTASection />);
    
    const form = screen.getByRole('form');
    const input = screen.getByTestId('cta-email-input');
    
    // Type in the input
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
    });
    
    // Submit the form and wait for all state updates and async operations
    await act(async () => {
      fireEvent.submit(form);
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check success message has proper accessibility attributes
    const successMessage = screen.getByTestId('cta-success-message');
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveAttribute('role', 'status');
    expect(successMessage).toHaveAttribute('aria-live', 'polite');
    expect(successMessage).toHaveAttribute('aria-atomic', 'true');
    expect(successMessage).toHaveAttribute('id', 'cta-success-message');
    
    // Check for success icon with accessible label
    const successIcon = document.querySelector('[role="img"][aria-label="Success"]');
    expect(successIcon).toBeInTheDocument();
  });
  
  it('displays accessible error message after failed submission', async () => {
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Test error message' })
      } as unknown as Response)
    );
    
    render(<CTASection />);
    
    const form = screen.getByRole('form');
    const input = screen.getByTestId('cta-email-input');
    
    // Type in the input
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test@example.com' } });
    });
    
    // Submit the form and wait for all state updates and async operations
    await act(async () => {
      fireEvent.submit(form);
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check error message has proper accessibility attributes
    const errorMessage = screen.getByTestId('cta-error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
    expect(errorMessage).toHaveAttribute('aria-atomic', 'true');
    expect(errorMessage).toHaveAttribute('id', 'cta-error-message');
    
    // Check for error icon with accessible label
    const errorIcon = document.querySelector('[role="img"][aria-label="Error"]');
    expect(errorIcon).toBeInTheDocument();
    
    // Check form field reflects error state
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'cta-error-message');
  });
});
