# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Sinapsis ("synapse" in Spanish) is at the pre-code stage. The repo contains only documentation:

- `README.md`: product vision and core entities.
- `assets/{en,es}/RESEARCH.md`: practitioner pain-point research and a prioritized feature list (Tier 1–3). Treat it as the product spec until a real one exists.
- `assets/{en,es}/PITCH.md`: product pitch.
- `docs/ROADMAP.md` (English) and `docs/ROADMAP_es.md` (Spanish): roadmap timeline: the eight stages in order, a few points per stage, and cross-stage open decisions. Keep both in sync.
- `docs/stages/NN-*.md`: one file per stage (English only, internal): what it demonstrates, exit criteria, areas and that stage's open decisions.
- `docs/PRINCIPLES.md`: principles that apply to every stage (Spanish).
- `docs/WORKFLOW.md`: workflow spec (Spanish): GitHub milestones/issues/labels structure and the test-driven cycle each development issue follows.

`assets/en` and `assets/es` hold the same documents in English and Spanish; when one changes, update its counterpart. The repo is also an Obsidian vault (`.obsidian/` config is tracked, workspace state is not).

There is no build system, language, framework, or test suite yet. When one is added, update this file with build/lint/test commands, including how to run a single test.

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
