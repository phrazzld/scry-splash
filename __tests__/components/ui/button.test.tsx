import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = "test-class";
    render(<Button className={customClass}>Custom Class</Button>);
    const button = screen.getByRole('button', { name: /custom class/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(customClass);
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards additional props to the button element', () => {
    render(<Button aria-label="Test button" data-testid="test-button">Test Props</Button>);
    const button = screen.getByTestId('test-button');
    
    expect(button).toHaveAttribute('aria-label', 'Test button');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    
    expect(button).toBeDisabled();
  });

  it('renders and forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current?.textContent).toBe('Ref Button');
  });
});
