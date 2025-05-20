import { expect } from '@playwright/test'
import { SplashPage } from '../page-objects/SplashPage.pom'
import { 
  withErrorReporting, 
  createTestLogger,
  addTestAttachments,
  waitForAnimationsComplete
} from '../utils/enhanced-testing'

// Use the enhanced test fixture for better error reporting
const enhancedTest = withErrorReporting;

enhancedTest.describe('Splash Page Load Tests', () => {
  enhancedTest('should navigate to the base URL and display main elements', async ({ page }, testInfo) => {
    const logger = createTestLogger(testInfo.title)
    logger.start()
    
    // Initialize page objects
    const splashPage = new SplashPage(page)
    
    // Navigate with enhanced reliability
    logger.step('Navigating to splash page')
    await splashPage.navigate()
    
    // Assert with better error reporting
    logger.step('Verifying main headline')
    const headline = await splashPage.getHeadline()
    await expect(headline).toBeVisible()
    // The headline will contain "Remember" as static text followed by dynamic typewriter text
    await expect(headline).toContainText('Remember')
    logger.success('Headline verified')
    
    // Check for form with retry logic
    logger.step('Verifying CTA form visibility')
    const ctaVisible = await splashPage.isCtaSectionVisible()
    expect(ctaVisible).toBe(true)
    logger.success('CTA form is visible')
    
    // Check for footer with better error handling
    logger.step('Verifying footer visibility')
    const footerVisible = await splashPage.isFooterVisible()
    expect(footerVisible).toBe(true)
    logger.success('Footer is visible')
    
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
    await splashPage.navigate()
    
    // Wait for animations to complete with improved reliability
    logger.step('Waiting for animations to complete')
    await waitForAnimationsComplete(page)
    // Add additional timeout to ensure any typewriter animations complete
    await page.waitForTimeout(2000)
    logger.success('Animations have completed')
    
    // Take a screenshot with improved reliability
    logger.step('Taking screenshot for visual regression')
    await expect(page).toHaveScreenshot('splash-page-stable.png', {
      timeout: 10000, // Increase timeout for screenshot comparison
    })
    logger.success('Screenshot captured and compared')
    
    logger.end('passed')
  })
})