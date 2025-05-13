import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import * as ThemeProviderModule from '@/components/ui/theme-provider';

// Mock the useTheme hook
jest.mock('@/components/ui/theme-provider', () => {
  const original = jest.requireActual('@/components/ui/theme-provider');
  return {
    ...original,
    useTheme: jest.fn(),
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
    
    // Verify the SVG path that represents the moon icon is present
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
    
    // Verify the SVG path that represents the sun icon is present
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
