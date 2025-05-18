import { type Page, type Locator } from '@playwright/test'

/**
 * Page Object Model for the CTA Form component
 */
export class CtaForm {
  private readonly page: Page
  
  // Selectors
  private readonly emailInputSelector = 'input[type="email"]'
  private readonly submitButtonSelector = 'button[type="submit"]'
  private readonly successMessageText = 'Thank you! Your email has been submitted successfully. We\'ll be in touch soon.'
  private readonly errorMessageText = 'Sorry, there was an error submitting your email. Please try again.'

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Fill the email input field
   * @param email - The email address to enter
   */
  async fillEmail(email: string): Promise<void> {
    await this.page.fill(this.emailInputSelector, email)
  }

  /**
   * Submit the form by clicking the submit button
   */
  async submit(): Promise<void> {
    const button = this.page.locator(this.submitButtonSelector)
    const buttonText = await button.textContent()
    const buttonEnabled = await button.isEnabled()
    
    console.log(`[CtaForm] Submitting form - button text: "${buttonText}", enabled: ${buttonEnabled}`)
    
    // Check current form state before submit
    const emailValue = await this.page.locator(this.emailInputSelector).inputValue()
    console.log(`[CtaForm] Email input value before submit: "${emailValue}"`)
    
    await button.click()
    console.log('[CtaForm] Submit button clicked')
  }

  /**
   * Get the success message element
   * @returns Locator for the success message
   */
  getSuccessMessage(): Locator {
    console.log(`[CtaForm] Looking for success message: "${this.successMessageText}"`)
    return this.page.getByText(this.successMessageText)
  }

  /**
   * Get the client-side error message element
   * @returns Locator for the error message
   */
  getClientSideErrorMessage(): Locator {
    console.log(`[CtaForm] Looking for error message: "${this.errorMessageText}"`)
    return this.page.getByText(this.errorMessageText)
  }
}