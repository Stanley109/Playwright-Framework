import { test, expect } from '@playwright/test';
import env from '../env/env.ts';

test('Go to the base URL', async ({ page }) => {
    await page.goto('/');
    console.log('Navigated to the base URL:', page.url());
    console.log('Navigated to the base URL:', env.BASE_URL);
    test.setTimeout(20000); // Set a timeout of 20 seconds for the test
    await page.waitForTimeout(10000); // Pause for 10 seconds
})