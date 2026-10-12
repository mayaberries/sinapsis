.DEFAULT_GOAL := help
.PHONY: help setup doctor dev test test-backend test-unit test-e2e services-up services-down services-reset backend frontend migrate gen-api lint format typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "} {printf "  %-15s %s\n", $$1, $$2}'

setup: ## Check and install the prerequisites, then dependencies, services and migrations (scripts/setup.sh)
	./scripts/setup.sh

doctor: ## Report what's missing or misconfigured, without installing anything
	./scripts/setup.sh --check

dev: services-up ## Run the backend (:8000) and the frontend (:4321) with reload; Ctrl+C stops both
	@trap 'kill 0' INT TERM EXIT; \
	(cd backend && uv run uvicorn app.main:app --reload --port 8000) & \
	(cd frontend && pnpm dev) & \
	wait

services-up: ## Start PostgreSQL and Redis and wait until they're healthy
	docker compose up -d --wait

services-down: ## Stop PostgreSQL and Redis, keeping their data
	docker compose stop

services-reset: ## Remove PostgreSQL and Redis and their data (destructive)
	docker compose down -v

backend: services-up ## Run only the backend
	cd backend && uv run uvicorn app.main:app --reload --port 8000

frontend: ## Run only the frontend
	cd frontend && pnpm dev

migrate: ## Apply the backend's migrations
	cd backend && uv run alembic upgrade head

gen-api: ## Regenerate the frontend's typed API client from the backend's OpenAPI schema
	cd backend && uv run python -m app.scripts.export_openapi > ../frontend/openapi.json
	cd frontend && pnpm gen:api

lint: ## Ruff and the module boundaries (import-linter) on the backend, ESLint on the frontend
	cd backend && uv run ruff check . && uv run ruff format --check . && uv run lint-imports
	cd frontend && pnpm lint

format: ## Format the backend with Ruff and fix ESLint issues on the frontend
	cd backend && uv run ruff format . && uv run ruff check --fix .
	cd frontend && pnpm lint --fix

test: test-backend test-unit test-e2e ## Run every test suite (one test case in all of them: ID=PLT-006)

test-backend: services-up ## pytest against PostgreSQL and Redis (one test case: ID=PLT-002)
	@# With ID, "no test has it" (pytest's exit code 5) isn't a failure: the case may live in another suite.
	cd backend && uv run pytest $(if $(ID),--test-id $(ID)) $(if $(ID),|| [ $$? -eq 5 ])

test-unit: ## Vitest component and type tests (one test case: ID=PLT-006)
	cd frontend && pnpm test:unit $(if $(ID),-t $(ID) --passWithNoTests)

test-e2e: ## Playwright on the production build, Moto G4 profile (one test case: ID=PLT-005)
	cd frontend && pnpm test:e2e $(if $(ID),--grep $(ID) --pass-with-no-tests)

typecheck: ## mypy on the backend, astro check and vue-tsc on the frontend
	cd backend && uv run mypy app tests
	cd frontend && pnpm typecheck
