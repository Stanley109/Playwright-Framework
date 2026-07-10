## Notes
1. `npm init playwright@latest` to initialize your repository
2. `npx playwright test --project=chromium --headed` to only run the test with chromium and in headed mode
3. Alternatively, you can run `npm run test:chrome headless` or `npm run test:chrome headed` as configurd in package.json
4. `npm install dotenv` so that env files can be read and process.env variables can be loaded
5. `npm install -D @types/node` or `npm install --save-dev @types/node` so that it can identify what 'process' contains

