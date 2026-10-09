Example PR test automation review outputs — keep concise:

### outputs/pr_review.json
```json
{
  "recommendation": "BLOCK",
  "summary": "Test uses a fixed timeout instead of Vitest's assertion API and a brittle CSS selector.",
  "generalComment": "outputs/pr_review_general.md",
  "inlineComments": [
    {"path":"tests/TEST-123.e2e-spec.ts","line":12,"body":"🚨 BLOCKING: a brittle raw selector/query — use a semantic, typed API call (e.g. supertest's `.post('/route')`) like the rest of the existing specs in tests/.","severity":"BLOCKING"},
    {"path":"tests/TEST-123.e2e-spec.ts","line":18,"body":"🚨 BLOCKING: a fixed sleep/timeout — replace with awaiting the actual async operation (e.g. `await request(app).post(...)`) instead of a race-prone delay.","severity":"BLOCKING"},
    {"path":"tests/TEST-123.e2e-spec.ts","line":5,"body":"💡 SUGGESTION: Group related assertions under describe(...) to match the existing file's structure.","severity":"SUGGESTION"}
  ],
  "issueCounts": {"blocking":2,"important":0,"suggestions":1},
  "perTestCase": {"TEST-123": "BLOCK"}
}
```

### outputs/pr_review.json (APPROVE example)
```json
{
  "recommendation": "APPROVE",
  "summary": "Test correctly exercises the ticket's acceptance criteria with real assertions and no flaky waits.",
  "generalComment": "outputs/pr_review_general.md",
  "inlineComments": [],
  "issueCounts": {"blocking":0,"important":0,"suggestions":0},
  "perTestCase": {"TEST-123": "APPROVE"}
}
```

### outputs/pr_review.json (multi-Test-Case PR — only one file has issues)
A Story's test-automation PR often bundles several Test Cases (one spec file
per ticket). Here `ET-25.spec.ts` and `ET-26.spec.ts` are clean;
`ET-27.spec.ts` is missing an assertion. Only ET-27 gets a BLOCK entry —
ET-25 and ET-26 must NOT be penalized for an issue confined to a
different file, even though the overall PR `recommendation` is BLOCK because
at least one Test Case blocks merge:
```json
{
  "recommendation": "BLOCK",
  "summary": "ET-25 and ET-26 are correct. ET-27 is missing the required text-muted assertion after the dark-theme toggle.",
  "generalComment": "outputs/pr_review_general.md",
  "inlineComments": [
    {"path":"tests/ET-27.e2e-spec.ts","line":14,"body":"🚨 BLOCKING: Only toBeVisible() is asserted after switching to dark theme. The expected result requires verifying the text-muted token is still applied, not just that the element isn't hidden.","severity":"BLOCKING"}
  ],
  "issueCounts": {"blocking":1,"important":0,"suggestions":0},
  "perTestCase": {"ET-25": "APPROVE", "ET-26": "APPROVE", "ET-27": "BLOCK"}
}
```

### outputs/pr_review_general.md
```markdown
## Automated Test PR Review — BLOCK

**Summary**: Test contains a brittle raw selector and a fixed timeout instead of proper async/await assertions.

**Next Steps**:
1. Replace the CSS selector with a role-based locator (getByRole/getByText), matching the existing specs in tests/
2. Replace waitForTimeout with an auto-retrying expect(...) assertion
```

### outputs/pr_review.json — genuine product defect, APPROVE not BLOCK

`ET-389` correctly edits an existing dish and sets both an empty name and an
invalid modifier range (`minSelection > maxSelection`) in one save attempt,
matching the Test Case exactly. The target run shows only the name error —
the range error never renders. The test is right; the product has the
defect. This gets `APPROVE`, so the ticket moves to `Failed` and the
pipeline's bug-creation rule can open a Bug — not `BLOCK`, which would only
route back to test rework and can never fix the product:

```json
{
  "recommendation": "APPROVE",
  "summary": "ET-389 correctly reproduces a genuine product defect: the modifier-range validation error never renders when the name field is also invalid.",
  "generalComment": "outputs/pr_review_general.md",
  "inlineComments": [],
  "issueCounts": {"blocking":0,"important":0,"suggestions":0},
  "perTestCase": {"ET-389": "APPROVE"}
}
```

```markdown
## Automated Test PR Review — APPROVE

**Summary**: ET-389 is correct and catches a real defect — the dish form
only shows the name-empty error and never renders the modifier-range error
when both are invalid at once. Approving so this routes to Bug creation;
do not request further test changes for this failure.
```
