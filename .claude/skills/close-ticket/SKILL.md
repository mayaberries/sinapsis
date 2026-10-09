---
name: close-ticket
description: Close a Sinapsis story or task on GitHub and update its board and stage records. Use when a task's PR is merged or a story's test IDs are all green, e.g. "close #14" or "we're done with the waiting room story".
---

# Close a ticket

Repo: `mayaberries/sinapsis`.

## 1. Check it's really done

Look it up with `gh issue view <N> -R mayaberries/sinapsis --json title,labels,milestone,body,state,subIssues`.

- **Task:**
  - Its test IDs pass. Run them if the test suite exists.
  - Its PR is merged, or the user says so.
  - Its "Done when" boxes are checked.
- **Story:**
  - Every sub-issue is closed.
  - Every test ID in its table is 🟩.
  - The real-conditions check was done if it touches patients or participants.

If something is missing, say what and don't close. The user can still decide to close it as not planned.

## 2. Update GitHub

- **Task:** in the parent story's test case table, set the IDs this task turned green to 🟩 (edit the story body with `gh issue edit <story> --body-file`).
- **Close the ticket:**
  - `gh issue close <N> -R mayaberries/sinapsis --comment "<one line: what was done, test IDs, PR>"`.
  - Use `--reason "not planned"` when dropped.

## 3. Update the docs

- **Board file** (`docs/boards/XXX.md`): set the ticket's Status in the Tickets table to `closed` (or `dropped`).
- **Story:**
  - If this was the last open story in the milestone, say so. The stage's exit criteria may be met, so review them with the user.
- **Decisions:** if closing settled an open decision, record it in `docs/DECISIONS.md`, and in the stage file's "Decisions made" and "Open decisions" sections.

Don't commit unless the user asks.
