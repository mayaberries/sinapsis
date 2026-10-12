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

test: test-backend test-unit test-e2e ## Run every test suite

test-backend: services-up ## pytest against PostgreSQL and Redis (one case: make test-backend K=plt_002)
	cd backend && uv run pytest $(if $(K),-k $(K))

test-unit: ## Vitest component tests (one case: make test-unit K=PLT-006)
	cd frontend && pnpm test:unit $(if $(K),-t $(K))

test-e2e: ## Playwright on the production build, Moto G4 profile (one case: make test-e2e K=PLT-005)
	cd frontend && pnpm test:e2e $(if $(K),--grep $(K))

typecheck: ## mypy on the backend, astro check and vue-tsc on the frontend
	cd backend && uv run mypy app tests
	cd frontend && pnpm typecheck
