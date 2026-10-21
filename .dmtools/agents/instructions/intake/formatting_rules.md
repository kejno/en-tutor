# Intake output formatting rules

## `outputs/stories.json`

- Must be a valid JSON array with no trailing commas.
- Each item may represent an Epic, Story, or Bug.

### Epic intake mode

- If the source Epic has label `umbrella_epic`, output **only Epic entries** with `parent: null`. Never output Story or Bug entries in that run.
- If the source is a regular Epic, output **only Story entries** with `parent` equal to the source Epic key. Never create another Epic in that run.
- This is a two-stage process: the umbrella intake creates product Epics; later, each product Epic's own intake creates its Stories.

| Field | Type | Notes |
|-------|------|-------|
| `type` | string | `Epic`, `Story`, or `Bug` |
| `summary` | string | Max 120 characters, concise, actionable, imperative |
| `description` | string | Relative path, e.g. `outputs/stories/story-1.md` |
| `parent` | string \| null | Real tracker key, `tempId`, or `null` for Epic |
| `tempId` | string | Optional, unique identifier for new Epics referenced by Stories |
| `priority` | string | `Highest`, `High`, `Medium`, `Low`, `Lowest` |
| `storyPoints` | integer | Required for every Story: 1–5 only. Split anything larger into vertical slices. |
| `blockedBy` | array | Only true prerequisite `tempId` or verified real Jira keys; creates native `Blocks` links and sets the Story to `Blocked`. |
| `integrates` | array | Verified `tempId` or real Jira keys for independently deliverable parallel work that must be combined; creates native `Relates` links. Never duplicate a `blockedBy` reference. |
| `attachments` | array | Relative paths to files copied under `outputs/attachments/` |
| `figma` | object | Optional exact Figma source for a Story. Add it when `input/figma_context.json` is available. See below. |

### Figma node mapping

When `input/figma_context.json` exists, read it before creating Stories. Add a `figma` object to visual Stories by selecting from `nodeCandidates` — never infer or fabricate a node ID:

```json
"figma": {
  "fileKey": "abc123",
  "nodeId": "2:452",
  "nodeName": "HERO SIMULATOR CARD",
  "url": "https://www.figma.com/design/abc123/Example?node-id=2-452",
  "bounds": { "width": 540, "height": 420 }
}
```

The Story description must name the selected node and link to `figma.url`. If Figma is absent or `figma_context_error.md` exists, continue normal intake; mention unavailable Figma context in `comment.md` only when it is relevant to the requested work.

Add the Jira label `figma_required` to an Epic when its design must be implemented from Figma. In that strict mode, every created Story must have a valid `figma` object. If Figma cannot be read or a node cannot be mapped, intake stops without creating Stories.

### Vertical-slice and dependency rules

- A Story must deliver one thin, observable user outcome end-to-end: UI/entry point (where applicable), application behaviour, data/API integration needed for that outcome, and acceptance-test coverage.
- Do not split ordinary product work into horizontal tickets such as “build UI”, “build API”, “write tests”, or “wire integration”. Split by independently reviewable user outcome instead.
- `storyPoints` is required and must be an integer from 1 through 5. If the outcome is larger, slice it by workflow step, user role, bounded scenario, or supported variation.
- Use `blockedBy` only when the blocked Story genuinely cannot start or be verified before the prerequisite is complete. Do not use it merely because two Stories touch the same feature.
- Use `integrates` for parallel Stories that have an explicit merge/contract point; otherwise leave both arrays empty so the team can work in parallel.
- A dependency may reference a unique `tempId` from this plan or an existing Jira key that was verified in the freshly fetched tracker files. Never reference itself, repeat a reference, or place the same reference in both arrays.

### Bug-specific rules

- `type` must be `Bug`.
- Do NOT include `parent`, `storyPoints`, `blockedBy`, or `integrates`.
- Write the bug description to `outputs/stories/bug-N.md`.

## `outputs/comment.md`

- Tracker-agnostic Markdown summary. Tracker-specific formatting is applied by `cliPromptsByTracker` (Jira wiki vs ADO Markdown).
- Include sections: summary, decomposition decisions, planned tickets, assumptions.

## Description files: `outputs/stories/story-N.md`, `epic-N.md`, `bug-N.md`

See `description_template.md` for the required generic structure and the mandatory tracker-markup transform step.
