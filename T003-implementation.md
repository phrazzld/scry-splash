# T003: ESLint Rule to Prevent Internal Mocking

## Overview

This document proposes an ESLint rule configuration to prevent internal mocking in test files, enforcing the "No Internal Mocking" policy.

## Proposal

After analyzing the codebase and researching ESLint capabilities, I propose implementing the following approach:

### 1. Install eslint-plugin-jest

The first step is to install the `eslint-plugin-jest` package, which contains specialized rules for Jest tests:

```bash
pnpm add eslint-plugin-jest -D
```

### 2. Update ESLint Configuration

Update the `eslint.config.mjs` file to include rules that prevent internal mocking:

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jestPlugin from "eslint-plugin-jest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // TypeScript ESLint rules to enforce strictness
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      // Prevent usage of the `any` type
      "@typescript-eslint/no-explicit-any": "error",
      
      // Prevent usage of TypeScript suppression comments
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
          "ts-check": false,
          "minimumDescriptionLength": 10
        }
      ],
      
      // Prevent usage of the non-null assertion operator
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  
  // Jest-specific rules for test files
  {
    files: ["**/__tests__/**/*.ts", "**/__tests__/**/*.tsx", "**/*.test.ts", "**/*.test.tsx"],
    plugins: {
      "jest": jestPlugin,
    },
    rules: {
      // Prevent usage of jest.mock() for internal modules
      "jest/no-restricted-matchers": "off",
      "jest/no-restricted-jest-methods": [
        "error",
        {
          "mock": {
            "restricted": [
              // Prevent mocking of internal components
              "@/components/**",
              // You can add more internal module paths here
            ],
            "message": "Mocking internal modules is not allowed. Follow the 'No Internal Mocking' policy."
          },
          "spyOn": {
            "restricted": [
              // Prevent spy on internal modules
              "@/components/**",
              // You can add more internal module paths here
            ],
            "message": "Spying on internal modules is not allowed. Follow the 'No Internal Mocking' policy."
          }
        }
      ],
      
      // Additional recommended Jest rules
      "jest/no-mocks-import": "error", // Prevents importing directly from __mocks__ directory
    }
  }
];

export default eslintConfig;
```

### 3. Create a Test Case

To validate that the rule works correctly, we can create a temporary test file that attempts to mock an internal module:

```typescript
// test-internal-mocking.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// This should trigger the ESLint error
jest.mock('@/components/ui/button', () => ({
  Button: () => <div data-testid="mocked-button">Mocked Button</div>
}));

describe('Test Internal Mocking Detection', () => {
  it('should fail ESLint check due to internal mocking', () => {
    render(<div>Test</div>);
    expect(true).toBe(true);
  });
});
```

## Implementation Steps

1. Install the eslint-plugin-jest package
2. Update the ESLint configuration as shown above
3. Create a test violation file to verify the rule works
4. Run ESLint to confirm the rule catches the violation
5. Remove the test violation file after verification

## Benefits

1. **Automated Enforcement**: The rule will automatically catch violations during development and in CI
2. **Clear Error Messages**: Provides clear guidance when the rule is violated
3. **Configurability**: The rule can be adjusted to include additional internal paths as needed
4. **Consistency**: Ensures all developers follow the same mocking policy

## Limitations

1. **Pattern Detection**: The rule works based on module path patterns, so extremely unusual mocking patterns might require additional configuration
2. **False Positives**: In rare cases where internal mocking is needed, developers would need to add specific exceptions

## Conclusion

Implementing this ESLint rule will provide effective enforcement of the "No Internal Mocking" policy across the codebase, with minimal developer friction.