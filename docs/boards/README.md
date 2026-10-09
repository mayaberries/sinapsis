# 🗂️ Sinapsis: boards

← [Roadmap](../ROADMAP.md) · [Workflow](../WORKFLOW.md)

> Milestones cut the work by stage; boards cut it by domain. Every story and task on GitHub carries one board label, so the same issue can be found from its milestone or from its board. Each board's file lists its stories by stage and keeps a record of its tickets.

## 🏷️ Boards

|Board|Label|Covers|[POC](../stages/01-poc.md)|[Val](../stages/02-validation.md)|[V1](../stages/03-v1.md)|[Pil](../stages/04-pilot.md)|[Ind](../stages/05-individual.md)|[Cli](../stages/06-clinical.md)|[Adm](../stages/07-admin.md)|[Exp](../stages/08-expansion.md)|
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|🏗️ [PLT · Platform](PLT.md)|`board:PLT`|The app's foundations|●||||||||
|🔐 [AUT · Accounts and access](AUT.md)|`board:AUT`|Who someone is and what they can do|●||●|●||||●|
|📅 [AGE · Scheduling](AGE.md)|`board:AGE`|Workshops, appointments and the calendar, built on Kalens|●||●||●||●||
|🎥 [SES · Session connection](SES.md)|`board:SES`|Getting into a live session and staying in it on a weak connection|●||●||●||||
|🛋️ [SAL · Session room](SAL.md)|`board:SAL`|The tools and modes inside a live session|||●|||●|●||
|📱 [UIP · Interface and language](UIP.md)|`board:UIP`|How the interface looks, reads and is organized|●|||||||●|
|📂 [REC · Resources](REC.md)|`board:REC`|The resources exchanged between practitioner and patient|●||●||●|●|||
|💬 [MSG · Messaging and boundaries](MSG.md)|`board:MSG`|Communication outside the session, on the practitioner's terms|||●||●||||
|📊 [PSI · Psychometrics](PSI.md)|`board:PSI`|Questionnaires and their follow-up|||||●|||●|
|💳 [COB · Payments](COB.md)|`board:COB`|Payment receipts and CFDI data|||●||||●||
|🛡️ [SEG · Data protection](SEG.md)|`board:SEG`|Protecting sensitive mental health data from day one|||●||||||
|🔬 [INV · Research and feedback](INV.md)|`board:INV`|Learning from practitioners and participants||●||●|||||

## 📏 Rules

- **One board per issue.** Every story and every task gets exactly one `board:XXX` label, plus its `stage:XXX` label and milestone; stories also carry `story`.
- **Tasks follow their story** unless the task changes another domain; then it takes that board's label instead (for example, a pilot fix to reconnection is `board:SES`).
- **The prefix is also the test ID prefix.** Test IDs are `XXX-NNN`, numbered per board, so a test ID tells you its board at a glance.
- **New areas pick an existing board.** Create a new board only when an area fits none of them; add its file here and its label on GitHub.
- **Finding work:** by stage, filter `milestone:"POC"`; by board, filter `label:board:SES`; both, combine them.
