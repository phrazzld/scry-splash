import { test, expect } from '@playwright/test'
import { SplashPage } from '../page-objects/SplashPage.pom'

test.describe('Splash Page Load Tests', () => {
  test('should navigate to the base URL and display main elements', async ({ page }) => {
    const splashPage = new SplashPage(page)
    
    // Navigate to the splash page
    await splashPage.navigate()
    
    // Assert main headline is visible and contains expected text
    const headline = splashPage.getHeadline()
    await expect(headline).toBeVisible()
    // The headline will contain "Remember" as static text followed by dynamic typewriter text
    await expect(headline).toContainText('Remember')
    
    // Assert CTA form section is visible
    await expect(await splashPage.isCtaSectionVisible()).toBe(true)
    
    // Assert footer is visible
    await expect(await splashPage.isFooterVisible()).toBe(true)
  })
  
  test('should take a visual screenshot of the splash page', async ({ page }) => {
    const splashPage = new SplashPage(page)
    
    // Navigate to the splash page
    await splashPage.navigate()
    
    // Wait for animations to complete
    await page.waitForTimeout(2000)
    
    // Take a screenshot
    await expect(page).toHaveScreenshot('splash-page-stable.png')
  })
})