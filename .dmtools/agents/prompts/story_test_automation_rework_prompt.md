# Story test automation rework

Read input/{TICKET_KEY}/ticket.md, linked_test_cases.md, pr_info.md,
pr_discussions.md and outputs/review_replies.json. Locate the actual specs for
each linked Test Case using the repository's existing layout and test configuration.
Address review feedback with minimal test-only changes. Run the relevant configured
test command. Do not change product code to hide a failing test.
Write fresh per-Test-Case results to outputs/story_test_automation_result.json,
review replies to outputs/review_replies.json, and a summary to outputs/tracker_comment.md.
For product failures, retain the failing result and explain it; report unavailable
infrastructure in outputs/blocked.json.
