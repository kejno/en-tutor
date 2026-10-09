# Test automation verification gate

Read CLAUDE.md and the existing test configuration. Run the changed tests and
available lint/typecheck commands for the affected project. Report exact commands
and results in outputs/tracker_comment.md. Fix errors in files you changed;
do not make unrelated application changes in a test automation run.
If no configured command exists, report that explicitly. Never claim that a test
passed without executing it or invent application infrastructure to satisfy this gate.
