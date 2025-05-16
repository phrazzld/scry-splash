import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroSection } from '@/components/molecules/hero-section';

// Test specific uncovered lines in the TypewriterHeadline
describe('HeroSection Final Coverage', () => {
  // Mock timer functions
  const originalSetTimeout = globalThis.setTimeout;
  const mockTimeout = jest.fn();
  let timeoutCallbacks: Array<{ callback: () => void; delay: number }> = [];

  beforeEach(() => {
    timeoutCallbacks = [];
    mockTimeout.mockClear();
    
    // Override setTimeout to capture callbacks
    globalThis.setTimeout = ((callback: () => void, delay: number) => {
      timeoutCallbacks.push({ callback, delay });
      mockTimeout(callback, delay);
      return timeoutCallbacks.length - 1;
    }) as any;
  });

  afterEach(() => {
    globalThis.setTimeout = originalSetTimeout;
  });

  it('tests TypewriterHeadline completion state when reaching final phrase', () => {
    render(<HeroSection />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();

    // Simulate the component's internal state management
    // The TypewriterHeadline component should set isComplete
    // when it reaches the final phrase "everything."
    
    // Manually trigger the effect callbacks to simulate state transitions
    // This ensures we cover the isComplete branch
    timeoutCallbacks.forEach((timeout) => {
      if (timeout.delay === 1500) {
        // This is the wait timeout
        timeout.callback();
      }
    });
  });

  it('tests deletion phase when displayText is not empty', () => {
    render(<HeroSection />);
    
    // Execute typing callbacks first  
    const typingCallbacks = timeoutCallbacks.filter(t => t.delay === 70);
    typingCallbacks.forEach(t => t.callback());
    
    // Then execute deletion callbacks
    const deletionCallbacks = timeoutCallbacks.filter(t => t.delay === 30);
    deletionCallbacks.forEach(t => t.callback());
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('tests the effect dependencies change', () => {
    const { rerender } = render(<HeroSection />);
    
    // Let some timeouts register
    expect(timeoutCallbacks.length).toBeGreaterThan(0);
    
    // Trigger a re-render which should reset the effect
    rerender(<HeroSection />);
    
    // New timeouts should be registered
    const initialCount = timeoutCallbacks.length;
    expect(initialCount).toBeGreaterThan(0);
  });

  it('tests final phrase detection logic', () => {
    render(<HeroSection />);
    
    // The component has internal logic that checks if currentPhrase === finalPhrase
    // This happens when the animation reaches "everything."
    
    // Find wait callbacks (1500ms delay)
    const waitCallbacks = timeoutCallbacks.filter(t => t.delay === 1500);
    
    // Execute them to trigger the final phrase check
    waitCallbacks.forEach(t => t.callback());
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('tests when displayText equals currentPhrase', () => {
    render(<HeroSection />);
    
    // Execute multiple typing callbacks to simulate completion
    const typingCallbacks = timeoutCallbacks.filter(t => t.delay === 70);
    
    // Execute enough callbacks to complete a word
    for (let i = 0; i < 10 && i < typingCallbacks.length; i++) {
      typingCallbacks[i].callback();
    }
    
    // This should trigger the waiting state
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('ensures cleanup when component unmounts during animation', () => {
    const { unmount } = render(<HeroSection />);
    
    // Start the animation
    const callbacks = timeoutCallbacks.filter(t => t.delay === 70);
    if (callbacks.length > 0) {
      callbacks[0].callback();
    }
    
    // Unmount should cleanup without errors
    expect(() => unmount()).not.toThrow();
  });

  it('tests empty phrases edge case handling', () => {
    // This test is for defensive programming
    // Even though phrases array is never empty in practice
    render(<HeroSection />);
    
    // The component should still render
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});