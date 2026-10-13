Use actual ticket keys from the input context. `<PROJECT_KEY>` below is a placeholder for their project, not a literal value.

Example bulk bug decisions output:

```json
{
  "processed": ["<PROJECT_KEY>-984", "<PROJECT_KEY>-954", "<PROJECT_KEY>-909"],
  "newBugs": [
    {
      "summary": "Login button unresponsive on iOS Safari",
      "priority": "High",
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
      "reason": "Flaky CSS selector '.btn-primary' no longer matches after UI refactor — test code issue, not app bug"
    }
  ]
}
```
