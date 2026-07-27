// setup the environment variables before running the tests

import dotenv from 'dotenv';
import { FullConfig } from 'playwright/test';

async function globalSetup() {
    const testEnv = process.env.TEST_ENV || 'sit';

    if (!process.env.CI) {                   //only process the local .env file if this repo is ran locally. Otherwise if using github actions, the variables stored there will be used instead
        dotenv.config({ 
            path: `env/.env.${testEnv}`,
            override: true
        });
    }
}

export default globalSetup;

