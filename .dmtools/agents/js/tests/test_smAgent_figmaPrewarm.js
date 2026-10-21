const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'smAgent.js'), 'utf8');
const dispatched = [];
const config = { repository: { owner: 'kejno', repo: 'en-tutor' }, jira: { project: 'ET' } };
const scm = {
  listWorkflowRuns: () => [],
  triggerWorkflow(owner, repo, workflowFile, payload, ref) {
    dispatched.push({ owner, repo, workflowFile, payload: JSON.parse(payload), ref });
  }
};

const context = {
  module: { exports: {} },
  console,
  encodeURIComponent,
  JSON,
  Date,
  require(id) {
    if (id === './configLoader.js') return {
      loadProjectConfig: () => config,
      interpolateJql: (jql) => jql
    };
    if (id === './common/scm.js') return { createScm: () => scm };
    if (id === './common/buildEncodedConfig.js') return {
      resolveConfigFile: (rule) => rule.configFile,
      resolveAgentModel: () => '',
      buildEncodedConfig: () => 'encoded-config'
    };
    return {};
  },
  jira_search_by_jql: () => [{ key: 'ET-45', fields: { labels: [] } }],
  jira_get_ticket: () => ({
    key: 'ET-45',
    fields: { description: 'Implement https://www.figma.com/design/abc123/English-Tutor?node-id=2-95' }
  }),
  jira_add_label: () => {},
  jira_remove_label: () => {}
};

vm.runInNewContext(source, context);
const result = context.module.exports.action({
  jobParams: {
    rules: [{
      description: 'Figma intake',
      jql: 'project = ET',
      configFile: 'agents/intake.json',
      prewarmFigma: true,
      addLabel: 'sm_epic_intake_triggered',
      enabled: true
    }]
  }
});

assert.strictEqual(result.success, true);
assert.strictEqual(dispatched.length, 1);
assert.strictEqual(dispatched[0].workflowFile, 'prewarm-figma-context.yml');
assert.strictEqual(dispatched[0].payload.ticket_key, 'ET-45');
assert.match(dispatched[0].payload.figma_url, /figma\.com\/design\/abc123/);
const intakePayload = JSON.parse(decodeURIComponent(dispatched[0].payload.intake_payload));
assert.strictEqual(intakePayload.config_file, 'agents/intake.json');
assert.strictEqual(intakePayload.input_jql, 'key = ET-45');

console.log('SM Figma prewarm dispatch checks passed');
