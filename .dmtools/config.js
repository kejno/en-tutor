module.exports = {
    repository: { owner: 'kejno', repo: 'en-tutor' },
    jira: {
        project: 'ET',
        parentTicket: '',
        fields: { failedReasonId: 'customfield_10177' }
    },
    git: { baseBranch: 'main' },
    agentConfigsDir: '.dmtools/agents',
    scm: { provider: 'github' }
};
