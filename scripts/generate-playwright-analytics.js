// This script:
// 1. Parses the Playwright test results artifact.
// 2. Saves the current run as a historical JSON file.
// 3. Reads all historical JSON files.
// 4. Generates docs/data.js containing all historical runs to influence the index.html for analytics purposes.

const fs = require('fs');
const path = require('path');


// ============================================================
// 1. Parse Playwright results from the GitHub Actions Runner artifact
// ============================================================
// Description - This block reads the Playwright test results from a JSON file, calculates the total number of tests, passed tests, failed tests, skipped tests, flaky tests, and the pass rate. 
// It then creates a `result` object containing this information along with metadata such as run ID, run number, timestamp, branch, and trigger.
// IMPORTANT NOTE: YOU CANNOT SEE `reporthPath` IN YOUR LOCAL ENVIRONMENT. THIS IS ONLY VISIBLE IN THE GITHUB ACTIONS ENVIRONMENT. (refer to the master branch's deploy-pages.yml file for more information)
// ============================================================

const reportPath = './data/playwright-report.json';    //remove the './data/ if you want to run this script locally, but you will need to generate the playwright-report.json file first by running the tests and saving the report.

const report = JSON.parse(
    fs.readFileSync(reportPath, 'utf8')
);

const metadata = JSON.parse(
    fs.readFileSync('./data/analytics-metadata.json', 'utf8')   //remove the './data/ if you want to run this script locally, but you will need to generate the analytics-metadata.json file first by running the tests and saving the report.
);

const total = report.stats.expected
    + report.stats.unexpected
    + report.stats.skipped
    + report.stats.flaky;

const flaky = report.stats.flaky;
const passed = report.stats.expected;
const failed = report.stats.unexpected;
const skipped = report.stats.skipped;

const passRate = total === 0
    ? 0
    : Number(((passed / total) * 100).toFixed(2));


// Description: Process the Playwright JSON report recursively to extract test information.
//
// IMPORTANT NOTE:
// Currently, the test structure for this repo is that UI-tests use test.describe()
// while API-tests do not.
//
// Therefore, in the Playwright JSON report:
// UI-tests:  Suites > Suites > Specs > Tests
// API-tests: Suites > Specs > Tests
//
// The recursive processSuite() function handles both structures.
// If a suite contains nested suites, it processes those nested suites recursively.

const tests = [];

const processSuite = (suite) => {
                                              
    for (const spec of suite.specs || []) {       // loops through each spec in the suite. If there are no specs, use an empty array [] to prevent a crash.
                                                 
        for (const test of spec.tests || []) {         //looping throught the actual tests

            const finalResult =                        // gets the latest test attempt, so retries are represented by their final result
                test.results[test.results.length - 1];

            tests.push({
                name: spec.title,                       //parses the test title eg. 'Random Card button is visible after 3 iterations'
                file: spec.file,                        //parses the file location eg. 'tests-ui/smoke.spec.ts'
                line: spec.line,                        //parses the line number of the test  eg.  '41'
                column: spec.column,                    //parses the column number of the test  eg.  '9'
                projectId: test.projectId,              //parses the projectId  eg. 'ui-tests' or 'api-tests'
                status: test.status === 'expected'      //parses the status. 'expected' is 'passed' for playwright json hence we print it as 'passed'
                    ? 'passed'
                    : test.status,
                duration: finalResult?.duration || 0
            });
        }
    }

    for (const nestedSuite of suite.suites || []) {   //This is for the UI-tests. Since our ui-tests structure is suites > suites > tests.
        processSuite(nestedSuite);
    }
};

for (const suite of report.suites) {    //this is the starting point of processSuite(). loop iterates through the  suites of the playwright json. there are 2: ui-tests and api-tests.
    processSuite(suite);
}

const result = {
    runId: process.env.PLAYWRIGHT_RUN_ID || null,
    runNumber: process.env.PLAYWRIGHT_RUN_NUMBER || null,
    timestamp: new Date().toISOString(),
    branch: process.env.PLAYWRIGHT_BRANCH || null,
    env: metadata.environment || null,
    suite: metadata.suite || null,
    trigger: process.env.PLAYWRIGHT_TRIGGER || null,

    total,
    passed,
    failed,
    skipped,
    flaky,
    passRate,
    duration: report.stats.duration,
    tests
};

console.log('Current run:');
console.log(result);


// ============================================================
// 2. Save current run as historical JSON
// ============================================================
// Description - This block creates a directory called 'playwright_results' if it doesn't already exist. 
// It then saves the current run's `result` object (from step 1) as a JSON file in that directory, with the filename based on the timestamp of the run. 
// The filename is formatted to replace colons and periods with hyphens to ensure compatibility with file systems.
// ============================================================

const resultsDirectory = './playwright_results';

fs.mkdirSync(resultsDirectory, { recursive: true });

const filename = `${result.timestamp.replace(/[:.]/g, '-')}.json`;

fs.writeFileSync(
    path.join(resultsDirectory, filename),
    JSON.stringify(result, null, 2)
);

console.log(`Saved historical result: ${filename}`);


// ============================================================
// 3. Read then sort all historical JSON files
// ============================================================
// Description - This block reads all JSON files in the 'playwright_results' directory, parses them, and stores them in an array called `runs`.
// Then, it sorts the array of runs in descending order based on the timestamp, so that the most recent run appears first in the array.
// ============================================================

const files = fs.readdirSync(resultsDirectory)
    .filter(file => file.endsWith('.json'));

const runs = files.map(file => {
    const filePath = path.join(resultsDirectory, file);

    return JSON.parse(
        fs.readFileSync(filePath, 'utf8')
    );
});

runs.sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
);


// ============================================================
// 4. Generate docs/data.js
// ============================================================
// Description - Finally, this block generates a JavaScript file called 'docs/data.js' that contains the array of historical runs.
// ============================================================

const outputFile = './docs/data.js';

fs.writeFileSync(
    outputFile,
    `const historicalRuns = ${JSON.stringify(runs, null, 2)};`
);

console.log(
    `Generated ${outputFile} with ${runs.length} historical runs.`
);