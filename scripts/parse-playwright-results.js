const fs = require('fs');

const reportPath = './data/playwright-report.json';

const report = JSON.parse(
    fs.readFileSync(reportPath, 'utf8')
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

const result = {
    runId: process.env.GITHUB_RUN_ID || null,
    runNumber: process.env.GITHUB_RUN_NUMBER || null,
    timestamp: new Date().toISOString(),
    branch: process.env.GITHUB_REF_NAME || null,
    trigger: process.env.GITHUB_EVENT_NAME || null,

    total,
    passed,
    failed,
    skipped,
    flaky,
    passRate,
    duration: report.stats.duration
};

console.log(result);

fs.mkdirSync('./playwright_results', { recursive: true });

const filename = `${result.timestamp.replace(/[:.]/g, '-')}.json`;

fs.writeFileSync(
    `./playwright_results/${filename}`,
    JSON.stringify(result, null, 2)
);