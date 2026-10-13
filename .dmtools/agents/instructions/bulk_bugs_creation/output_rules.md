Use actual ticket keys from the input context. `<PROJECT_KEY>` below is a placeholder for their project, not a literal value.

# Bulk Bug Creation Output Rules

## Required JSON

Write `outputs/bulk_bug_decisions.json`:

```json
{
  "processed": ["<PROJECT_KEY>-984", "<PROJECT_KEY>-954", "<PROJECT_KEY>-909"],
  "newBugs": [
    {
      "summary": "...",
      "priority": "High|Medium|Low",
      "descriptionFile": "outputs/bug_001_description.md",
      "linkedTCs": ["<PROJECT_KEY>-984", "<PROJECT_KEY>-954"]
    }
  ],
  "links": [
    { "tcKey": "<PROJECT_KEY>-909", "bugKey": "<PROJECT_KEY>-123" }
  ],
  "skipped": [
    {
      "tcKey": "<PROJECT_KEY>-800",
      "reason": "Detailed reason why this is a test-code issue"
    }
  ]
}
```

### Rules

- `processed` must list every TC the AI made a decision for.
- `newBugs[].descriptionFile` must point to an existing `outputs/bug_NNN_description.md`.
- The description file must incorporate the TC's `failedReason` field and any attached failed-description file content.
- Do not embed multi-line description text directly inside `bulk_bug_decisions.json`.
- Do not output `fixedByBug` — Done bugs are excluded from matching.
- `skipped` must be empty unless the failure is a confirmed test-only issue with no possible product cause. When in doubt, create a bug.
- `skipped[].reason` must be detailed and specific.
