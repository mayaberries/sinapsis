# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Sinapsis ("synapse" in Spanish) is at the POC stage. The app lives in `backend/` and `frontend/`; the rest of the repo is documentation:

- `README.md`: product vision, core entities and how to run the app from a fresh clone.
- `assets/{en,es}/RESEARCH.md`: practitioner pain-point research and a prioritized feature list (Tier 1–3). Treat it as the product spec until a real one exists.
- `assets/{en,es}/PITCH.md`: product pitch.
- `docs/ROADMAP.md` (English) and `docs/ROADMAP_es.md` (Spanish): roadmap timeline: the eight stages in order, a few points per stage, and cross-stage open decisions. Keep both in sync.
- `docs/stages/NN-*.md`: one file per stage (English only, internal): what it demonstrates, exit criteria, its stories (each tagged with its board) and that stage's open decisions.
- `docs/DECISIONS.md`: where to look up why things are built the way they are (English, internal): the principles every stage follows and the technical decisions made (frontend: Astro + Vue, TypeScript PWA; backend: Python/FastAPI with Kalens and Xolo). When an open decision in a stage file is made, record it here and in that stage's "Decisions made".
- `docs/boards/`: one file per board (English, internal), indexed in `docs/boards/README.md`. Boards group stories by domain across stages; each GitHub issue gets one `board:XXX` label, and the prefix is also the test ID prefix (`XXX-NNN`). Each story in a stage file names its board in parentheses; when an issue is created, add it to its board's tickets table.
- `docs/WORKFLOW.md`: workflow spec (English, internal): the shared vocabulary (stage, story, task, board, ticket, test ID; never "area"), how they map to GitHub milestones, issues and labels, and the test-driven cycle each story follows. Only the POC's stories are ordered; later stages get ordered when they start.

GitHub issues follow `docs/WORKFLOW.md`: every story and task has a milestone (its stage), a `stage:` label and one `board:` label; stories also carry `story`, tasks are sub-issues of their story. Use the project skills `create-story`, `create-task` and `close-ticket` to create and close them, so titles, bodies, labels and the board/stage records stay consistent.

The POC depends on two of the user's own libraries: [Kalens](https://github.com/mayaberries/kalens) (scheduling engine, Python/FastAPI/PostgreSQL/Redis; it sets the backend stack and expects the host to provide users and auth) and Xolo (authentication, not created yet; to be extracted from another project). See `docs/stages/01-poc.md`.

`assets/en` and `assets/es` hold the same documents in English and Spanish; when one changes, update its counterpart. The repo is also an Obsidian vault (`.obsidian/` config is tracked, workspace state is not). The code folders (`backend/`, `frontend/`, `scripts/`) are excluded from it in `.obsidian/app.json` and hidden from its file explorer by the `hide-code-folders` CSS snippet; add any new top-level code folder to both.

## Commands

Needs Docker; the setup script installs the rest. Run `make help` for the full list. Node, pnpm and Python versions are pinned in `.nvmrc`, `frontend/package.json` (`packageManager`) and `backend/.python-version`. Configuration defaults match Docker Compose; copy `.env.example` to `.env` only to change something.

- `./scripts/setup.sh` (or `make setup`): check and install the prerequisites (uv, Python, Node through nvm, pnpm through Corepack), then both sides' dependencies, PostgreSQL and Redis, and migrations. `--check` (`make doctor`) only reports; `--step <name>` runs one step. It's bash 3.2 compatible (macOS's default) and never runs sudo.
- `make dev`: run the backend (http://localhost:8000, `GET /health`) and the frontend (http://localhost:4321) with reload
- `make lint` / `make format` / `make typecheck`: Ruff and mypy on the backend; ESLint, `astro check` and `vue-tsc` on the frontend
- `make migrate`: apply the backend's Alembic migrations (`cd backend && uv run alembic revision -m "..."` to add one)
- `make gen-api`: export the backend's OpenAPI schema to `frontend/openapi.json` and regenerate the typed client (`frontend/src/lib/api/schema.d.ts`). Run it after changing the API.

There is no test suite yet; story #2 adds pytest, Vitest, Playwright and CI. When it lands, add here how to run a single test.

## Architecture

**Backend** (`backend/app/`), FastAPI on PostgreSQL through `databases` with raw SQL (the same stack and pinned versions as Kalens, which reads the pool from `app.state._db`). Organized by module first, layers inside each module:

```
app/
  main.py, lifespan.py      # wires the modules; opens the DB and Redis clients
  modules/<name>/           # one per domain (bounded context), not per table
    __init__.py             # the module's public API: what other code may import
    routes.py → dependencies.py → service.py → repository.py → schemas.py
  shared/                   # domain-agnostic only: config, db/, http/, errors, base schemas
  migrations/               # the app's Alembic chain (Kalens keeps its own)
```

- **Layers are files, in one direction:** routes → dependencies → service → repository → schemas, never backwards. Routes are thin; dependencies do the wiring (one `get_<x>_service` per service, exposed as `Annotated` aliases like `HealthServiceDep`; `get_repository`, `DatabaseDep` and `RedisDep` come from `shared/db/dependencies.py`); services hold the business rules and raise the domain errors in `shared/errors.py`, never `HTTPException` (`shared/http/errors.py` maps them to status codes); repositories run SQL only and return schemas or `None`.
- **Modules only import each other through their package** (`from app.modules import users`), never another module's `service`, `repository`… Export what others need from `__init__.py`.
- **`shared/` never imports from `modules/`.** If only some modules need something, it belongs to one of them and is exported.
- `make lint` enforces these three rules with import-linter (contracts in `backend/pyproject.toml`).
- Every layer is optional: a module without a database has no `repository.py`. A module that grows splits into sub-packages *inside itself*; don't add top-level folders per layer. A query that spans modules' tables (a report) gets a read-only module of its own instead of one repository reaching into another's tables. A circular import between modules means a misplaced boundary.
- Infrastructure modules (`health`, `GET /health`) mount at the root, product modules under `/api`. `lifespan.py` creates the database and Redis clients without failing when either is down, so `/health` can report it (503, naming the failing dependency).

**Frontend** (`frontend/`), Astro with the Node adapter: pages render on the server and ship no JavaScript unless they hold an island. Vue islands get Pinia from `src/app.ts`; state shared across islands goes in nanostores (`src/shared/`). The session room is one `client:only="vue"` island (`src/islands/`). The PWA is a hand-written `public/manifest.webmanifest` and `public/sw.js`, which never caches HTML or the API. TypeScript is pinned to `~6.0` until vue-tsc, `astro check` and typescript-eslint support 7.

## Product summary

A platform for health practitioners (psychologists and therapists first, then doctors, nutritionists, etc.) to run remote and hybrid consultations. It aims to replace the mix of Zoom/Meet, WhatsApp, Google Forms, email and spreadsheets they use today.

- **Target markets:** Mexico and Latin America first, US second. Expect Spanish-first UX and mobile-first, low-bandwidth patients (low-end Android, unstable connections, no installs or accounts).
- **Core entities:** the practitioner, the patient/client, and the *resources* exchanged between them: finished artifacts such as already-issued prescriptions, lab results, psychometric results, worksheets and reports.
- **Tier 1 features (assets/en/RESEARCH.md):** a boundaried messaging channel ("encuadre" channel) with office hours and response windows; a per-appointment before/during/after shared space; psychometric follow-up (PHQ-9, GAD-7 and similar public-domain instruments) with auto-scoring and trends; mobile-first joining with audio-only fallback; privacy-at-home helpers for patients.
- **Integrations:** patients prefer WhatsApp and other messaging apps. Integrations should automate common tasks (e.g., sending results via WhatsApp) without making the practitioner manage those channels by hand.

## Scope constraints (out of scope by design)

These keep the product out of regulated territory. Don't build features that cross them:

- No e-prescription generation or validation. Prescriptions are only stored and delivered as finished documents.
- Not the legal clinical record (expediente clínico).
- No automated diagnosis, and no risk scoring that triggers actions. Risk-item flags are only cues for the practitioner's attention.
- No tax-compliant invoice (CFDI) issuing. Collect the data and export it to the practitioner's existing tools.
- Licensed instruments (e.g., BDI-II) only through the publisher's channels. Ship public-domain questionnaires only.
