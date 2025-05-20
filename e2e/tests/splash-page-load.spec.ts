import { expect } from '@playwright/test'
import { SplashPage } from '../page-objects/SplashPage.pom'
import { 
  withErrorReporting, 
  createTestLogger,
  addTestAttachments,
  waitForAnimationsComplete,
  debugLog,
  waitForNetworkIdle,
  initializeDebugEnvironment
} from '../utils/enhanced-testing'

// Use the enhanced test fixture for better error reporting
const enhancedTest = withErrorReporting;

enhancedTest.describe('Splash Page Load Tests', () => {
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
  
  enhancedTest('should take a visual screenshot of the splash page', async ({ page }, testInfo) => {
    const logger = createTestLogger(testInfo.title)
    logger.start()
    
    // Initialize page objects
    const splashPage = new SplashPage(page)
    
    // Navigate with enhanced reliability
    logger.step('Navigating to splash page')
    await splashPage.navigate(testInfo)
    
    // Wait for network idle first to ensure all resources loaded
    await waitForNetworkIdle(page, 10000);
    
    // Wait for animations to complete with improved reliability
    logger.step('Waiting for animations to complete')
    await waitForAnimationsComplete(page)
    
    // Add additional timeout to ensure any typewriter animations complete
    logger.info('Adding additional delay for typewriter animations')
    await page.waitForTimeout(2000)
    logger.success('Animations have completed')
    
    // Take a screenshot with improved reliability and increased threshold for CI
    logger.step('Taking screenshot for visual regression')
    await expect(page).toHaveScreenshot('splash-page-stable.png', {
      timeout: 15000, // Increase timeout for screenshot comparison
      threshold: 0.3, // More tolerant threshold for CI differences
      maxDiffPixelRatio: 0.02 // Allow for minor differences
    })
    logger.success('Screenshot captured and compared')
    
    logger.end('passed')
  })
  
  // After each test, confirm we created proper artifacts
  enhancedTest.afterEach(async ({}, testInfo) => {
    debugLog(`Test completed: ${testInfo.title}`);
  });
})