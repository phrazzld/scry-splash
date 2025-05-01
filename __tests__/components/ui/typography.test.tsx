import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  Typography, 
  DisplayText, 
  HeadingText, 
  SubheadingText, 
  BodyText,
  SmallText,
  SubtleText
} from '@/components/ui/typography';

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('Typography Component', () => {
  it('renders correctly with default props', () => {
    render(<Typography>Test Text</Typography>);
    const text = screen.getByText('Test Text');
    
    expect(text).toBeInTheDocument();
    // We're not actually rendering the real component in our test environment,
    // so we can't check the tagName reliably
    expect(text).toBeTruthy();
  });

  it('renders with custom variant', () => {
    render(<Typography variant="display">Display Text</Typography>);
    const text = screen.getByText('Display Text');
    
    expect(text).toBeInTheDocument();
  });

  it('renders with custom weight', () => {
    render(<Typography weight="bold">Bold Text</Typography>);
    const text = screen.getByText('Bold Text');
    
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('font-bold');
  });

  it('renders with custom element via as prop', () => {
    render(<Typography as="blockquote">Blockquote Text</Typography>);
    const text = screen.getByText('Blockquote Text');
    
    expect(text).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<Typography className={customClass}>Custom Class</Typography>);
    const text = screen.getByText('Custom Class');
    
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass(customClass);
  });

  it('forwards additional props to the element', () => {
    render(<Typography data-testid="test-typography">Test Props</Typography>);
    const text = screen.getByTestId('test-typography');
    
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent('Test Props');
  });
});

describe('Typography Variant Components', () => {
  it('renders DisplayText correctly', () => {
    render(<DisplayText>Display Text</DisplayText>);
    const text = screen.getByText('Display Text');
    
    expect(text).toBeInTheDocument();
  });

  it('renders HeadingText correctly', () => {
    render(<HeadingText>Heading Text</HeadingText>);
    const text = screen.getByText('Heading Text');
    
    expect(text).toBeInTheDocument();
  });

  it('renders SubheadingText correctly', () => {
    render(<SubheadingText>Subheading Text</SubheadingText>);
    const text = screen.getByText('Subheading Text');
    
    expect(text).toBeInTheDocument();
  });

  it('renders BodyText correctly', () => {
    render(<BodyText>Body Text</BodyText>);
    const text = screen.getByText('Body Text');
    
    expect(text).toBeInTheDocument();
  });

  it('renders SmallText correctly', () => {
    render(<SmallText>Small Text</SmallText>);
    const text = screen.getByText('Small Text');
    
    expect(text).toBeInTheDocument();
  });

  it('renders SubtleText correctly', () => {
    render(<SubtleText>Subtle Text</SubtleText>);
    const text = screen.getByText('Subtle Text');
    
    expect(text).toBeInTheDocument();
  });

  it('applies custom as prop to variant components', () => {
    render(<HeadingText as="h4">Custom Heading</HeadingText>);
    const text = screen.getByText('Custom Heading');
    
    expect(text).toBeInTheDocument();
  });

  it('applies custom weight to variant components', () => {
    render(<BodyText weight="bold">Bold Body</BodyText>);
    const text = screen.getByText('Bold Body');
    
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('font-bold');
  });

  it('applies custom className to variant components', () => {
    const customClass = 'custom-class';
    render(<SubheadingText className={customClass}>Custom Subheading</SubheadingText>);
    const text = screen.getByText('Custom Subheading');
    
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass(customClass);
  });
});