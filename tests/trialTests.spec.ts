import { test, expect } from '@playwright/test';
import env from '../env/env.ts';

test('Go to the base URL', async ({ page }) => {
    await page.goto('/');
    console.log('Navigated to the base URL:', page.url());
    console.log('Navigated to the base URL:', env.BASE_URL);
    test.setTimeout(10000); // Set a timeout of 10 seconds for the test
    await page.waitForTimeout(5000); // Pause for 5 seconds
})