const assert = require('assert');
const configLoader = require('../configLoader.js');
const scmModule = require('../common/scm.js');
const retryMerge = require('../retryMergePR.js');
const storyReviewConfig = require('../../pr_story_test_automation_review.json');

const originalLoad = configLoader.loadProjectConfig;
const originalCreate = scmModule.createScm;

const calls = { merged: [], moved: [], added: [], removed: [], searches: [] };
const config = {
    jira: {
        issueTypes: { STORY: 'Story', BUG: 'Bug', TEST_CASE: 'Test Case' },
        statuses: {
            IN_REVIEW_PASSED: 'In Review - Passed',
            IN_REVIEW_FAILED: 'In Review - Failed',
            PASSED: 'Passed',
            FAILED: 'Failed',
            IN_REWORK: 'In Rework',
            MERGED: 'Merged'
        }
    }
};

try {
    assert.strictEqual(
        Object.prototype.hasOwnProperty.call(storyReviewConfig.params.customParams, 'checkOpenPR'),
        false,
        'the generic open-PR guard must not block merged-PR reconciliation'
    );

    configLoader.loadProjectConfig = () => config;
    scmModule.createScm = () => ({
        getRemoteRepoInfo: () => ({ owner: 'kejno', repo: 'en-tutor' }),
        listPrs: state => state === 'open' ? [{
            number: 8,
            title: '[QA] ET-8 Story tests',
            html_url: 'https://github.com/kejno/en-tutor/pull/8',
            head: { ref: 'test/ET-8', sha: 'abc123' }
        }] : [],
        getPr: () => ({ mergeable: true, mergeable_state: 'clean' }),
        mergePr: number => calls.merged.push(number),
        removeLabel: (number, label) => calls.removed.push({ number, label })
    });

    global.jira_get_ticket = value => {
        assert.strictEqual(value.key, 'ET-30');
        return {
            key: 'ET-30',
            fields: {
                issuetype: { name: 'Test Case' },
                status: { name: 'In Review - Passed' },
                issuelinks: [{
                    outwardIssue: {
                        key: 'ET-8',
                        fields: { issuetype: { name: 'Story' } }
                    }
                }]
            }
        };
    };
    global.jira_search_by_jql = value => {
        calls.searches.push(value.jql);
        return [
            { key: 'ET-30', fields: { status: { name: 'In Review - Passed' } } },
            { key: 'ET-31', fields: { status: { name: 'In Review - Failed' } } }
        ];
    };
    global.jira_move_to_status = value => calls.moved.push(value);
    global.jira_add_label = value => calls.added.push(value);
    global.jira_remove_label = value => calls.removed.push(value);
    global.jira_post_comment = () => {};

    const result = retryMerge.action({
        ticket: { key: 'ET-30' },
        jobParams: {
            metadata: { contextId: 'retry_merge_test' },
            customParams: { testCaseMerge: true, removeLabel: 'sm_test_merge_triggered' }
        }
    });

    assert.strictEqual(result, true);
    assert.deepStrictEqual(calls.merged, [8]);
    assert(calls.searches.some(jql => jql.indexOf('linkedIssues("ET-8")') !== -1));
    assert(calls.moved.some(value => value.key === 'ET-30' && value.statusName === 'Passed'));
    assert(calls.moved.some(value => value.key === 'ET-31' && value.statusName === 'Failed'));
    assert(calls.added.some(value => value.key === 'ET-8' && value.label === 'test_pr_finalized'),
        'the parent Story must be finalized after its shared test PR is merged');
} finally {
    configLoader.loadProjectConfig = originalLoad;
    scmModule.createScm = originalCreate;
    delete global.jira_get_ticket;
    delete global.jira_search_by_jql;
    delete global.jira_move_to_status;
    delete global.jira_add_label;
    delete global.jira_remove_label;
    delete global.jira_post_comment;
}

console.log('Test merge finalizes parent Story tests passed');
