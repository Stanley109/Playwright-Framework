# Playwright-Framework
A playwright framework with CICD using github actions.

## Notes
1. `npm init playwright@latest` to initialize your repository
2. `npx playwright test --project=chromium --headed` to only run the test with chromium and in headed mode
3. Alternatively, you can run `npm run test:chrome headless` or `npm run test:chrome headed` as configurd in package.json
4. `npm install dotenv` so that env files can be read and process.env variables can be loaded
5. `npm install -D @types/node` or `npm install --save-dev @types/node` so that it can identify what 'process' contains
6. `npm install cross-env` so that user can use cross-env; which can invoke environment parameters on the go. example: `npx cross-env TEST_ENV=sit playwright test --project=chromium`
7. `tsconfig.json` so that you won't have 'unrecognized libraries' problems


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
10. check `Parse some json data and random generation data` test under `smoke.spec.ts`
11. //TODO: Write API tests


### Handling Reporting
12.  Install Monocart using `npm install --save-dev monocart-reporter`
13.  Add these in the `playwright.config.ts` `['monocart-reporter', { name: 'Playwright Test Report', outputFile: 'monocart-report/index.html'}],`

### Handling CICD
13. Before handling any env, make sure that there is a single point of integration where all env variables are stored in 1 file. In this case, its env.ts.  All file will reference its env values there and nothing else if possible. So that it can be easily handled.
14. Realistically, env files are not pushed to the repository since it contains sensitive data. In this case, we would disable the logic of reading an env file when running this in CI. Under env > `global-setup.ts` , added if (!process.env.CI) to disable it in CI.
15. Now, after that we have to replace all declared `process.env.<variable>` in the CI since we will not use .env in the CI. 
16. To do that, supply the necessary variables under the github repo website > settings > Environments. From there create 2 environment (sit and uat) to mimic the setup of .env files locally. Then in the yml, we can then do something like this 
        env:
            CI: true
            ENV_NAME: ${{secrets.ENV_NAME}}
            BASE_URL: ${{secrets.BASE_URL}}
            ENV_TEST_MSG: ${{vars.ENV_TEST_MSG}}
17. use secrets.<varname> when invoking data stored under secrets while vars.<varname> when invoking environment variable accordingly.
18. After the run, artifacts will be stored as well so that user can view the test results.

