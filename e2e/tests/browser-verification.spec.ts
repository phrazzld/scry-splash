import { test } from '@playwright/test';

/**
 * Browser verification test
 * 
 * This simple test verifies that the browser can launch correctly.
 * It's used in the CI workflow as an explicit verification step
 * to ensure the Chromium installation is working properly.
 */
test('browser verification test', async ({ page }) => {
  // Navigate to a blank page - this will fail if browser cannot launch
  await page.goto('about:blank');
  
  // Log some browser information
  const userAgent = await page.evaluate(() => navigator.userAgent);
  const windowSize = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));
  
  console.log('Browser verification successful:');
  console.log(`- User Agent: ${userAgent}`);
  console.log(`- Window Size: ${windowSize.width}x${windowSize.height}`);
  
  // A browser that can navigate and execute JavaScript is considered working
  test.expect(userAgent).toBeTruthy();
});