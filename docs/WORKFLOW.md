# 🔁 Sinapsis: workflow

← [Roadmap](ROADMAP.md) · [Boards](boards/README.md)

> How a [roadmap](ROADMAP.md) stage becomes work: the stages, stories and tasks on GitHub, the [boards](boards/README.md) that group them by domain, and the test-driven cycle every story follows.

## 📖 Vocabulary

Every doc, issue and skill uses these words, and only these.

|Term|Meaning|On GitHub|In the docs|
|---|---|---|---|
|**Stage**|One of the eight roadmap steps|A milestone, plus a `stage:XXX` label|`docs/stages/NN-*.md`|
|**Story**|One behavior a stage delivers, closed when all its test IDs are green|An issue labeled `story`|A row in its stage's Stories table|
|**Task**|One concrete step toward closing a story, usually one PR|A sub-issue of its story|A row in its board's Tickets table|
|**Board**|A domain that groups stories and tasks across stages|A `board:XXX` label|`docs/boards/XXX.md`|
|**Ticket**|Any story or task|An issue|Its board's Tickets table|
|**Test ID**|One test case, `XXX-NNN` with the board's prefix|Listed in the story's body|The story's row and its board's tickets|

Use "story" for the rows in the stage files; don't call them "areas" or "features".

## 🗂️ Structure on GitHub

|Level|Created|Labels|Milestone|
|---|---|---|---|
|Story|When its stage starts, or when it's picked up|`story`, `board:XXX`, `stage:XXX`|Its stage|
|Task|As the work needs it, never planned ahead|`board:XXX`, `stage:XXX`|Its story's|

- **Stories** describe the behavior and hold its test cases with their IDs. A story whose test cases span several stages carries each `stage:` label, but only the earliest milestone.
- **Tasks** name the test IDs they turn green, if any.
- **One board per ticket.** Tasks take their story's board, unless the task changes another domain (for example, a pilot fix to reconnection is `board:SES`).
- **Filtering:**
  - by stage: `milestone:"POC"`
  - by board: `label:board:SES`
  - both: combine the two filters
- **Only the POC is in build order.** The other stages keep their stories as a reference and get ordered when they start, so we don't tie ourselves to a rigid plan.

Every stage file has a Stories table:

|Column|Content|
|---|---|
|#|Build order (only once the stage is ordered)|
|Story|The story's name and, in parentheses, its board's prefix, which is also its test ID prefix|
|Issue|Link to the story's issue|
|Test IDs|The IDs the story must turn green, e.g. `SES-001–SES-006`|

📝 The test plan doesn't exist yet. Test IDs are numbered per board (`SES-001`, `SES-002`…) and never reused.

Use the project skills to create and close tickets, so titles, bodies, labels and records stay consistent:
- `create-story`
- `create-task`
- `close-ticket`

## 🧪 Test-driven cycle

Every behavior is written as a test case before it's built, so nothing is assumed along the way.

1. **Pick a story and open its first task.** The story's test cases are its acceptance criteria.
2. **Resolve blocking decisions first.** If a case depends on an open decision, decide it in the story and update the case. Don't pick an answer in the code.
3. **Check the scope limits.** If the behavior brushes something out of scope (prescriptions, clinical record, diagnosis, tax invoices), discuss it in the story before writing tests.
4. **Red:** write the tests, named by ID, and check that they fail.
5. **Green:** write the least code that makes them pass.
6. **Refactor** with the tests green, and open a PR that mentions the task and its test IDs.
7. **Record the ticket** in its board's file when it's opened, and update its status when it's closed.
8. **Test in real conditions.** Before closing a story that affects patients or participants, check it in Spanish, on a low-end Android with a limited connection.

⚠️ A behavior without a test ID isn't built. First add the case to the story, with a new ID.
