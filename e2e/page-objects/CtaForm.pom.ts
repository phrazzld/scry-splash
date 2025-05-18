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
    await this.page.click(this.submitButtonSelector)
  }

  /**
   * Get the success message element
   * @returns Locator for the success message
   */
  getSuccessMessage(): Locator {
    return this.page.getByText(this.successMessageText)
  }

  /**
   * Get the client-side error message element
   * @returns Locator for the error message
   */
  getClientSideErrorMessage(): Locator {
    return this.page.getByText(this.errorMessageText)
  }
}