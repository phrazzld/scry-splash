import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import * as ThemeProviderModule from '@/components/ui/theme-provider';

/**
 * Partial module mocking strategy
 *
 * This pattern allows us to:
 * 1. Keep most of the original module functionality using requireActual
 * 2. Selectively override just the useTheme hook with a mock function
 * 3. Control the hook's return values in each test
 *
 * This is more precise than mocking the entire module and avoids having
 * to reimplement ThemeProvider or any other exports from the module.
 */
jest.mock('@/components/ui/theme-provider', () => {
  const original = jest.requireActual('@/components/ui/theme-provider');
  return {
    ...original,     // Keep all original exports
    useTheme: jest.fn(), // But replace useTheme with a mock
  };
});

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('ThemeToggleButton Component', () => {
  // Setup standard mocks for each test
  beforeEach(() => {
    // Mock the useTheme hook with default values
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      systemTheme: 'light',
      setTheme: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in light mode', () => {
    // Mock the useTheme hook to return light mode
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      systemTheme: 'light',
      setTheme: jest.fn(),
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button');
    
    // In light mode, the moon icon should be visible (for switching to dark)
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');

    /**
     * SVG path identification technique
     *
     * The ThemeToggleButton renders either a sun or moon icon based on the current theme.
     * To verify the correct icon is shown:
     *
     * 1. We use a CSS selector targeting a specific path element with unique path data
     * 2. The selector 'path[d*="17.293 13.293"]' finds the moon icon's path by a distinctive
     *    coordinate fragment in its path data (d) attribute
     * 3. This is more reliable than testing class names, which might change
     * 4. It's also more precise than checking text content, since SVG icons don't have text
     */
    const moonPath = document.querySelector('path[d*="17.293 13.293"]');
    expect(moonPath).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    // Mock the useTheme hook to return dark mode
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      systemTheme: 'dark',
      setTheme: jest.fn(),
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button');
    
    // In dark mode, the sun icon should be visible (for switching to light)
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to light theme');

    /**
     * SVG sun icon identification
     *
     * Similar to the moon icon identification, we use a unique attribute to find the sun icon:
     * - We look for 'path[clip-rule="evenodd"]' which is specific to the sun SVG path
     * - The clip-rule attribute is used for complex SVG shapes like the sun rays
     * - This is a stable selector as long as the sun icon implementation doesn't change dramatically
     */
    const sunPath = document.querySelector('path[clip-rule="evenodd"]');
    expect(sunPath).toBeInTheDocument();
  });

  it('renders correctly when theme is system and system theme is light', () => {
    // Mock the useTheme hook to return system theme with light preference
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      systemTheme: 'light',
      setTheme: jest.fn(),
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button');
    
    // When system theme is light, the moon icon should be visible (for switching to dark)
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
    
    // Verify the SVG path that represents the moon icon is present
    const moonPath = document.querySelector('path[d*="17.293 13.293"]');
    expect(moonPath).toBeInTheDocument();
  });

  it('renders correctly when theme is system and system theme is dark', () => {
    // Mock the useTheme hook to return system theme with dark preference
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      systemTheme: 'dark',
      setTheme: jest.fn(),
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button');
    
    // When system theme is dark, the sun icon should be visible (for switching to light)
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
    
    // Verify the SVG path that represents the sun icon is present
    const sunPath = document.querySelector('path[clip-rule="evenodd"]');
    expect(sunPath).toBeInTheDocument();
  });

  it('toggles from light to dark theme when clicked in light mode', async () => {
    const setThemeMock = jest.fn();
    const user = userEvent.setup();
    
    // Mock the useTheme hook to return light mode
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      systemTheme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button');
    
    // Click the button
    await user.click(button);
    
    // Verify setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light theme when clicked in dark mode', async () => {
    const setThemeMock = jest.fn();
    const user = userEvent.setup();
    
    // Mock the useTheme hook to return dark mode
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      systemTheme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeToggleButton />);
    const button = screen.getByRole('button');
    
    // Click the button
    await user.click(button);
    
    // Verify setTheme was called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-test-class';
    
    // Mock the useTheme hook
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      systemTheme: 'light',
      setTheme: jest.fn(),
    });

    render(<ThemeToggleButton className={customClass} />);
    const button = screen.getByRole('button');
    
    // Verify the custom class is applied
    expect(button).toHaveClass(customClass);
  });

  it('forwards additional props to the button element', () => {
    // Mock the useTheme hook
    (ThemeProviderModule.useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      systemTheme: 'light',
      setTheme: jest.fn(),
    });

    render(<ThemeToggleButton data-testid="test-button" id="custom-id" />);
    const button = screen.getByTestId('test-button');
    
    // Verify additional props are forwarded
    expect(button).toHaveAttribute('id', 'custom-id');
  });
});
