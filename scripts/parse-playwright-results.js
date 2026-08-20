const fs = require('fs');

const reportPath = './data/playwright-report.json';

const report = JSON.parse(
    fs.readFileSync(reportPath, 'utf8')
);

const total = report.stats.expected
    + report.stats.unexpected
    + report.stats.skipped;
    + report.stats.flaky;

const flaky = report.stats.flaky;
const passed = report.stats.expected;
const failed = report.stats.unexpected;
const skipped = report.stats.skipped;

const passRate = total === 0
    ? 0
    : Number(((passed / total) * 100).toFixed(2));

console.log({
    total,
    passed,
    failed,
    skipped,
    flaky,
    passRate,
    duration: report.stats.duration
});