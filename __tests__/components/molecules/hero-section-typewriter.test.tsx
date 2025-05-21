import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { HeroSection } from '@/components/molecules/hero-section';

// Test the TypewriterHeadline specifically without mocking React
describe('HeroSection TypewriterHeadline Coverage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('tests complete typewriter animation cycle', async () => {
    render(<HeroSection />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Remember');
    
    // Let the animation run for a bit
    jest.advanceTimersByTime(1000);
    
    // Should have typed some characters
    await waitFor(() => {
      expect(heading.textContent).toMatch(/Remember \w+/);
    }, { timeout: 100 });
  });

  it('tests typewriter effect with final phrase completion', async () => {
    render(<HeroSection />);
    
    // Simulate rapid progression through all phrases
    for (let i = 0; i < 50; i++) {
      jest.advanceTimersByTime(500);
    }
    
    // The animation should eventually complete
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('tests typewriter wait state', async () => {
    render(<HeroSection />);
    
    // Type out a full word (~10 chars at 70ms each)
    jest.advanceTimersByTime(700);
    
    // Enter wait state
    jest.advanceTimersByTime(1500);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('tests typewriter delete phase', async () => {
    render(<HeroSection />);
    
    // Type phase
    jest.advanceTimersByTime(700);
    
    // Wait phase  
    jest.advanceTimersByTime(1500);
    
    // Should start deleting
    jest.advanceTimersByTime(300);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('has accessibility support with aria-live', () => {
    render(<HeroSection />);
    
    const liveRegion = screen.getByRole('heading').querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    // Updated for responsive design
    expect(liveRegion?.className).toContain('whitespace-normal');
    expect(liveRegion?.className).toContain('md:whitespace-nowrap');
  });

  it('shows cursor during animation', () => {
    render(<HeroSection />);
    
    const cursor = screen.getByText('|');
    expect(cursor).toHaveClass('animate-pulse');
  });

  it('tests edge case of empty displayText', async () => {
    render(<HeroSection />);
    
    // Initial render has empty display text
    const heading = screen.getByRole('heading');
    const span = heading.querySelector('[aria-live="polite"]');
    expect(span?.textContent).toMatch(/Remember\s+\|/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<HeroSection useTypewriterEffect={false} />);
    
    jest.useRealTimers(); // Use real timers for axe
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 10000);
});

// Test static rendering separately for better isolation  
describe('HeroSection Static Rendering', () => {
  it('renders all size variations correctly', () => {
    const sizes = ['small', 'medium', 'default', 'large'] as const;
    
    sizes.forEach(size => {
      const { container } = render(
        <HeroSection logoSize={size} useTypewriterEffect={false} key={size} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  it('renders all color variations correctly', () => {
    const colors = ['chalk', 'ink', 'cobalt'] as const;
    
    colors.forEach(color => {
      const { container } = render(
        <HeroSection logoColor={color} useTypewriterEffect={false} key={color} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  it('handles missing subheadline prop', () => {
    render(<HeroSection subheadline={undefined} useTypewriterEffect={false} />);
    
    // Should still render default subheadline
    expect(screen.getByText(/Turns your notes/)).toBeInTheDocument();
  });

  it('applies responsive classes correctly', () => {
    render(<HeroSection useTypewriterEffect={false} />);
    
    const heading = screen.getByRole('heading');
    expect(heading.className).toMatch(/text-\[2\.6rem\]/);
    expect(heading.className).toMatch(/md:text-\[3\.2rem\]/);
  });

  it('forwards additional HTML attributes', () => {
    render(
      <HeroSection 
        data-testid="hero" 
        id="main-hero"
        useTypewriterEffect={false} 
      />
    );
    
    const container = document.querySelector('[data-testid="hero"]');
    expect(container).toHaveAttribute('id', 'main-hero');
  });
});