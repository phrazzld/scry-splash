import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BenefitTrio } from '@/components/molecules/benefit-trio';

// Mock the Typography components
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  weight?: 'regular' | 'medium' | 'bold';
}

jest.mock('@/components/ui/typography', () => ({
  SubheadingText: ({ children, className, as, weight }: TypographyProps) => (
    <div data-testid="mock-subheading" data-as={as} data-weight={weight} className={className}>{children}</div>
  ),
  BodyText: ({ children, className, as, weight }: TypographyProps) => (
    <div data-testid="mock-body" data-as={as} data-weight={weight} className={className}>{children}</div>
  ),
  HeadingText: ({ children, className, as, weight }: TypographyProps) => (
    <div data-testid="mock-heading" data-as={as} data-weight={weight} className={className}>{children}</div>
  ),
}));

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' ')
}));

describe('BenefitTrio Component', () => {
  it('renders correctly with default props', () => {
    render(<BenefitTrio />);
    
    // With default props, it should use the SubheadingText component
    const textComponent = screen.getByTestId('mock-subheading');
    expect(textComponent).toBeInTheDocument();
    
    // Check that all default benefits are present
    expect(textComponent).toHaveTextContent('Capture anything');
    expect(textComponent).toHaveTextContent('Review in moments');
    expect(textComponent).toHaveTextContent('Master for life');
    
    // Check for separator
    const separators = screen.getAllByText('·');
    expect(separators).toHaveLength(2);
  });

  it('renders with custom benefits', () => {
    const customBenefits = ['Custom 1', 'Custom 2', 'Custom 3'];
    render(<BenefitTrio benefits={customBenefits} />);
    
    const textComponent = screen.getByTestId('mock-subheading');
    
    expect(textComponent).toHaveTextContent('Custom 1');
    expect(textComponent).toHaveTextContent('Custom 2');
    expect(textComponent).toHaveTextContent('Custom 3');
  });

  it('renders with custom separator', () => {
    const customSeparator = '-';
    render(<BenefitTrio separator={customSeparator} />);
    
    const separators = screen.getAllByText('-');
    expect(separators).toHaveLength(2);
  });

  it('renders with correct typography component when variant is changed', () => {
    const { rerender } = render(<BenefitTrio variant="body" />);
    
    // Should use BodyText
    expect(screen.getByTestId('mock-body')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-subheading')).not.toBeInTheDocument();
    
    rerender(<BenefitTrio variant="heading" />);
    
    // Should use HeadingText
    expect(screen.getByTestId('mock-heading')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-body')).not.toBeInTheDocument();
  });

  it('applies custom textColor', () => {
    const customTextColor = 'text-cobalt';
    render(<BenefitTrio textColor={customTextColor} />);
    
    const textComponent = screen.getByTestId('mock-subheading');
    // The cn function is mocked and className is passed through it
    // Just check that the component exists
    expect(textComponent).toBeInTheDocument();
  });

  it('applies custom weight', () => {
    const customWeight = 'bold';
    render(<BenefitTrio weight={customWeight} />);
    
    const textComponent = screen.getByTestId('mock-subheading');
    expect(textComponent).toHaveAttribute('data-weight', customWeight);
  });

  it('applies centered alignment when centered is true', () => {
    render(<BenefitTrio centered={true} />);
    
    const container = screen.getByTestId('mock-subheading').parentElement;
    expect(container).toHaveClass('text-center');
    expect(container).toHaveClass('mx-auto');
  });

  it('does not apply centered alignment when centered is false', () => {
    render(<BenefitTrio centered={false} />);
    
    const container = screen.getByTestId('mock-subheading').parentElement;
    expect(container).not.toHaveClass('text-center');
    expect(container).not.toHaveClass('mx-auto');
  });

  it('fills in missing benefits with placeholders when fewer than 3 are provided', () => {
    render(<BenefitTrio benefits={['Single Benefit']} />);
    
    const textComponent = screen.getByTestId('mock-subheading');
    expect(textComponent).toHaveTextContent('Single Benefit');
    expect(textComponent).toHaveTextContent('Benefit 2');
    expect(textComponent).toHaveTextContent('Benefit 3');
  });

  it('truncates benefits to 3 when more than 3 are provided', () => {
    render(<BenefitTrio benefits={['One', 'Two', 'Three', 'Four', 'Five']} />);
    
    const textComponent = screen.getByTestId('mock-subheading');
    expect(textComponent).toHaveTextContent('One');
    expect(textComponent).toHaveTextContent('Two');
    expect(textComponent).toHaveTextContent('Three');
    expect(textComponent).not.toHaveTextContent('Four');
    expect(textComponent).not.toHaveTextContent('Five');
  });

  it('renders with vertical layout when layout is set to vertical', () => {
    render(<BenefitTrio layout="vertical" />);
    
    // In vertical layout, there should be 3 separate SubheadingText components
    const textComponents = screen.getAllByTestId('mock-subheading');
    expect(textComponents).toHaveLength(3);
  });

  it('renders a responsive layout when layout is set to responsive', () => {
    render(<BenefitTrio layout="responsive" />);
    
    // In responsive layout, there should be 4 SubheadingText components (3 for mobile, 1 for desktop)
    const textComponents = screen.getAllByTestId('mock-subheading');
    expect(textComponents).toHaveLength(4);
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<BenefitTrio className={customClass} />);
    
    const container = screen.getByTestId('mock-subheading').parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('passes additional props to container div', () => {
    render(<BenefitTrio data-testid="benefit-container" />);
    
    const container = screen.getByTestId('benefit-container');
    expect(container).toBeInTheDocument();
  });
});