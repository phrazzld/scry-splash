// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Setup jest-axe for accessibility testing
import { toHaveNoViolations } from 'jest-axe';

// Add custom jest matchers for accessibility testing
expect.extend(toHaveNoViolations);