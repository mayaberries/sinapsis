# 🧭 Sinapsis: decisions

← [Roadmap](ROADMAP.md)

> Look here first when you need to know why Sinapsis is built the way it is: the principles every stage follows and the decisions already made. Decisions still open live in each [stage](stages/) file and in the roadmap; once made, they're recorded here.

## 📐 Principles

They apply to every stage of the roadmap.

- **Psychology first.** We design for psychologists and therapists; doctors, nutritionists and other practitioners come later, reusing whatever fits.
- **Mobile first, with a weak signal.** Every feature must work on low-end Android, with no installs or accounts for the patient or participant.
- **Simple for the patient.** Big buttons, clear icons and a less formal look than the practitioner's.
- **The practitioner sets the boundaries.** The platform upholds their rules; it doesn't impose them.
- **Out of regulated territory.** We don't generate prescriptions, we aren't the legal clinical record, we don't diagnose or trigger actions on risk, and we don't issue tax invoices.
- **Sensitive data from day one.** Mental health information is protected as such; nothing that ends up in unencrypted spreadsheets today should be repeated here.

## 🛠️ Technical decisions

Newest first. Each one says when it was made, what was decided, why, and what it implies.

### Frontend: a TypeScript web app with Astro and Vue

*POC · 2026-10-09*

**Decision**

- A single TypeScript web app for participants and practitioners, installable as a PWA. No native apps for now.
- **Astro** renders the light pages (fixed link, waiting room, practitioner lists and forms) on the server, with little or no JavaScript.
- The **session room** is a single `client:only="vue"` island, loaded only when someone enters. Video, material and controls are lazy-loaded components inside it, not separate islands, because they share a lot of state.
- **Vue 3** for the room island: Pinia for state inside it, `@nanostores/vue` for the little state shared with other islands.
- The video provider's plain JavaScript SDK, wrapped in Vue composables (`useRoom()`, `useParticipants()`…).
- **Tests:** `pytest` on the backend, Vitest with Vue Test Utils for components, and Playwright end to end with Android device emulation and network throttling.

**Why**

- Participants can't install anything and use low-end Android with weak connections, so their side has to be a light web page. Flutter Web and Compose Multiplatform for the web both need a heavy runtime before the first paint.
- The backend is Python (Kalens, Xolo), so there's no client code to share with it. That removes KMP's main advantage; typed clients are generated from FastAPI's OpenAPI schema instead.
- WebRTC providers have their most complete SDKs in JavaScript.
- Vue's fine-grained reactivity handles the room's frequent events (active speaker, audio levels, connection quality) without the extra re-renders React needs to avoid, which matters on low-end phones. The participant controls are custom anyway (story UIP), so React-only video component kits don't add much.

**Implies**

- No official Vue component kit for video: participant grids, reconnection states and device pickers are built in-house on the SDK.
- Native apps only if the pilot shows a concrete need (reliable iOS push, audio with the screen locked). Even then, wrap the web app with Capacitor before rewriting it natively.

### Backend: Python and FastAPI, with Kalens and Xolo

*POC · 2026-10-09*

**Decision**

- Python 3.13, FastAPI, PostgreSQL and Redis.
- Scheduling through [Kalens](https://github.com/mayaberries/kalens), pinned to a release tag (`v0.1.0-alpha.2` today).
- Authentication through [Xolo](https://github.com/mayaberries/xolo), still to be extracted from another project.

**Why**

- Kalens is a FastAPI library with PostgreSQL, Alembic and Redis, and it's the scheduling engine we already have.
- Pinning to a tag keeps every app that uses Kalens on the same code while it's being made generic.

**Implies**

- Kalens needs users and authentication from its host, so Xolo comes before it in the POC.
- How a workshop session (many participants at once) maps onto Kalens' single-subject appointments is still open; see the [POC](stages/01-poc.md).
