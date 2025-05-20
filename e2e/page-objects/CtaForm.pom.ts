import { type Page, type Locator, type TestInfo } from '@playwright/test'
import { BasePage, createTestLogger, retryClick, retryFill, waitForFormReady } from '../utils/enhanced-testing'

/**
 * Page Object Model for the CTA Form component
 */
export class CtaForm extends BasePage {
  // Selectors
  private readonly emailInputSelector = 'input[type="email"]'
  private readonly submitButtonSelector = 'button[type="submit"]'
  private readonly formSelector = 'form'
  private readonly successMessageSelector = '[data-testid="cta-success-message"]'
  private readonly errorMessageSelector = '[data-testid="cta-error-message"]'
  private readonly errorMessageText = 'Sorry, there was an error submitting your email. Please try again.'

  constructor(page: Page) {
    super(page)
  }

  /**
   * Fill the email input field with enhanced reliability
   * @param email - The email address to enter
   * @param testInfo - Playwright TestInfo object for artifact generation
   */
  async fillEmail(
    email: string, 
    testInfo: TestInfo,
    options = { timeout: 30000, retries: 2 }
  ): Promise<void> {
    const logger = createTestLogger('CtaForm.fillEmail')
    logger.step(`Filling email field with "${email}"`)
    
    await waitForFormReady(this.page, testInfo, this.formSelector, { timeout: options.timeout })
    await retryFill(this.page.locator(this.emailInputSelector), email, {
      timeout: options.timeout,
      retries: options.retries,
      description: `fill email field with "${email}"`
    })
    
    logger.success('Email field filled successfully')
  }

  /**
   * Submit the form by clicking the submit button with enhanced reliability
   * @param testInfo - Playwright TestInfo object for artifact generation
   */
  async submit(
    testInfo: TestInfo,
    options = { timeout: 30000, retries: 2 }
  ): Promise<void> {
    const logger = createTestLogger('CtaForm.submit')
    logger.start()
    
    logger.step('Preparing to submit form')
    
    // Wait for form to be ready
    await waitForFormReady(this.page, testInfo, this.formSelector, { timeout: options.timeout })
    
    // Get button information for logging
    const button = this.page.locator(this.submitButtonSelector)
    await button.waitFor({ state: 'visible', timeout: options.timeout })
    
    const buttonText = await button.textContent()
    const buttonEnabled = await button.isEnabled()
    logger.info(`Submit button found - text: "${buttonText}", enabled: ${buttonEnabled}`)
    
    // Get current form state
    const emailValue = await this.page.locator(this.emailInputSelector).inputValue()
    logger.info(`Email input value: "${emailValue}"`)
    
    // Click with retry logic
    logger.step('Clicking submit button')
    await retryClick(button, { 
      timeout: options.timeout,
      retries: options.retries,
      description: 'click submit button'
    })
    
    logger.success('Form submitted')
    logger.end('passed')
  }

  /**
   * Get the success message element
   * @returns Locator for the success message
   */
  getSuccessMessage(): Locator {
    return this.page.getByTestId('cta-success-message')
  }

  /**
   * Wait for success message to appear with enhanced reliability
   * @param testInfo - Playwright TestInfo object for artifact generation
   * @param timeout - Time in milliseconds to wait (default: 30000)
   * @returns The success message locator
   */
  async waitForSuccessMessage(
    testInfo: TestInfo,
    timeout = 30000
  ): Promise<Locator> {
    const logger = createTestLogger('Wait for Success Message')
    logger.start()
    
    logger.step(`Waiting for success message (timeout: ${timeout}ms)`)
    
    try {
      // Try by data-testid first (preferred method)
      logger.info('Looking for message by data-testid="cta-success-message"')
      const message = await this.waitForElement(this.successMessageSelector, testInfo, { 
        state: 'visible', 
        timeout 
      })
      logger.success('Success message found by data-testid')
      logger.end('passed')
      return message
    } catch (e) {
      // Fall back to text matching as a backup
      logger.warn(`Data-testid selector failed: ${e instanceof Error ? e.message : String(e)}`)
      logger.info('Trying alternative text-based selector')
      
      try {
        const textSelector = this.page.getByText('Thank you! Your email has been submitted successfully')
        await textSelector.waitFor({ state: 'visible', timeout: timeout / 2 })
        logger.success('Success message found by text content')
        logger.end('passed')
        return textSelector
      } catch (textError) {
        // Capture debug information on failure
        const error = textError instanceof Error ? textError : new Error(String(textError))
        logger.error('Failed to find success message by any method', error)
        await this.captureState(testInfo, 'success-message-not-found')
        logger.end('failed')
        throw error
      }
    }
  }

  /**
   * Get the error message element
   * @returns Locator for the error message
   */
  getErrorMessage(): Locator {
    return this.page.getByTestId('cta-error-message')
  }

  /**
   * Wait for error message to appear with enhanced reliability
   * @param testInfo - Playwright TestInfo object for artifact generation
   * @param timeout - Time in milliseconds to wait (default: 30000)
   * @returns The error message locator
   */
  async waitForErrorMessage(
    testInfo: TestInfo,
    timeout = 30000
  ): Promise<Locator> {
    const logger = createTestLogger('Wait for Error Message')
    logger.start()
    
    logger.step(`Waiting for error message (timeout: ${timeout}ms)`)
    
    try {
      // Try by data-testid first (preferred method)
      logger.info('Looking for message by data-testid="cta-error-message"')
      const message = await this.waitForElement(this.errorMessageSelector, testInfo, { 
        state: 'visible', 
        timeout 
      })
      logger.success('Error message found by data-testid')
      logger.end('passed')
      return message
    } catch (e) {
      // Fall back to text matching as a backup
      logger.warn(`Data-testid selector failed: ${e instanceof Error ? e.message : String(e)}`)
      logger.info('Trying alternative text-based selector')
      
      try {
        const textSelector = this.page.getByText('error submitting your email')
        await textSelector.waitFor({ state: 'visible', timeout: timeout / 2 })
        logger.success('Error message found by text content')
        logger.end('passed')
        return textSelector
      } catch (textError) {
        // Capture debug information on failure
        const error = textError instanceof Error ? textError : new Error(String(textError))
        logger.error('Failed to find error message by any method', error)
        await this.captureState(testInfo, 'error-message-not-found')
        logger.end('failed')
        throw error
      }
    }
  }

  /**
   * Get the client-side error message element
   * @returns Locator for the error message
   * @deprecated Use getErrorMessage() instead
   */
  getClientSideErrorMessage(): Locator {
    return this.page.getByText(this.errorMessageText)
  }
}