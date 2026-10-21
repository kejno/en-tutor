const assert = require('assert');
const configLoader = require('../configLoader.js');
const gh = require('../common/githubHelpers.js');
const gitOps = require('../common/gitOps.js');
const fetchQuestionsToInput = require('../fetchQuestionsToInput.js');
const fetchLinkedBugsToInput = require('../fetchLinkedBugsToInput.js');
const setup = require('../preCliTestReworkSetup.js');
const agentConfig = require('../../pr_test_automation_rework.json');

const originals = {
    loadProjectConfig: configLoader.loadProjectConfig,
    createScm: configLoader.createScm,
    getPRDetails: gh.getPRDetails,
    fetchDiscussionsAndRawData: gh.fetchDiscussionsAndRawData,
    checkoutPRBranch: gitOps.checkoutPRBranch,
    detectMergeConflicts: gitOps.detectMergeConflicts,
    getPRDiff: gitOps.getPRDiff,
    writePRContext: gitOps.writePRContext,
    fetchQuestions: fetchQuestionsToInput.action,
    fetchLinkedBugs: fetchLinkedBugsToInput.action
};

const calls = {
    listedStates: [],
    checkedOutBranches: [],
    comments: []
};

const config = {
    workingDir: '.',
    git: { baseBranch: 'main' },
    jira: {
        issueTypes: { STORY: 'Story', BUG: 'Bug', TEST_CASE: 'Test Case' }
    }
};

const storyPr = {
    number: 8,
    title: '[QA] ET-8 Story tests',
    html_url: 'https://github.com/kejno/en-tutor/pull/8',
    head: { ref: 'test/ET-8' },
    base: { ref: 'main' }
};

try {
    assert.strictEqual(
        Object.prototype.hasOwnProperty.call(agentConfig.params.customParams, 'checkOpenPR'),
        false,
        'generic pre-action PR guard must not inspect a Test Case key'
    );

    configLoader.loadProjectConfig = () => config;
    configLoader.createScm = () => ({
        getRemoteRepoInfo: () => ({ owner: 'kejno', repo: 'en-tutor' }),
        listPrs: state => {
            calls.listedStates.push(state);
            return state === 'open' ? [storyPr] : [];
        }
    });
    gh.getPRDetails = (_scm, prNumber) => {
        assert.strictEqual(prNumber, 8);
        return storyPr;
    };
    gh.fetchDiscussionsAndRawData = () => ({ markdown: '', rawThreads: [] });
    gitOps.checkoutPRBranch = branchName => {
        calls.checkedOutBranches.push(branchName);
        return { branch: branchName, hadConflict: false };
    };
    gitOps.detectMergeConflicts = () => [];
    gitOps.getPRDiff = () => 'diff';
    gitOps.writePRContext = () => {};
    fetchQuestionsToInput.action = () => {};
    fetchLinkedBugsToInput.action = () => {};

    global.jira_get_ticket = value => {
        assert.strictEqual(value.key, 'ET-30');
        return {
            fields: {
                issuetype: { name: 'Test Case' },
                issuelinks: [{
                    outwardIssue: {
                        key: 'ET-8',
                        fields: { issuetype: { name: 'Story' } }
                    }
                }]
            }
        };
    };
    global.jira_post_comment = value => calls.comments.push(value);
    global.cli_execute_command = () => '';

    const result = setup.action({ inputFolderPath: 'input/ET-30' });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.prNumber, 8);
    assert.strictEqual(result.branchName, 'test/ET-8');
    assert.deepStrictEqual(calls.listedStates, ['open']);
    assert.deepStrictEqual(calls.checkedOutBranches, ['test/ET-8']);
    assert(calls.comments.some(value => value.key === 'ET-30' && value.comment.indexOf('PR #8') !== -1));
} finally {
    configLoader.loadProjectConfig = originals.loadProjectConfig;
    configLoader.createScm = originals.createScm;
    gh.getPRDetails = originals.getPRDetails;
    gh.fetchDiscussionsAndRawData = originals.fetchDiscussionsAndRawData;
    gitOps.checkoutPRBranch = originals.checkoutPRBranch;
    gitOps.detectMergeConflicts = originals.detectMergeConflicts;
    gitOps.getPRDiff = originals.getPRDiff;
    gitOps.writePRContext = originals.writePRContext;
    fetchQuestionsToInput.action = originals.fetchQuestions;
    fetchLinkedBugsToInput.action = originals.fetchLinkedBugs;
    delete global.jira_get_ticket;
    delete global.jira_post_comment;
    delete global.cli_execute_command;
}

console.log('Test rework resolves parent Story PR tests passed');
