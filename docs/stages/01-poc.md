# 🧪 POC: prove that a workshop works end to end

← [Roadmap](../ROADMAP.md) · Next: [Validation](02-validation.md) →

Build the minimum needed to have material to work with practitioners during validation. Use a test workshop to try what fails most today: participants joining from their phone without installing anything, the group seeing and hearing each other, and material being shown without relying on screen sharing.

📍 Milestone: to be created.

## 🎬 What the stage demonstrates

- The practitioner signs in, creates a workshop, schedules its sessions and gets a fixed link.
- Several participants join from low-end Android, with no accounts or installs, and wait in the waiting room.
- The whole group is visible in a single view, and anyone who loses video stays in the session with audio only.
- The practitioner uploads images, a video and a PDF before the session and shows them in one click, without screen sharing.
- The participant interface doesn't repeat options: actions that lead to the same goal are grouped under a single entry point, and secondary options appear only when needed.

## ✅ Exit criteria

- All test IDs assigned to this stage are green
- A test workshop with the pilot's first practitioner is completed without leaving Sinapsis
- The POC is ready to be shown in the validation interviews

## 🧩 Stories

In build order: each story builds on the ones before it.

| #   | Story                                                                             | Issue | Test IDs |
| --- | --------------------------------------------------------------------------------- | ----- | -------- |
| 1   | App boilerplate: FastAPI backend, Astro + Vue frontend and local environment      |       |          |
| 2   | Test harness (pytest, Vitest, Playwright) and continuous integration              |       |          |
| 3   | Practitioner authentication with Xolo (AUT)                                       |       |          |
| 4   | Create workshops and their fixed link (TLL)                                       |       |          |
| 5   | Schedule workshop sessions with Kalens (AGE)                                      |       |          |
| 6   | Join without an account or install, and waiting room (SES)                        |       |          |
| 7   | Group video call with audio-only fallback (GRP)                                   |       |          |
| 8   | Upload and present material without screen sharing (MAT)                          |       |          |
| 9   | Large, clear participant controls, grouped by task with no repeated options (UIP) |       |          |

### 🔗 External libraries

- **[Kalens](https://github.com/mayaberries/kalens)** (appointments): the scheduling engine extracted from `pets-appts`. A Python 3.13 / FastAPI library with PostgreSQL, Alembic and Redis, so it sets the backend stack. It owns the `appointments` and `clinic_availability` tables. The host provides users, services, the tenant ("clinic") and the booking's subject, plus its authentication, which is why it comes after Xolo. Its guest users fit participants who join without an account.
- **Xolo** (authentication): to be created, by extracting the authentication logic of another project into its own repo. Story 3 starts by defining its scope.

## ✅ Decisions made

The full reasoning for each one is in [decisions](../DECISIONS.md).

- **Frontend:** a TypeScript web app (PWA) with Astro; the session room is a single Vue island.
- **Tests:** `pytest` on the backend, Vitest for components, Playwright end to end with Android emulation and network throttling.
- **Backend:** Python, FastAPI, PostgreSQL and Redis, set by Kalens.

## ❓ Open decisions

Each one blocks the tests that depend on it.

|Decision|Issue|
|---|---|
|Xolo's scope and API: what it extracts from the other project, and how it provides the JWT dependency Kalens expects||
|How a workshop session maps onto Kalens: one appointment has a single subject, and confirmed appointments can't overlap within a clinic, but a session has many participants at the same time||
|Video provider and how it degrades to audio only (its plain JavaScript SDK will be wrapped in Vue composables)||
|Material formats and maximum size||
