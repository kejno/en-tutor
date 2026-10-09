# dmtools — English Tutor

The active project config is config.js: repository kejno/en-tutor, Jira ET.
See the root README.md for prerequisites and starting the pipeline.
Agents share the same Jira types, field names and transition conventions verified
in ET. Manual agent configs default to ET-0 (a nonexistent ticket) to prevent
unintended processing. SM injects the actual inputJql into every dispatched job.

The default agent is Claude Code; provider slot limit is one job. Alternate provider
implementations are present but must be configured explicitly before use.
