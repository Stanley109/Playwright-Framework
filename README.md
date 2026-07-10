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

### Handling Reporting
7.  //TODO: Install and apply Allure reporting
8.  //TODO: Install and apply Monocart reporting

### Handling the actual tests
9.  //TODO: Populate the page objects
10. //TODO: Write multiple tests using multiple locator variations
11. //TODO: Write API tests

### Handling CICD
11. //TODO: Create and configure yml file
12. //TODO: Finalize yml and Github Actions integration

