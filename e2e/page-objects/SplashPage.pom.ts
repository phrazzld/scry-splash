import { type Page, type Locator, type TestInfo } from '@playwright/test'
import { BasePage, createTestLogger, waitForPageLoaded, debugLog } from '../utils/enhanced-testing'

/**
 * Page Object Model for the Splash Page
 */
export class SplashPage extends BasePage {
  // Selectors
  private readonly headlineSelector = 'h1'
  private readonly ctaSectionSelector = 'form'
  private readonly footerSelector = 'footer'

  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigate to the splash page with improved reliability
   * @param testInfo Playwright TestInfo object for artifact generation
   * @param options Navigation options
   */
  async navigate(testInfo: TestInfo, options = { timeout: 60000 }): Promise<void> {
    const logger = createTestLogger('SplashPage Navigation')
    logger.start()
    
    logger.step('Navigating to homepage')
    await this.navigateTo('/', testInfo, { timeout: options.timeout })
    
    logger.step('Waiting for page to be fully loaded')
    await waitForPageLoaded(this.page)
    
    logger.success('Navigation complete')
    logger.end('passed')
  }

  /**
   * Get the main headline element with improved reliability
   * @param testInfo Playwright TestInfo object for artifact generation
   * @returns Locator for the headline
   */
  async getHeadline(testInfo: TestInfo): Promise<Locator> {
    debugLog(`Waiting for headline element: ${this.headlineSelector}`);
    return this.waitForElement(this.headlineSelector, testInfo)
  }

  /**
   * Check if the CTA section is visible with retry logic
   * @param testInfo Playwright TestInfo object for artifact generation
   * @returns Boolean indicating visibility
   */
  async isCtaSectionVisible(testInfo: TestInfo): Promise<boolean> {
    try {
      debugLog(`Checking CTA section visibility: ${this.ctaSectionSelector}`);
      await this.waitForElement(this.ctaSectionSelector, testInfo, { timeout: 5000 })
      return true
    } catch (e) {
      debugLog(`CTA section not visible: ${e}`, 'warn');
      return false
    }
  }

  /**
   * Check if the footer is visible with retry logic
   * @param testInfo Playwright TestInfo object for artifact generation
   * @returns Boolean indicating visibility
   */
  async isFooterVisible(testInfo: TestInfo): Promise<boolean> {
    try {
      debugLog(`Checking footer visibility: ${this.footerSelector}`);
      await this.waitForElement(this.footerSelector, testInfo, { timeout: 5000 })
      return true
    } catch (e) {
      debugLog(`Footer not visible: ${e}`, 'warn');
      return false
    }
  }
}