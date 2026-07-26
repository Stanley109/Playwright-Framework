import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';
import { APILogger } from './api-logger';

// Declare the custom fixtures that will be added to Playwright's built-in fixtures.
// This is for TypeScript only so it knows that `test` now has an `api` fixture.
type TestOptions = {
    api: RequestHandler;
    apiBaseUrl: string
};

// Create a new Playwright `test` object by extending the built-in one.
// The new `test` includes all default fixtures (page, browser, context, etc.) plus the custom `api` fixture. 
//IMPORTANT NOTE: Fixtures are called per test. not per whole test run
export const test = base.extend<TestOptions>({

    // Define how the `api` fixture is created before each test. {request} is also part of the import {test} @playwright fixtures just like {page, browser}
    api: async ({request}, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api'
        const logger = new APILogger()
        const requestHandler = new RequestHandler(request, baseUrl, logger);

        // Provide the fixture instance to the test. Code after `use()` runs after the test completes (cleanup).
        await use(requestHandler);
    },

    //This is just an example demonstration of another extra fixture. But this is only simple. A string that contains the url. 
    apiBaseUrl: async ({}, use) => {
        await use("https://conduit-api.bondaracademy.com/api");
    }
    
});