# 🧪 POC: prove that a workshop works end to end

← [Roadmap](../ROADMAP.md) · Next: [Validation](02-validation.md) →

Build the minimum needed to have material to work with practitioners during validation. Use a test workshop to try what fails most today: participants joining from their phone without installing anything, the group seeing and hearing each other, and material being shown without relying on screen sharing.

📍 Milestone: to be created. 🏔️ Parent issue: to be created.

## 🎬 What the stage demonstrates

- The practitioner creates a workshop and gets a fixed link.
- Several participants join from low-end Android, with no accounts or installs, and wait in the waiting room.
- The whole group is visible in a single view, and anyone who loses video stays in the session with audio only.
- The practitioner uploads images, a video and a PDF before the session and shows them in one click, without screen sharing.
- The participant interface doesn't repeat options: actions that lead to the same goal are grouped under a single entry point, and secondary options appear only when needed.

## ✅ Exit criteria

- All test IDs assigned to this stage are green
- A test workshop with the pilot's first practitioner is completed without leaving Sinapsis
- The POC is ready to be shown in the validation interviews

## 🧩 Areas

|Area|Development issue|Test IDs|Test issue|
|---|---|---|---|
|Set up the project and the continuous integration pipeline||||
|Create workshops and their fixed link (TLL)||||
|Join without an account or install, and waiting room (SES)||||
|Group video call with audio-only fallback (GRP)||||
|Upload and present material without screen sharing (MAT)||||
|Large, clear participant controls, grouped by task with no repeated options (UIP)||||

## ❓ Open decisions

Each one blocks the tests that depend on it.

|Decision|Issue|
|---|---|
|Platform, stack and test suite||
|Video provider and how it degrades to audio only||
|Material formats and maximum size||
