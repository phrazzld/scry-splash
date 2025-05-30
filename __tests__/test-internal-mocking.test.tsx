import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// This would trigger the ESLint error with the proposed rule
jest.mock('@/components/ui/button', () => ({
  Button: () => <div data-testid="mocked-button">Mocked Button</div>
}));

// Alternative way to demonstrate spying
const mockFn = jest.fn();
jest.mock('@/components/ui/logo', () => ({
  Logo: () => {
    mockFn();
    return <div>Mocked Logo</div>;
  }
}));

describe('Test Internal Mocking Detection', () => {
  it('should demonstrate linting violations', () => {
    render(<div>Test</div>);
    expect(true).toBe(true);
  });
});