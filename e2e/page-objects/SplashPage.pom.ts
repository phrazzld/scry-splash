import { type Page, type Locator } from '@playwright/test'

/**
 * Page Object Model for the Splash Page
 */
export class SplashPage {
  private readonly page: Page
  
  // Selectors
  private readonly headlineSelector = 'h1'
  private readonly ctaSectionSelector = 'form'
  private readonly footerSelector = 'footer'

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigate to the splash page
   */
  async navigate(): Promise<void> {
    await this.page.goto('/')
  }

  /**
   * Get the main headline element
   * @returns Locator for the headline
   */
  getHeadline(): Locator {
    return this.page.locator(this.headlineSelector)
  }

  /**
   * Check if the CTA section is visible
   * @returns Boolean indicating visibility
   */
  async isCtaSectionVisible(): Promise<boolean> {
    const ctaSection = this.page.locator(this.ctaSectionSelector)
    return ctaSection.isVisible()
  }

  /**
   * Check if the footer is visible
   * @returns Boolean indicating visibility
   */
  async isFooterVisible(): Promise<boolean> {
    const footer = this.page.locator(this.footerSelector)
    return footer.isVisible()
  }
}