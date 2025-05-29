import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '@/components/molecules/hero-section';

// Mock component interfaces
interface LogoProps {
  size?: string;
  color?: string;
  as?: React.ElementType;
}

interface DisplayTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  weight?: string;
  'data-testid'?: string;
}

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  gap?: string;
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
}

// Mock necessary React hooks for TypewriterHeadline component
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  let effectCount = 0;
  return {
    ...originalReact,
    // Mock useState to return fixed values
    useState: (_: any) => {
      // Different state values for different calls
      const state = [
        ["", () => {}],           // displayText
        [0, () => {}],            // currentPhraseIndex
        [false, () => {}],        // isDeleting
        [false, () => {}],        // isWaiting
        [false, () => {}],        // isComplete
      ][effectCount++ % 5];
      return state;
    },
    // Mock useEffect to do nothing
    useEffect: (_: () => void) => {
      // Don't actually run the effect in tests
      return;
    }
  };
});

// Mock the dependencies of HeroSection
jest.mock('@/components/ui/logo', () => ({
  Logo: ({ size, color, as, "aria-label": ariaLabel }: LogoProps & { "aria-label"?: string }) => (
    <div 
      data-testid="mock-logo" 
      data-size={size} 
      data-color={color} 
      data-as={as}
      data-aria-label={ariaLabel}
    >
      Scry.
    </div>
  ),
}));

jest.mock('@/components/ui/typography', () => ({
  DisplayText: ({ children, className, as, style, weight, 'data-testid': dataTestId, ...props }: DisplayTextProps) => (
    <div 
      data-testid={dataTestId || "mock-display-text"} 
      data-as={as} 
      data-weight={weight}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </div>
  ),
  BodyText: ({ children, className, role, 'data-testid': dataTestId, ...props }: BodyTextProps & { role?: string }) => (
    <div data-testid={dataTestId || "mock-body"} className={className} role={role} {...props}>{children}</div>
  ),
}));

jest.mock('@/components/ui/container', () => ({
  Container: ({ children, className, gap, ...props }: ContainerProps) => (
    <div data-testid={props['data-testid'] || "mock-container"} data-gap={gap} className={className} {...props}>{children}</div>
  ),
  GridItem: ({ children, span, md, lg, mdStart, lgStart, className }: GridItemProps) => (
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
  it('renders correctly with default props and typewriter effect', () => {
    render(<HeroSection />);
    
    // Check if the component renders correctly
    const container = screen.getByTestId('hero-section');
    expect(container).toBeInTheDocument();
    
    // Check for Logo component
    const logo = screen.getByTestId('mock-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-size', 'default');
    expect(logo).toHaveAttribute('data-color', 'chalk'); // 'chalk' now maps to text-foreground
    expect(logo).toHaveAttribute('data-as', 'div');
    
    // Check for DisplayText component (typewriter will use this)
    const displayText = screen.getByTestId('hero-headline');
    expect(displayText).toBeInTheDocument();
    expect(displayText).toHaveAttribute('data-as', 'h1');
    
    // Verify the theme-aware text color class is applied
    expect(displayText.className).toContain('text-foreground');
    
    // Check for subheadline
    const body = screen.getByTestId('hero-subheadline');
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent('Turns your notes into spaced‑repetition prompts—automatically.');
    
    // Verify the theme-aware text color class is applied
    expect(body.className).toContain('text-foreground');
  });

  it('renders with static headline when useTypewriterEffect is false', () => {
    const customHeadline = 'Custom headline';
    
    render(<HeroSection headline={customHeadline} useTypewriterEffect={false} />);
    
    const displayText = screen.getByTestId('hero-headline');
    expect(displayText).toHaveTextContent(customHeadline);
  });

  it('renders with custom headline and subheadline when typewriter is disabled', () => {
    const customHeadline = 'Custom headline';
    const customSubheadline = 'Custom subheadline';
    
    render(<HeroSection headline={customHeadline} subheadline={customSubheadline} useTypewriterEffect={false} />);
    
    const displayText = screen.getByTestId('hero-headline');
    expect(displayText).toHaveTextContent(customHeadline);
    
    const body = screen.getByTestId('hero-subheadline');
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
    const { rerender } = render(<HeroSection centered={false} useTypewriterEffect={false} />);
    
    // Check that className doesn't include centering classes
    const gridItem = screen.getByTestId('mock-grid-item');
    expect(gridItem.className).not.toContain('items-center');
    expect(gridItem.className).not.toContain('text-center');
    
    // Rerender with centered=true
    rerender(<HeroSection centered={true} useTypewriterEffect={false} />);
    
    const updatedGridItem = screen.getByTestId('mock-grid-item');
    expect(updatedGridItem.className).toContain('items-center');
    expect(updatedGridItem.className).toContain('text-center');
  });

  it('applies custom text color', () => {
    const customTextColor = 'text-cobalt';
    render(<HeroSection textColor={customTextColor} useTypewriterEffect={false} />);
    
    const displayText = screen.getByTestId('hero-headline');
    expect(displayText.className).toContain(customTextColor);
    
    const body = screen.getByTestId('hero-subheadline');
    expect(body.className).toContain(customTextColor);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<HeroSection className={customClass} />);
    
    const container = screen.getByTestId('hero-section');
    expect(container.className).toContain(customClass);
  });

  it('passes additional props to container', () => {
    render(<HeroSection data-testprop="test-value" />);
    
    const container = screen.getByTestId('hero-section');
    expect(container).toHaveAttribute('data-testprop', 'test-value');
  });
  
  it('renders with proper container accessibility attributes', () => {
    render(<HeroSection useTypewriterEffect={false} />);
    
    const container = screen.getByTestId('hero-section');
    expect(container).toHaveAttribute('role', 'banner');
    expect(container).toHaveAttribute('id', 'hero-section');
    expect(container).toHaveAttribute('aria-labelledby', 'hero-heading');
  });
  
  it('applies proper ARIA attributes to components', () => {
    render(<HeroSection 
      useTypewriterEffect={false} 
      logoAriaLabel="Custom logo label"
      sectionId="custom-section-id"
    />);
    
    const logo = screen.getByTestId('mock-logo');
    expect(logo).toHaveAttribute('data-aria-label', 'Custom logo label');
    
    const container = screen.getByTestId('hero-section');
    expect(container).toHaveAttribute('id', 'custom-section-id');
    
    const subheadlineContainer = screen.getByTestId('hero-subheadline').parentElement;
    expect(subheadlineContainer).toHaveAttribute('aria-describedby', 'hero-heading');
    
    // Role was removed in favor of using semantic HTML structure
    screen.getByTestId('hero-subheadline');
  });
});
