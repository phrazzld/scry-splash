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
}

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
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
  Logo: ({ size, color, as }: LogoProps) => (
    <div data-testid="mock-logo" data-size={size} data-color={color} data-as={as}>
      Scry.
    </div>
  ),
}));

jest.mock('@/components/ui/typography', () => ({
  DisplayText: ({ children, className, as, style, weight }: DisplayTextProps) => (
    <div 
      data-testid="mock-display-text" 
      data-as={as} 
      data-weight={weight}
      className={className}
      style={style}
    >
      {children}
    </div>
  ),
  BodyText: ({ children, className }: BodyTextProps) => (
    <div data-testid="mock-body" className={className}>{children}</div>
  ),
}));

jest.mock('@/components/ui/container', () => ({
  Container: ({ children, className, gap, ...props }: ContainerProps) => (
    <div data-testid="mock-container" data-gap={gap} className={className} {...props}>{children}</div>
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
    const container = screen.getByTestId('mock-container');
    expect(container).toBeInTheDocument();
    
    // Check for Logo component
    const logo = screen.getByTestId('mock-logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('data-size', 'default');
    expect(logo).toHaveAttribute('data-color', 'chalk'); // 'chalk' now maps to text-foreground
    expect(logo).toHaveAttribute('data-as', 'div');
    
    // Check for DisplayText component (typewriter will use this)
    const displayText = screen.getByTestId('mock-display-text');
    expect(displayText).toBeInTheDocument();
    expect(displayText).toHaveAttribute('data-as', 'h1');
    
    // Verify the theme-aware text color class is applied
    expect(displayText.className).toContain('text-foreground');
    
    // Check for subheadline
    const body = screen.getByTestId('mock-body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent('Turns your notes into spaced‑repetition prompts—automatically.');
    
    // Verify the theme-aware text color class is applied
    expect(body.className).toContain('text-foreground');
  });

  it('renders with static headline when useTypewriterEffect is false', () => {
    const customHeadline = 'Custom headline';
    
    render(<HeroSection headline={customHeadline} useTypewriterEffect={false} />);
    
    const displayText = screen.getByTestId('mock-display-text');
    expect(displayText).toHaveTextContent(customHeadline);
  });

  it('renders with custom headline and subheadline when typewriter is disabled', () => {
    const customHeadline = 'Custom headline';
    const customSubheadline = 'Custom subheadline';
    
    render(<HeroSection headline={customHeadline} subheadline={customSubheadline} useTypewriterEffect={false} />);
    
    const displayText = screen.getByTestId('mock-display-text');
    expect(displayText).toHaveTextContent(customHeadline);
    
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
    
    const displayText = screen.getByTestId('mock-display-text');
    expect(displayText.className).toContain(customTextColor);
    
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
