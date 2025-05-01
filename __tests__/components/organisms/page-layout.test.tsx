import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageLayout, DefaultLayout } from '@/components/organisms/page-layout';

// Mock the dependencies
jest.mock('@/components/ui/container', () => ({
  Container: ({ 
    children, 
    maxWidth, 
    padding, 
    center, 
    className, 
    ...props 
  }) => (
    <div 
      data-testid="mock-container" 
      data-max-width={maxWidth} 
      data-padding={padding} 
      data-center={center}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  GridItem: ({ 
    children, 
    span, 
    md, 
    lg, 
    mdStart, 
    lgStart, 
    className, 
    ...props 
  }) => (
    <div 
      data-testid="mock-grid-item" 
      data-span={span} 
      data-md={md} 
      data-lg={lg}
      data-md-start={mdStart}
      data-lg-start={lgStart}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/noise-background', () => ({
  NoiseBackground: ({ 
    baseColor, 
    noiseOpacity, 
    className, 
    ...props 
  }) => (
    <div 
      data-testid="mock-noise-background" 
      data-base-color={baseColor} 
      data-noise-opacity={noiseOpacity}
      className={className}
      {...props}
    />
  ),
}));

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('PageLayout Component', () => {
  it('renders correctly with default props', () => {
    render(<PageLayout>Test Content</PageLayout>);
    
    // Check main wrapper
    const wrapper = screen.getByRole('main');
    expect(wrapper).toBeInTheDocument();
    
    // Check background
    const background = screen.getByTestId('mock-noise-background');
    expect(background).toBeInTheDocument();
    expect(background).toHaveAttribute('data-base-color', 'var(--color-ink)');
    expect(background).toHaveAttribute('data-noise-opacity', '0.02');
    
    // Check container
    const container = screen.getByTestId('mock-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-max-width', 'xl');
    expect(container).toHaveAttribute('data-padding', 'md');
    expect(container).toHaveAttribute('data-center', 'true');
    expect(container).toHaveClass('animate-fade-in');
    
    // Check content
    expect(container).toHaveTextContent('Test Content');
  });

  it('renders with custom background color and noise opacity', () => {
    const customColor = 'var(--color-cobalt)';
    const customOpacity = 0.05;
    
    render(
      <PageLayout 
        backgroundColor={customColor} 
        noiseOpacity={customOpacity}
      >
        Content
      </PageLayout>
    );
    
    const background = screen.getByTestId('mock-noise-background');
    expect(background).toHaveAttribute('data-base-color', customColor);
    expect(background).toHaveAttribute('data-noise-opacity', String(customOpacity));
  });

  it('renders with custom maxWidth and padding', () => {
    render(
      <PageLayout 
        maxWidth="lg" 
        padding="lg"
      >
        Content
      </PageLayout>
    );
    
    const container = screen.getByTestId('mock-container');
    expect(container).toHaveAttribute('data-max-width', 'lg');
    expect(container).toHaveAttribute('data-padding', 'lg');
  });

  it('disables centering when centered is false', () => {
    render(<PageLayout centered={false}>Content</PageLayout>);
    
    const container = screen.getByTestId('mock-container');
    expect(container).toHaveAttribute('data-center', 'false');
  });

  it('disables animation when animate is false', () => {
    render(<PageLayout animate={false}>Content</PageLayout>);
    
    const container = screen.getByTestId('mock-container');
    expect(container).not.toHaveClass('animate-fade-in');
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<PageLayout className={customClass}>Content</PageLayout>);
    
    const wrapper = screen.getByRole('main');
    expect(wrapper).toHaveClass(customClass);
  });

  it('passes additional props to main div', () => {
    render(<PageLayout data-custom="custom-attr">Content</PageLayout>);
    
    const wrapper = screen.getByRole('main');
    expect(wrapper).toHaveAttribute('data-custom', 'custom-attr');
  });
});

describe('DefaultLayout Component', () => {
  it('renders correctly with default props', () => {
    render(<DefaultLayout>Test Content</DefaultLayout>);
    
    // Check PageLayout is used
    const wrapper = screen.getByRole('main');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('flex items-center justify-center');
    
    // Check GridItem is used with correct props
    const gridItem = screen.getByTestId('mock-grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveAttribute('data-span', '12');
    expect(gridItem).toHaveAttribute('data-md', '10');
    expect(gridItem).toHaveAttribute('data-lg', '8');
    expect(gridItem).toHaveAttribute('data-md-start', '2');
    expect(gridItem).toHaveAttribute('data-lg-start', '3');
    expect(gridItem).toHaveClass('flex flex-col items-center');
    
    // Check content
    expect(gridItem).toHaveTextContent('Test Content');
  });

  it('passes props to the PageLayout component', () => {
    const customColor = 'var(--color-cobalt)';
    
    render(
      <DefaultLayout 
        backgroundColor={customColor} 
        animate={false}
      >
        Content
      </DefaultLayout>
    );
    
    // Check that props are passed to the NoiseBackground
    const background = screen.getByTestId('mock-noise-background');
    expect(background).toHaveAttribute('data-base-color', customColor);
    
    // Check that props are passed to the Container
    const container = screen.getByTestId('mock-container');
    expect(container).not.toHaveClass('animate-fade-in');
  });
});