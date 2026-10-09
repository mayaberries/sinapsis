---
name: create-task
description: Create a GitHub task as a sub-issue of a Sinapsis story, labeled and recorded in its board. Use when picking up the next step of a story, e.g. "open a task for the waiting room endpoint" or "next task for #12".
---

# Create a task

Tasks aren't planned ahead: one is opened when a story is picked up or when new work appears. Each task is a sub-issue of exactly one story.

Repo: `mayaberries/sinapsis`. Issues are written in English.

## 1. Find the parent story

- Get the story from the user (number, or stage + story name). Look it up with `gh issue view <N> -R mayaberries/sinapsis --json title,labels,milestone,body,state`.
- If the story doesn't exist yet, create it first with the `create-story` skill.
- If the story is closed, ask before adding work to it.

## 2. Draft the task

- **Scope:** one reviewable change, ideally one PR. If it's bigger, propose splitting it.
- **Test IDs:** which of the story's test IDs this task turns green, if any. If the work needs a behavior with no test ID, stop: add the case to the story first (edit its body, allocating the next ID as in `create-story`). A behavior without a test ID isn't built.
- **Board:** the story's board by default. If the task changes another domain (e.g. a pilot fix to reconnection), use that board instead and say why.
- **Blocking decisions:** if a test ID it covers is blocked (⛔ in the story), the decision is resolved first, in the story, not in code.

Show the draft and ask the user to confirm before creating it.

**Title:** `XXX · <imperative, specific>` (e.g. `SES · Add waiting room endpoint and page`).

**Labels:** `board:XXX` and the story's `stage:` label(s). No `story` label.

**Milestone:** the story's.

**Body:**

```markdown
Part of #<story>.

<What to do, in a few lines or bullets.>

## Test IDs

- XXX-00N: <case summary>. Or "None (setup work)."

## Done when

- [ ] The listed test IDs are green
- [ ] PR open, mentioning this task and its test IDs
- [ ] <anything else specific>
```

## 3. Create it

```sh
gh issue create -R mayaberries/sinapsis --title "<title>" --body-file <tmp file> \
  --label board:XXX --label stage:<stage> --milestone "<Milestone>" --parent <story number>
```

Write the body file to the scratchpad, not the repo. Check the link with `gh issue view <story> --json subIssues` if unsure.

## 4. Record it

Add a row at the top of the Tickets table in `docs/boards/XXX.md` (the task's board): `|[#N](url)|task|<Stage>|open|XXX-00N|`.

Stage files only list stories, so they don't change. Don't commit unless the user asks.
