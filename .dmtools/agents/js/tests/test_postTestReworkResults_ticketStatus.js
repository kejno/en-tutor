const assert = require('assert');
const postRework = require('../postTestReworkResults.js');

const focusedPassWithFailingSuite = postRework.resolveTicketResult({
    testCaseKey: 'ET-38',
    status: 'passed',
    passed: 3,
    failed: 0,
    suiteStatus: 'failed',
    suiteFailures: ['ET-37', 'BNP-575']
}, 'ET-38');

assert.strictEqual(focusedPassWithFailingSuite.error, undefined);
assert.strictEqual(focusedPassWithFailingSuite.status, 'passed',
    'unrelated shared-suite failures must not mark ET-38 failed');

const focusedFailure = postRework.resolveTicketResult({
    testCaseKey: 'ET-37',
    status: 'failed',
    suiteStatus: 'failed'
}, 'ET-37');
assert.strictEqual(focusedFailure.status, 'failed',
    'a focused product failure must remain failed for its own Test Case');

const missingScope = postRework.resolveTicketResult({ status: 'failed' }, 'ET-38');
assert(missingScope.error && missingScope.error.indexOf('testCaseKey') !== -1,
    'an unscoped shared-suite result must be rejected');

const wrongScope = postRework.resolveTicketResult({
    testCaseKey: 'ET-37',
    status: 'failed'
}, 'ET-38');
assert(wrongScope.error && wrongScope.error.indexOf('ET-37') !== -1,
    'a result for another Test Case must be rejected');

const unsupportedStatus = postRework.resolveTicketResult({
    testCaseKey: 'ET-38',
    status: 'blocked_by_human'
}, 'ET-38');
assert(unsupportedStatus.error && unsupportedStatus.error.indexOf('passed') !== -1,
    'unsupported statuses must not silently become Failed');

console.log('Per-Test-Case rework status tests passed');
