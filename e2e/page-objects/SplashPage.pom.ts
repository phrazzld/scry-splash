import { type Page, type Locator } from '@playwright/test'
import { BasePage, createTestLogger, waitForPageLoaded } from '../utils/enhanced-testing'

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
   * @param options Navigation options
   */
  async navigate(options = { timeout: 60000 }): Promise<void> {
    const logger = createTestLogger('SplashPage Navigation')
    logger.start()
    
    logger.step('Navigating to homepage')
    await this.navigateTo('/', { timeout: options.timeout })
    
    logger.step('Waiting for page to be fully loaded')
    await waitForPageLoaded(this.page)
    
    logger.success('Navigation complete')
    logger.end('passed')
  }

  /**
   * Get the main headline element with improved reliability
   * @returns Locator for the headline
   */
  async getHeadline(): Promise<Locator> {
    return this.waitForElement(this.headlineSelector)
  }

  /**
   * Check if the CTA section is visible with retry logic
   * @returns Boolean indicating visibility
   */
  async isCtaSectionVisible(): Promise<boolean> {
    try {
      await this.waitForElement(this.ctaSectionSelector, { timeout: 5000 })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Check if the footer is visible with retry logic
   * @returns Boolean indicating visibility
   */
  async isFooterVisible(): Promise<boolean> {
    try {
      await this.waitForElement(this.footerSelector, { timeout: 5000 })
      return true
    } catch (e) {
      return false
    }
  }
}