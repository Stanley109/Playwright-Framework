# Playwright-Framework
A playwright framework with CICD using github actions.

## Notes
1. `npm init playwright@latest` to initialize your repository
2. `npx playwright test --project=chromium --headed` to only run the test with chromium and in headed mode
3. Alternatively, you can run `npm run test:chrome headless` or `npm run test:chrome headed` as configurd in package.json
4. `npm install dotenv` so that env files can be read and process.env variables can be loaded
5. `npm install -D @types/node` or `npm install --save-dev @types/node` so that it can identify what 'process' contains
6. `npm install cross-env` so that user can use cross-env; which can invoke environment parameters on the go. example: `npx cross-env TEST_ENV=sit playwright test --project=chromium`



## Framework walkthrough
### Handling Environments, Dependencies, Misc, etc
1. We want the user to have a choice whether to run this using sit or uat environment. command is `npx cross-env TEST_ENV=sit playwright test --project=chromium`
2. Starting from the env folder, .env.sit and .env.uat defines the global setup parameters such as environment url, or credentials, etc
3. In `playwright.config.ts`, we need to use playwright's `globalSetup`(line 5) so setup the environment
4. `globalSetup` then points to `global-setup.ts`, which is a function named `globalSetup` that runs dotenv.config() to load all env variables from the env files.
5. `env.ts` is a file that has a constant `env` that contains an object consisting of env properties
6. Any spec file can then use `import env from '../env/env.ts';` to use any env variables

### Handling the actual tests
7.  Page object model is under the page-objects folder. `Spanish-Cards-Class-Styles.ts` is the main page object file while `App.ts` acts as the facade that handles all page object instantiaion.
This is so that spec files only needs to intantiate App.ts 
8.  2 spec files (`smoke.spec.ts` and `standalone-smoke.spec.ts`)were created for comparison of test flow behavior. `smoke.spec.ts` uses before/after all while `standalone-smoke.spec.ts`(better practice) uses before/after each.
9. `smoke.spec.ts` tests are tagged as '@smoke and @regression' while `standalone-smoke.spec.ts` are tagged as '@standalone and @regression'. To run all, run the command:
`npx cross-env TEST_ENV=sit playwright test --project=chromium --headed --grep '@regression'`
9. //TODO: Use Json test data
11. //TODO: Write API tests

### Handling Reporting
11.  //TODO: Install and apply Allure reporting
12.  //TODO: Install and apply Monocart reporting

### Handling CICD
13. //TODO: Create and configure yml file
14. //TODO: Finalize yml and Github Actions integration

