const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    // Handle module aliases
    "^@/(.*)$": "<rootDir>/$1",
  },
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/e2e/", // Exclude Playwright e2e tests from Jest runs
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
  // Coverage configuration
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/stories/**",
    "!**/*.stories.{js,jsx,ts,tsx}",
    "!components/ui/theme-debug.tsx", // Exclude debug component
  ],
  // Coverage thresholds - realistic baseline that will gradually increase
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 80,
      functions: 85,
      lines: 75,
    },
    // Atomic design-specific thresholds (starting conservative)
    "components/ui/**/*.{ts,tsx}": {
      statements: 80,
      branches: 50,
      functions: 85,
      lines: 80,
    },
    "components/molecules/**/*.{ts,tsx}": {
      statements: 60,
      branches: 65,
      functions: 65,
      lines: 60,
    },
    "components/organisms/**/*.{ts,tsx}": {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
    "lib/**/*.{ts,tsx}": {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  // Coverage reporters for CI and local development
  coverageReporters: ["text", "html", "lcov", "json-summary"],
  coverageDirectory: "coverage",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
