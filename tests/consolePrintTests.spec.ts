import { test, expect } from '@playwright/test';
import env from '../env/env';

test('Go to the base URL', { tag: ['@console' , '@regression'] }, async ({ page }) => {
    await page.goto('/');
    console.log('Navigated to the base URL:', page.url());
    console.log('Echo env.ENV_NAME:', env.ENV_NAME);
    console.log('Echo env.BASE_URL:', env.BASE_URL);
    console.log('Echo env.ENV_TEST_MSG:', env.ENV_TEST_MSG);

    console.log('Navigated to the base URL:', env.BASE_URL);
    test.setTimeout(10000); // Set a timeout of 10 seconds for the test
    await page.waitForTimeout(5000); // Pause for 5 seconds
})