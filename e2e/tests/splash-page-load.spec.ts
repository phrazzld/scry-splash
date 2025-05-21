import { expect } from '@playwright/test'
import { SplashPage } from '../page-objects/SplashPage.pom'
import { 
  createTestLogger,
  addTestAttachments,
  debugLog,
  waitForNetworkIdle,
  initializeDebugEnvironment
} from '../utils/enhanced-testing'
import {
  expectScreenshot,
  expectScreenshotForViewports,
  StandardViewport
} from '../utils/visual-testing'
import {
  enhancedTest,
  enhancedModeratelyFlakyTest,
  enhancedHighlyFlakyTest
} from '../utils/test-segmentation'

enhancedTest.describe('Splash Page Load Tests @stable', () => {
  // Initialize the environment before running tests
  enhancedTest.beforeEach(async ({}, testInfo) => {
    await initializeDebugEnvironment(testInfo);
    debugLog(`Starting test: ${testInfo.title}`);
  });

  enhancedTest('should navigate to the base URL and display main elements', async ({ page }, testInfo) => {
    const logger = createTestLogger(testInfo.title)
    logger.start()
    
    // Initialize page objects
    const splashPage = new SplashPage(page)
    
    // Navigate with enhanced reliability
    logger.step('Navigating to splash page')
    await splashPage.navigate(testInfo)
    
    // Assert with better error reporting
    logger.step('Verifying main headline')
    const headline = await splashPage.getHeadline(testInfo)
    await expect(headline).toBeVisible()
    // The headline will contain "Remember" as static text followed by dynamic typewriter text
    await expect(headline).toContainText('Remember')
    logger.success('Headline verified')
    
    // Check for form with retry logic
    logger.step('Verifying CTA form visibility')
    const ctaVisible = await splashPage.isCtaSectionVisible(testInfo)
    expect(ctaVisible).toBe(true)
    logger.success('CTA form is visible')
    
    // Check for footer with better error handling
    logger.step('Verifying footer visibility')
    const footerVisible = await splashPage.isFooterVisible(testInfo)
    expect(footerVisible).toBe(true)
    logger.success('Footer is visible')
    
    // Wait for network to become idle to ensure stability
    await waitForNetworkIdle(page, 5000);
    
    // Add rich attachments to test report
    await addTestAttachments(page, testInfo)
    
    logger.end('passed')
  })
  
  enhancedModeratelyFlakyTest('should take a visual screenshot of the splash page', async ({ page }, testInfo) => {
    const logger = createTestLogger(testInfo.title)
    logger.start()
    
    // Initialize page objects
    const splashPage = new SplashPage(page)
    
    // Navigate with enhanced reliability
    logger.step('Navigating to splash page')
    await splashPage.navigate(testInfo)
    
    // Using the new visual testing helpers for more reliable visual comparison
    logger.step('Taking screenshot for visual regression using enhanced visual testing')
    
    // Take a single screenshot with desktop viewport using the new helper
    await expectScreenshot(page, testInfo, 'splash-page-stable', {
      viewport: StandardViewport.Desktop,
      // Increase animation waiting time for typewriter effect
      animationTimeout: 7000,
      // Use threshold settings optimized for pages with animations
      thresholdPreset: 'lenient',
      // Add extra stability delay for typewriter animations
      stabilityDelay: 2000,
      // Mask specific elements that might change between runs if needed
      mask: [
        // Example: uncomment if typewriter text causes flakiness
        // page.locator('.typewriter-text') 
      ]
    })
    
    logger.success('Desktop screenshot captured and compared')
    
    logger.end('passed')
  })
  
  enhancedHighlyFlakyTest('should display correctly across different viewports', async ({ page }, testInfo) => {
    const logger = createTestLogger(testInfo.title)
    logger.start()
    
    // Initialize page objects
    const splashPage = new SplashPage(page)
    
    // Navigate with enhanced reliability
    logger.step('Navigating to splash page')
    await splashPage.navigate(testInfo)
    
    // Test across multiple viewport sizes
    logger.step('Taking screenshots across multiple viewports')
    
    // Test the splash page in multiple viewport sizes at once
    await expectScreenshotForViewports(
      page, 
      testInfo, 
      'splash-page-responsive',
      [
        StandardViewport.Mobile,
        StandardViewport.Tablet,
        StandardViewport.Desktop
      ],
      {
        // Use threshold settings optimized for pages with animations
        thresholdPreset: 'lenient',
        // Animation settings for reliable capture
        animationTimeout: 7000,
        stabilityDelay: 2000
      }
    )
    
    logger.success('Multi-viewport screenshots captured and compared')
    logger.end('passed')
  })
  
  // After each test, confirm we created proper artifacts
  enhancedTest.afterEach(async ({}, testInfo) => {
    debugLog(`Test completed: ${testInfo.title}`);
  });
})