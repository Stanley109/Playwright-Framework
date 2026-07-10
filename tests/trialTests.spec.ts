import { test, expect } from '@playwright/test';

test('Go to the base URL', async ({ page }) => {
    await page.goto('/');
    console.log('Navigated to the base URL:', page.url());
})