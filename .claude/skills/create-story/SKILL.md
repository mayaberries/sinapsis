---
name: create-story
description: Create the GitHub issue for one story of a Sinapsis stage (milestone), with its labels, test cases and doc links. Use when starting work on a story, e.g. "let's tackle POC story 3" or "open the issue for automatic reconnection".
---

# Create a story

A story is one row in a stage file's Stories table. Use the vocabulary in `docs/WORKFLOW.md` (stage, story, task, board, ticket, test ID). It's created on GitHub before any work starts, so nothing gets lost. Read `docs/WORKFLOW.md` and `docs/boards/README.md` if the rules below are unclear.

Repo: `mayaberries/sinapsis`. Issues are written in English.

## 1. Identify the story

- Find the stage file in `docs/stages/` and the story's row in its Stories table. The board is the prefix in parentheses, e.g. `Automatic reconnection ([SES](../boards/SES.md))`.
- If the row's Issue column already has a link, stop and show it: the story exists.
- If the story isn't in the table, propose a row and a board (an existing one; see `docs/boards/README.md`) and confirm with the user first.
- For the POC, warn if earlier stories in the build order are still open; don't block.

Stage → milestone → label:

|Stage file|Milestone|Label|
|---|---|---|
|01-poc|POC|`stage:poc`|
|02-validation|Validation|`stage:validation`|
|03-v1|First version|`stage:v1`|
|04-pilot|Pilot|`stage:pilot`|
|05-individual|Individual sessions|`stage:individual`|
|06-clinical|Clinical differentiators|`stage:clinical`|
|07-admin|Administrative flow|`stage:admin`|
|08-expansion|Expansion|`stage:expansion`|

## 2. Draft the test cases

Gather context from the stage file ("What the stage demonstrates", open decisions), `docs/DECISIONS.md`, and `assets/en/RESEARCH.md`. Then:

- Write each behavior as a test case: one observable outcome, given / when / then.
- Allocate test IDs `XXX-NNN` (board prefix, 3 digits, numbered per board, never reused). Find the next free number from both sources and take the highest:
  - `grep -rhoE '\bXXX-[0-9]{3}\b' docs | sort -u | tail -1`
  - `gh issue list -R mayaberries/sinapsis --label board:XXX --state all --json body -q '.[].body' | grep -oE '\bXXX-[0-9]{3}\b' | sort -u | tail -1`
- Include the real-conditions case when the story touches patients or participants (low-end Android, limited connection, Spanish).
- List the open decisions that block any case, and mark those cases as blocked.
- Flag anything that brushes the scope limits in `CLAUDE.md` (prescriptions, clinical record, diagnosis or risk actions, CFDI issuing, licensed instruments).

Non-code stories (validation, research) have deliverables instead of test cases; use the same table with `—` as the ID.

## 3. Show the draft and confirm

Show the title, labels, milestone and body, and ask the user to confirm or adjust. Don't create the issue until they confirm.

**Title:** `XXX · <story name as in the stage table>` (e.g. `SES · Automatic reconnection`).

**Labels:** `story`, `board:XXX`, `stage:<stage>`. A story whose cases span several stages gets each `stage:` label, but only one milestone (the earliest).

**Body:**

```markdown
<One or two sentences: what the story delivers and for whom.>

## Test cases

|ID|Given / when / then|Status|
|---|---|---|
|XXX-001|Given …, when …, then …|⬜|

## Blocking decisions

- <Decision> (blocks XXX-00N). Or "None."

## Scope check

<"Within scope." or the limit it brushes and how it stays outside it.>

## Context

- Stage: [<Stage>](https://github.com/mayaberries/sinapsis/blob/main/docs/stages/<file>.md)
- Board: [XXX · <Board name>](https://github.com/mayaberries/sinapsis/blob/main/docs/boards/XXX.md)
- Decisions: [DECISIONS.md](https://github.com/mayaberries/sinapsis/blob/main/docs/DECISIONS.md)

Tasks are created as sub-issues as the work needs them.
```

Status values: ⬜ not started, 🟥 red (written, failing), 🟩 green, ⛔ blocked.

## 4. Create it

```sh
gh issue create -R mayaberries/sinapsis --title "<title>" --body-file <tmp file> \
  --label story --label board:XXX --label stage:<stage> --milestone "<Milestone>"
```

Write the body file to the scratchpad, not the repo.

## 5. Record it in the docs

- **Stage file:** in the story's row, fill Issue with `[#N](https://github.com/mayaberries/sinapsis/issues/N)` and Test IDs with the range, e.g. `SES-001–SES-006`.
- **Board file** `docs/boards/XXX.md`:
  - In "Stories by stage", fill the row's Issue column.
  - Add a row at the top of the Tickets table: `|[#N](url)|story|<Stage>|open|SES-001–SES-006|`.

Don't commit unless the user asks. Finish by giving the issue link and offering to open the first task (the `create-task` skill).
