// setup the environment variables before running the tests

import dotenv from 'dotenv';
import { FullConfig } from 'playwright/test';

async function globalSetup(config: FullConfig) {
    const testEnv = process.env.TEST_ENV || 'sits';

    dotenv.config({ 
        path: `env/.env.${testEnv}`,
        override: true
    });
}

export default globalSetup;

