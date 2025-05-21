/**
 * Chromatic Configuration
 * 
 * This file is the single source of truth for all Chromatic settings.
 * It's used by both local development and CI environments.
 * 
 * To run Chromatic:
 * - Local: pnpm chromatic
 * - CI: Configured in .github/workflows/chromatic.yml
 */

// Define configuration type for better developer experience 
type ChromaticConfig = {
  projectToken?: string;
  buildScriptName: string;
  storybookBuildDir: string;
  fileMatch: string[];
  skip: string[];
  viewports: number[];
  disableAnimations: boolean;
  exitZeroOnChanges: boolean;
  onlyChanged: boolean;
  // Additional options as needed
}

// Define Chromatic configuration
const config: ChromaticConfig = {
  // Project token can be passed via command line or environment variable
  // It is defined in GitHub secrets for CI
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN,
  
  // Storybook build script name in package.json
  buildScriptName: "build-storybook",
  
  // Where to find the Storybook build output
  storybookBuildDir: "storybook-static",
  
  // Files to watch for changes to trigger snapshot updates
  // Reduces false positives from test or configuration files
  fileMatch: [
    "**/*.tsx", 
    "**/*.css", 
    "**/*.scss", 
    "**/*.stories.tsx",
    "**/*.stories.ts"
  ],
  
  // Skip stories that match this pattern
  // Avoids capturing snapshots for incomplete components or test utilities
  skip: [
    "**/*template*/**", 
    "**/node_modules/**", 
    "**/*.test.tsx", 
    "**/*.spec.tsx"
  ],
  
  // Viewports to capture snapshots for
  // These should match the viewports defined in Storybook's viewport addon
  viewports: [
    // Mobile
    320,
    // Tablet
    768,
    // Desktop
    1024
  ],
  
  // Disable animations to prevent flaky visual tests
  disableAnimations: true,
  
  // Allow builds to pass with visual changes
  // In CI, this is set to true to prevent blocking the pipeline
  // In local development, this should be set based on the use case
  exitZeroOnChanges: true,
  
  // By default, capture all stories initially
  // In CI, this can be set to true to optimize build times
  onlyChanged: false,
};

// Export the configuration
export default config;