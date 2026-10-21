# dmtools — English Tutor

## Model fallback for SM agents

An agent may pin a model in its JSON config:

```json
{
  "model": "gpt-6.1-sol",
  "params": {}
}
```

`params.model` is also supported. The priority is agent config, then the SM
rule's optional `model` field, then the repository-level `CODEX_MODEL` variable.
If no local override is present, the global value is used unchanged.

The active project config is config.js: repository kejno/en-tutor, Jira ET.
See the root README.md for prerequisites and starting the pipeline.
Agents share the same Jira types, field names and transition conventions verified
in ET. Manual agent configs default to ET-0 (a nonexistent ticket) to prevent
unintended processing. SM injects the actual inputJql into every dispatched job.

The default agent is Claude Code; provider slot limit is one job. Alternate provider
implementations are present but must be configured explicitly before use.

## Figma context and rate limits

Intake caches token-free Figma node maps and reference images for 24 hours. All
intake runs share one Figma API concurrency lock. On HTTP 429 the fetcher saves
the retry time from Figma and makes no further request before that time; a
`figma_required` Epic remains `Blocked` with the retry time in its diagnostic.

To fill or refresh the cache before running an intake, use GitHub Actions →
**Prewarm Figma context** → **Run workflow**, and provide the Figma design URL.
This workflow reads only `FIGMA_TOKEN`, writes no Jira tickets, and shares the
same lock with intake.

The SM intake rule automatically detects a Figma URL in an Epic, runs this
prewarm workflow first, and dispatches intake only after it succeeds. Epics
without a Figma URL continue through intake directly.

### Local Codex + Figma MCP

When REST is rate-limited, use the authenticated local Figma MCP connection to
produce a compact context containing fileKey, target, and nodeCandidates.
Save that context with:

    node .dmtools/agents/scripts/save-figma-mcp-context.js \
      'https://www.figma.com/design/K9PdCKiEy6r0qSas0Bm1lx/en-app' \
      /path/to/figma-mcp-context.json \
      /path/to/desktop-reference.png

Commit only .dmtools/figma-context/ to the repository. It contains node
metadata and optional reference images, never the Figma token or full document.
The intake fetcher checks this repository snapshot first, then the GitHub
Actions cache, and uses REST only as a last resort. Snapshots are accepted for
seven days by default; refresh them after a significant design change.
