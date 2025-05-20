import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageLayout, DefaultLayout } from '@/components/organisms/page-layout';

// Mock the Footer component
jest.mock('@/components/molecules/footer', () => ({
  Footer: ({ projectText, centered, showThemeToggle, ...props }: any) => (
    <div 
      data-testid="mock-footer" 
      data-project-text={projectText}
      data-centered={centered}
      data-show-theme-toggle={showThemeToggle}
      {...props}
    >
      {projectText}
    </div>
  ),
}));

// Mock the ThemeToggleButton component
jest.mock('@/components/ui/theme-toggle-button', () => ({
  ThemeToggleButton: ({ className, ...props }: any) => (
    <button 
      data-testid="mock-theme-toggle-button" 
      data-class-name={className}
      {...props}
    >
      Toggle theme
    </button>
  ),
}));

// Mock component interfaces
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
  center?: boolean;
  className?: string;
  [key: string]: unknown;
}

interface GridItemProps {
  children: React.ReactNode;
  span?: number;
  md?: number;
  lg?: number;
  mdStart?: number;
  lgStart?: number;
  className?: string;
  [key: string]: unknown;
}

interface NoiseBackgroundProps {
  baseColor?: string;
  noiseOpacity?: number;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

// Mock the dependencies
jest.mock('@/components/ui/container', () => ({
  Container: ({ 
    children, 
    maxWidth, 
    padding, 
    center, 
    className, 
    ...props 
  }: ContainerProps) => (
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
  }: GridItemProps) => (
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
    children,
    ...props 
  }: NoiseBackgroundProps) => (
    <div 
      data-testid="mock-noise-background" 
      data-base-color={baseColor} 
      data-noise-opacity={noiseOpacity}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}));

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' ')
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
    expect(background).toHaveAttribute('data-base-color', 'var(--background)');
    expect(background).toHaveAttribute('data-noise-opacity', '0.02');
    
    // Check container
    const container = screen.getByTestId('mock-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-max-width', 'xl');
    expect(container).toHaveAttribute('data-padding', 'md');
    expect(container).toHaveAttribute('data-center', 'false');
    expect(container).toHaveClass('animate-fade-in');
    
    // Check content
    expect(container).toHaveTextContent('Test Content');
    
    // Check footer
    const footer = screen.getByTestId('mock-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('data-project-text', 'a misty step project');
    expect(footer).toHaveAttribute('data-centered', 'false');
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

  it('renders without footer when showFooter is false', () => {
    render(<PageLayout showFooter={false}>Content</PageLayout>);
    
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
  });

  it('renders with custom footer text', () => {
    const customFooterText = 'Custom footer text';
    render(<PageLayout footerText={customFooterText}>Content</PageLayout>);
    
    const footer = screen.getByTestId('mock-footer');
    expect(footer).toHaveAttribute('data-project-text', customFooterText);
  });

  it('does not render theme toggle button by default', () => {
    render(<PageLayout>Content</PageLayout>);
    
    expect(screen.queryByTestId('mock-theme-toggle-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('header-theme-toggle')).not.toBeInTheDocument();
  });

  it('renders theme toggle button in header when showThemeToggle is true', () => {
    render(<PageLayout showThemeToggle={true}>Content</PageLayout>);
    
    const themeToggle = screen.getByTestId('mock-theme-toggle-button');
    expect(themeToggle).toBeInTheDocument();
    
    const themeToggleContainer = screen.getByTestId('header-theme-toggle');
    expect(themeToggleContainer).toBeInTheDocument();
    
    // Check that the footer theme toggle is hidden when header toggle is shown
    const footer = screen.getByTestId('mock-footer');
    expect(footer).toHaveAttribute('data-show-theme-toggle', 'false');
  });

  it('positions theme toggle on right side by default', () => {
    render(<PageLayout showThemeToggle={true}>Content</PageLayout>);
    
    const themeToggleContainer = screen.getByTestId('header-theme-toggle');
    expect(themeToggleContainer).toHaveClass('right-4');
    expect(themeToggleContainer).not.toHaveClass('left-4');
  });

  it('positions theme toggle based on themeTogglePosition prop', () => {
    render(<PageLayout showThemeToggle={true} themeTogglePosition="left">Content</PageLayout>);
    
    const themeToggleContainer = screen.getByTestId('header-theme-toggle');
    expect(themeToggleContainer).toHaveClass('left-4');
    expect(themeToggleContainer).not.toHaveClass('right-4');
  });
});

describe('DefaultLayout Component', () => {
  it('renders correctly with default props', () => {
    render(<DefaultLayout>Test Content</DefaultLayout>);
    
    // Check PageLayout is used
    const wrapper = screen.getByRole('main');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('flex justify-center');
    
    // Check GridItem is used with correct props
    const gridItem = screen.getByTestId('mock-grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveAttribute('data-span', '12');
    expect(gridItem).toHaveAttribute('data-md', '10');
    expect(gridItem).toHaveAttribute('data-lg', '8');
    // mdStart and lgStart are no longer used in the implementation
    expect(gridItem).toHaveClass('flex flex-col');
    
    // Check content
    expect(gridItem).toHaveTextContent('Test Content');
  });

  it('passes props to the PageLayout component', () => {
    const customColor = 'var(--color-cobalt)';
    const customFooterText = 'Custom footer for DefaultLayout';
    
    render(
      <DefaultLayout 
        backgroundColor={customColor} 
        animate={false}
        footerText={customFooterText}
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
    
    // Check that props are passed to the Footer
    const footer = screen.getByTestId('mock-footer');
    expect(footer).toHaveAttribute('data-project-text', customFooterText);
  });
  
  it('renders without footer when showFooter is false', () => {
    render(
      <DefaultLayout showFooter={false}>
        Content
      </DefaultLayout>
    );
    
    expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
  });

  it('renders theme toggle button when showThemeToggle is true', () => {
    render(
      <DefaultLayout showThemeToggle={true}>
        Content
      </DefaultLayout>
    );
    
    expect(screen.getByTestId('mock-theme-toggle-button')).toBeInTheDocument();
    expect(screen.getByTestId('header-theme-toggle')).toBeInTheDocument();
  });

  it('passes themeTogglePosition prop to PageLayout', () => {
    render(
      <DefaultLayout showThemeToggle={true} themeTogglePosition="left">
        Content
      </DefaultLayout>
    );
    
    const themeToggleContainer = screen.getByTestId('header-theme-toggle');
    expect(themeToggleContainer).toHaveClass('left-4');
    expect(themeToggleContainer).not.toHaveClass('right-4');
  });
});
