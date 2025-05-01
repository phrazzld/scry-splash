import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '@/components/molecules/hero-section';

// Mock the dependencies of HeroSection
jest.mock('@/components/ui/logo', () => ({
  Logo: ({ size, color, as }) => (
    <div data-testid="mock-logo" data-size={size} data-color={color} data-as={as}>
      Scry.
    </div>
  ),
}));

jest.mock('@/components/ui/typography', () => ({
  HeadingText: ({ children, className, as }) => (
    <div data-testid="mock-heading" data-as={as} className={className}>{children}</div>
  ),
  BodyText: ({ children, className }) => (
    <div data-testid="mock-body" className={className}>{children}</div>
  ),
}));

jest.mock('@/components/ui/container', () => ({
  Container: ({ children, className, gap, ...props }) => (
    <div data-testid="mock-container" data-gap={gap} className={className} {...props}>{children}</div>
  ),
  GridItem: ({ children, span, md, lg, mdStart, lgStart, className }) => (
    <div 
      data-testid="mock-grid-item" 
      data-span={span} 
      data-md={md} 
      data-lg={lg} 
      data-md-start={mdStart} 
      data-lg-start={lgStart}
      className={className}
    >
      {children}
    </div>
  ),
}));

describe('HeroSection Component', () => {
  it('renders correctly with default props', () => {
    render(<HeroSection />);
    
    // Check if the component renders correctly
    const container = screen.getByTestId('mock-container');
    expect(container).toBeInTheDocument();
    
    // Check for Logo component
    const logo = screen.getByTestId('mock-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-size', 'default');
    expect(logo).toHaveAttribute('data-color', 'chalk');
    expect(logo).toHaveAttribute('data-as', 'div');
    
    // Check for headline and subheadline
    const heading = screen.getByTestId('mock-heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('data-as', 'h2'); // h2 since centered is true by default
    expect(heading).toHaveTextContent('Remember effortlessly.');
    
    const body = screen.getByTestId('mock-body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent('Turns your notes into spaced‑repetition prompts—automatically.');
  });

  it('renders with custom headline and subheadline', () => {
    const customHeadline = 'Custom headline';
    const customSubheadline = 'Custom subheadline';
    
    render(<HeroSection headline={customHeadline} subheadline={customSubheadline} />);
    
    const heading = screen.getByTestId('mock-heading');
    expect(heading).toHaveTextContent(customHeadline);
    
    const body = screen.getByTestId('mock-body');
    expect(body).toHaveTextContent(customSubheadline);
  });

  it('renders with custom logo settings', () => {
    render(<HeroSection logoSize="large" logoColor="cobalt" />);
    
    const logo = screen.getByTestId('mock-logo');
    expect(logo).toHaveAttribute('data-size', 'large');
    expect(logo).toHaveAttribute('data-color', 'cobalt');
  });

  it('handles centered prop correctly', () => {
    // Test with centered=false
    const { rerender } = render(<HeroSection centered={false} />);
    
    // Check that centered is properly passed to GridItem
    const gridItem = screen.getByTestId('mock-grid-item');
    expect(gridItem).toHaveAttribute('data-md-start', '1');
    expect(gridItem).toHaveAttribute('data-lg-start', '1');
    
    // Check that heading has proper tag
    const heading = screen.getByTestId('mock-heading');
    expect(heading).toHaveAttribute('data-as', 'h1');
    
    // Check that className doesn't include centering classes
    expect(gridItem.className).not.toContain('items-center');
    expect(gridItem.className).not.toContain('text-center');
    
    // Rerender with centered=true
    rerender(<HeroSection centered={true} />);
    
    const updatedGridItem = screen.getByTestId('mock-grid-item');
    expect(updatedGridItem).toHaveAttribute('data-md-start', '2');
    expect(updatedGridItem).toHaveAttribute('data-lg-start', '3');
    
    const updatedHeading = screen.getByTestId('mock-heading');
    expect(updatedHeading).toHaveAttribute('data-as', 'h2');
    
    expect(updatedGridItem.className).toContain('items-center');
    expect(updatedGridItem.className).toContain('text-center');
  });

  it('applies custom text color', () => {
    const customTextColor = 'text-cobalt';
    render(<HeroSection textColor={customTextColor} />);
    
    const heading = screen.getByTestId('mock-heading');
    expect(heading.className).toContain(customTextColor);
    
    const body = screen.getByTestId('mock-body');
    expect(body.className).toContain(customTextColor);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<HeroSection className={customClass} />);
    
    const container = screen.getByTestId('mock-container');
    expect(container.className).toContain(customClass);
  });

  it('passes additional props to container', () => {
    render(<HeroSection data-testprop="test-value" />);
    
    const container = screen.getByTestId('mock-container');
    expect(container).toHaveAttribute('data-testprop', 'test-value');
  });
});