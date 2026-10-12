.DEFAULT_GOAL := help
.PHONY: help setup dev services-up services-down services-reset backend frontend migrate gen-api lint format typecheck

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "} {printf "  %-15s %s\n", $$1, $$2}'

setup: services-up ## Start PostgreSQL and Redis, install backend and frontend dependencies, run migrations
	cd backend && uv sync
	cd frontend && pnpm install
	$(MAKE) migrate

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

lint: ## Ruff on the backend, ESLint on the frontend
	cd backend && uv run ruff check . && uv run ruff format --check .
	cd frontend && pnpm lint

format: ## Format the backend with Ruff and fix ESLint issues on the frontend
	cd backend && uv run ruff format . && uv run ruff check --fix .
	cd frontend && pnpm lint --fix

typecheck: ## mypy on the backend, astro check and vue-tsc on the frontend
	cd backend && uv run mypy app
	cd frontend && pnpm typecheck
