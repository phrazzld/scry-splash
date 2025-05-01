// Chromatic configuration file
export default {
  // Project token can be passed via command line or environment variable
  // projectToken: process.env.CHROMATIC_PROJECT_TOKEN,
  
  // Don't allow builds to pass with visual changes
  exitZeroOnChanges: false,
  
  // Include only specific paths for performance
  // This helps to reduce build time by only capturing snapshots for components we care about
  onlyChanged: false, // Capture all stories initially, then can be set to true
  
  // Storybook build directory
  storybookBuildDir: 'storybook-static',
  
  // Skip stories that match this pattern
  skip: ['**/*template*/**', '**/node_modules/**'],
  
  // Files to be watched for changes to trigger snapshot updates
  // Reduces false positives from test or configuration files
  fileMatch: ['**/*.tsx', '**/*.css'],
  
  // Viewports to capture snapshots for
  // These should match the viewports defined in Storybook
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
}