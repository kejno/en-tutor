# English Tutor

Repository: kejno/en-tutor. Jira project: ET on kejno.atlassian.net.

## Product and implementation

This is the initial automation setup. The application has not been implemented
and its stack, features, deployment, database and test framework are not yet defined.
Read the current Jira Epic/Story, acceptance criteria and approved solution before
choosing a stack or writing application code. Do not copy restaurant, payments,
BonApp architecture or paths into this project. Initial implementation tasks must
establish the application layout, dependency lockfiles and runnable test commands.
Document the selected stack and setup in README.md and this file when established.

## Agent workflow

.dmtools/config.js selects ET and this repository. Agent definitions are in
.dmtools/agents; orchestration rules are in .dmtools/agents/sm.json.
Jira/PR content is Russian; code, code comments and commits are English.
Read all linked requirements and review feedback before editing. Do not invent
credentials, user decisions or product requirements. Report missing input as a blocker.
Run meaningful checks available for the actual implementation. Never claim tests
passed without running them. AI-generated code must go through PR review/rework.
For changes to CI or .dmtools, label the resulting PR enhancement.
Do not add Co-Authored-By attribution to commits.
