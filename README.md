# English Tutor

Initial FluentAI landing page for the English Tutor project.

## Development

The application uses React, TypeScript and Vite. Unit tests run with Vitest;
the browser path is covered by Playwright.

```bash
npm install
npm run dev
npm test
npm run test:e2e
npm run build
```

The email forms intentionally show a local confirmation only. No address is
sent or stored because a server API is not part of this story.

- Jira: [English Tutor (ET)](https://kejno.atlassian.net/jira/software/c/projects/ET/boards/100)
- Repository: kejno/en-tutor
- Agent provider: Claude Code
- Pipeline: Epic intake → Story clarification/analysis → solution → development →
  PR review/rework → merge → test generation/automation → Done, with Bug recovery.

## Start work

Create an Epic in ET in Backlog or To Do with a product description and constraints.
Use umbrella_epic only for a product-level Epic that should create feature Epics.
Run the SM Agent workflow manually once. SM_AGENT_TRIGGER_MODE=after_all continues
orchestration after AI Teammate workflows finish. No product backlog is created by
this bootstrap, and the closed dmtools_setup_check tickets are only Jira verification.

## Configuration

.dmtools/config.js targets ET and kejno/en-tutor. Jira Failed Reason field is
customfield_10177. All required fields/workflows have been verified through Jira API
and dmtools. Read CLAUDE.md for the implementation instructions.

GitHub Actions secrets: JIRA_EMAIL, JIRA_API_TOKEN, GH_PROJECT_TOKEN,
CLAUDE_CODE_OAUTH_TOKEN. Variables: JIRA_BASE_PATH, AI_AGENT_PROVIDER,
SM_AGENT_TRIGGER_MODE. The project PAT must allow repository writes and workflow
dispatch. Do not commit .env, tokens, provider authentication or dmtools caches.

AI jobs prepare project dependencies only when package.json and package-lock.json
exist. Add the actual application's setup requirements once its stack is selected.
Codex provider files are retained from the shared agents but its credentials are
not installed or enabled by this setup.

## Validation and maintenance

The bootstrap includes agent unit tests under .dmtools/agents/js/tests. Run them
with Node.js. The SM Agent can scan ET without invoking the AI provider when there
are no actionable tickets. Changing the SM rules may dispatch real agent jobs.

Board columns still require mapping in Jira Board settings → Columns. Public Jira
Board REST API does not expose column updates; this does not block dmtools JQL.

## Origin

The shared agents were imported from the working BonApp dmtools pipeline and
adapted to an empty repository: ET ticket defaults, generic test globs, generic
application instructions and project-independent CI setup. No BonApp application
code or secrets are included.
