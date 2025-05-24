#!/usr/bin/env ts-node
/**
 * Test Mode Information Script
 * 
 * This script provides information about the current test mode configuration
 * and available test modes. It can be used for debugging and documentation.
 * 
 * Usage:
 *   ts-node e2e/scripts/test-mode-info.ts
 *   TEST_MODE=ci-functional ts-node e2e/scripts/test-mode-info.ts
 */

import { 
  TestMode, 
  getCurrentTestMode,
  getTestModeSummary,
  getConfigForMode
} from '../utils/test-modes';

/**
 * Display information about a specific test mode
 */
function displayModeInfo(mode: TestMode) {
  const config = getConfigForMode(mode);
  
  console.log(`\n📋 ${mode.toUpperCase()}`);
  console.log(`   Description: ${config.description}`);
  console.log(`   Browsers: ${config.browsers.join(', ')}`);
  console.log(`   Retries: ${config.retries}`);
  console.log(`   Visual Testing: ${config.visualTestingEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   Performance Threshold: ${config.performanceThresholdMultiplier}x`);
  console.log(`   Timeout - Test: ${config.testTimeout}ms`);
  console.log(`   Timeout - Action: ${config.actionTimeout}ms`);
  console.log(`   Timeout - Navigation: ${config.navigationTimeout}ms`);
  console.log(`   Include Tags: ${config.includeTags.length > 0 ? config.includeTags.join(', ') : 'None'}`);
  console.log(`   Exclude Tags: ${config.excludeTags.length > 0 ? config.excludeTags.join(', ') : 'None'}`);
  console.log(`   Screenshots on Failure: ${config.captureScreenshotsOnFailure ? '✅' : '❌'}`);
  console.log(`   Screenshots on Success: ${config.captureScreenshotsOnSuccess ? '✅' : '❌'}`);
  console.log(`   Videos: ${config.captureVideos ? '✅' : '❌'}`);
  console.log(`   Traces: ${config.captureTraces ? '✅' : '❌'}`);
}

/**
 * Main function
 */
function main() {
  console.log('🧪 Test Mode Information\n');
  
  // Show current mode
  const currentMode = getCurrentTestMode();
  const summary = getTestModeSummary();
  
  console.log('🎯 CURRENT MODE');
  console.log(`   Mode: ${currentMode}`);
  console.log(`   Environment: ${summary.isCI ? 'CI' : 'Local'}`);
  console.log(`   OS: ${summary.os}`);
  
  // Show current mode details
  displayModeInfo(currentMode);
  
  // Show all available modes
  console.log('\n📚 ALL AVAILABLE MODES');
  
  Object.values(TestMode).forEach(mode => {
    if (mode !== currentMode) {
      displayModeInfo(mode);
    }
  });
  
  // Show usage examples
  console.log('\n🚀 USAGE EXAMPLES');
  console.log('   Local Development:');
  console.log('     pnpm e2e:local');
  console.log('     TEST_MODE=local-development pnpm e2e');
  console.log('');
  console.log('   CI Functional Tests:');
  console.log('     pnpm e2e:ci-functional');
  console.log('     TEST_MODE=ci-functional pnpm e2e');
  console.log('');
  console.log('   CI Visual Tests:');
  console.log('     pnpm e2e:ci-visual');
  console.log('     TEST_MODE=ci-visual pnpm e2e');
  console.log('');
  console.log('   CI Full Suite:');
  console.log('     pnpm e2e:ci-full');
  console.log('     TEST_MODE=ci-full pnpm e2e');
  console.log('');
  console.log('   CI Lightweight:');
  console.log('     pnpm e2e:ci-lightweight');
  console.log('     TEST_MODE=ci-lightweight pnpm e2e');
  console.log('');
  console.log('   Specific Test Types:');
  console.log('     pnpm e2e:functional  # Only functional tests');
  console.log('     pnpm e2e:visual      # Only visual tests');
  console.log('     pnpm e2e:performance # Only performance tests');
  console.log('     pnpm e2e:critical    # Only critical tests');
  
  // Show environment variable override options
  console.log('\n⚙️  ENVIRONMENT VARIABLE OVERRIDES');
  console.log('   TEST_MODE=<mode>                 # Set specific test mode');
  console.log('   VISUAL_TESTS_ENABLED_IN_CI=1    # Enable visual tests in CI');
  console.log('   LIGHTWEIGHT_TESTS=true          # Enable lightweight mode');
  console.log('   RUN_ALL_BROWSERS=1              # Run tests on all browsers');
  console.log('   PLAYWRIGHT_TEST_GREP=<pattern>  # Only run tests matching pattern');
  console.log('   PLAYWRIGHT_TEST_GREP_INVERT=<pattern> # Skip tests matching pattern');
  
  console.log('\n✅ Test mode information displayed successfully');
}

// Run if called directly
if (require.main === module) {
  main();
}