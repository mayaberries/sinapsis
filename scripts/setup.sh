#!/usr/bin/env bash
#
# setup.sh: check and install everything Sinapsis needs, from a fresh clone.
#
# It assumes nothing is installed yet (not even make), which is why it's plain
# bash. Safe to re-run: every step checks "is this already correct?" before
# acting. It never runs sudo: what needs it (Docker, make) is only reported,
# with the command to run yourself.
#
#   ./scripts/setup.sh                       # run every step
#   ./scripts/setup.sh --check               # report status only, install nothing
#   ./scripts/setup.sh --step node,pnpm      # run only these steps, comma-separated
#   ./scripts/setup.sh --list                # print the step names and exit
#   ./scripts/setup.sh --verbose             # show every command as it runs
#
# Flags combine in any order. `make setup` runs every step; `make doctor` runs
# them with --check.
#
# Versions come from the repo, not from this script:
#   Node    .nvmrc (and "engines" in frontend/package.json)
#   pnpm    "packageManager" in frontend/package.json
#   Python  backend/.python-version
#
# Written for bash 3.2, the version macOS ships: no associative arrays,
# no mapfile, no ${var,,}.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

NVM_INSTALL_VERSION="v0.40.3"
NODE_MIN_VERSION="22.12.0"
SERVICES=(postgres redis)

# Ordered list of valid step names; also the "run everything" default.
ALL_STEPS=(docker make uv python node pnpm deps browsers services)

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; }
step_header() { echo -e "\n▶ $1"; }
run()  { if $VERBOSE; then echo -e "${BLUE}  \$ $*${NC}"; fi; "$@"; }

FAILED_STEPS=()
fail_step() { err "$1"; FAILED_STEPS+=("$CURRENT_STEP"); }

os_name() { uname -s; }

# `version_gte 22.23.1 22.12.0` succeeds if the first is >= the second.
version_gte() {
    [[ "$(printf '%s\n%s\n' "$2" "$1" | sort -t. -k1,1n -k2,2n -k3,3n | head -1)" == "$2" ]]
}

node_version_wanted() { tr -d '[:space:]v' < "$REPO_ROOT/.nvmrc" 2>/dev/null || echo "22"; }
python_version_wanted() { tr -d '[:space:]' < "$REPO_ROOT/backend/.python-version" 2>/dev/null || echo "3.13"; }
pnpm_version_wanted() {
    # "packageManager": "pnpm@10.34.7" -> 10.34.7
    grep -o '"packageManager": *"pnpm@[^"]*"' "$REPO_ROOT/frontend/package.json" 2>/dev/null \
        | sed -E 's/.*pnpm@([^"+]*).*/\1/'
}

# Idempotently append an export line to the user's shell rc file, so it
# survives into new terminals (this script's own `export` dies with it).
persist_env_line() {
    local line="$1" rc_file
    case "$(basename "${SHELL:-bash}")" in
        zsh)  rc_file="$HOME/.zshrc" ;;
        bash) rc_file="$HOME/.bashrc"; [[ "$(os_name)" == "Darwin" ]] && rc_file="$HOME/.bash_profile" ;;
        *)    rc_file="$HOME/.profile" ;;
    esac
    touch "$rc_file"
    grep -qF "$line" "$rc_file" 2>/dev/null && return 0
    echo "$line" >> "$rc_file"
    warn "Added to $rc_file; open a new terminal, or run: source $rc_file"
}

# ---------------------------------------------------------------------------
# Flag parsing
# ---------------------------------------------------------------------------
CHECK_ONLY=false
VERBOSE=false
STEPS_TO_RUN=("${ALL_STEPS[@]}")

usage() {
    sed -n '3,/^$/p' "${BASH_SOURCE[0]}" | sed -e 's/^# \{0,1\}//'
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --check)
            CHECK_ONLY=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --step|-s)
            # Guards `--step` as the last argument ($2 unbound under `set -u`)
            # and `--step ""`, which would silently run nothing.
            if [[ $# -lt 2 || -z "$2" ]]; then
                err "--step requires a comma-separated list of step names (see --list)"
                exit 1
            fi
            IFS=',' read -ra STEPS_TO_RUN <<< "$2"
            for s in "${STEPS_TO_RUN[@]}"; do
                if [[ ! " ${ALL_STEPS[*]} " =~ " ${s} " ]]; then
                    err "Unknown step '$s'. Valid steps: ${ALL_STEPS[*]}"
                    exit 1
                fi
            done
            shift 2
            ;;
        --list)
            echo "Available steps (run with --step <name>[,<name>...]):"
            for s in "${ALL_STEPS[@]}"; do echo "  - $s"; done
            exit 0
            ;;
        --help|-h)
            usage
            ;;
        *)
            err "Unknown flag: $1 (use --help)"
            exit 1
            ;;
    esac
done

if $VERBOSE; then echo -e "${BLUE}  REPO_ROOT=$REPO_ROOT${NC}"; fi

# ---------------------------------------------------------------------------
# PATH helpers. Each run is a fresh process, so a tool a previous run installed
# may not be on PATH yet (its rc-file line only applies to new terminals).
# Steps that need a tool call these first.
# ---------------------------------------------------------------------------

# uv's installer puts it in ~/.local/bin; so does our pnpm fallback.
ensure_local_bin_on_path() {
    case ":$PATH:" in
        *":$HOME/.local/bin:"*) ;;
        *) export PATH="$HOME/.local/bin:$PATH" ;;
    esac
}

# nvm.sh isn't safe under `set -e`: it uses nonzero returns as control flow,
# which would silently kill this script. errexit is off around anything nvm.
load_nvm() {
    command -v nvm &>/dev/null && return 0
    export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
    [[ -s "$NVM_DIR/nvm.sh" ]] || return 1
    set +e
    # shellcheck disable=SC1091
    source "$NVM_DIR/nvm.sh" >/dev/null 2>&1
    set -e
    command -v nvm &>/dev/null
}

node_ok() {
    command -v node &>/dev/null || return 1
    version_gte "$(node -p 'process.versions.node' 2>/dev/null || echo 0.0.0)" "$NODE_MIN_VERSION"
}

# Puts a recent enough Node on PATH: the current one if it qualifies,
# otherwise the .nvmrc version through nvm, if nvm has it.
ensure_node_on_path() {
    node_ok && return 0
    if load_nvm; then
        set +e
        nvm use "$(node_version_wanted)" >/dev/null 2>&1
        set -e
    fi
    node_ok
}

# ---------------------------------------------------------------------------
step_docker() {
    step_header "Docker and Compose (PostgreSQL and Redis run in it)"

    if ! command -v docker &>/dev/null; then
        case "$(os_name)" in
            Darwin) fail_step "Docker not found. Install Docker Desktop (https://docs.docker.com/desktop/setup/install/mac-install/) or run: brew install --cask docker" ;;
            Linux)  fail_step "Docker not found. Install Docker Engine and the Compose plugin: https://docs.docker.com/engine/install/" ;;
            *)      fail_step "Docker not found: https://docs.docker.com/get-docker/" ;;
        esac
        return
    fi
    ok "docker found: $(docker --version)"

    if docker compose version &>/dev/null; then
        ok "compose found: $(docker compose version --short)"
    else
        fail_step "The Docker Compose plugin is missing (\`docker compose\`, not \`docker-compose\`): https://docs.docker.com/compose/install/"
        return
    fi

    if docker info &>/dev/null; then
        ok "Docker daemon is running"
    else
        fail_step "Docker is installed but its daemon isn't running. Start Docker Desktop (or \`sudo systemctl start docker\`) and re-run."
    fi
}

# ---------------------------------------------------------------------------
step_make() {
    step_header "make (runs the everyday commands)"

    if command -v make &>/dev/null; then
        ok "make found: $(make --version 2>/dev/null | head -1)"
        return
    fi
    case "$(os_name)" in
        Darwin) fail_step "make not found. Install the Command Line Tools: xcode-select --install" ;;
        Linux)  fail_step "make not found. Install it with your package manager, e.g.: sudo apt-get install make" ;;
        *)      fail_step "make not found." ;;
    esac
}

# ---------------------------------------------------------------------------
step_uv() {
    step_header "uv (backend dependencies and Python)"

    ensure_local_bin_on_path
    if command -v uv &>/dev/null; then
        ok "uv found: $(uv --version)"
        return
    fi
    if $CHECK_ONLY; then
        warn "uv not installed"
        return
    fi

    warn "uv not found, installing..."
    # The official installer puts uv in ~/.local/bin. It only adds that to
    # the shell's rc file when it isn't on PATH, and this script has already
    # put it there, so the line is persisted here instead.
    run bash -c "curl -LsSf https://astral.sh/uv/install.sh | sh"
    if command -v uv &>/dev/null; then
        persist_env_line 'export PATH="$HOME/.local/bin:$PATH"'
        ok "uv installed: $(uv --version)"
    else
        fail_step "uv install failed; see https://docs.astral.sh/uv/getting-started/installation/"
    fi
}

# ---------------------------------------------------------------------------
step_python() {
    local wanted
    wanted="$(python_version_wanted)"
    step_header "Python $wanted (managed by uv, separate from the system's)"

    ensure_local_bin_on_path
    if ! command -v uv &>/dev/null; then
        if $CHECK_ONLY; then warn "uv not installed; can't check Python"; else fail_step "uv not found; run the 'uv' step first"; fi
        return
    fi

    # --system skips virtualenvs (a .venv PyCharm made, say): only a real
    # interpreter counts.
    if uv python find --system "$wanted" &>/dev/null; then
        ok "Python $wanted found: $(uv python find --system "$wanted")"
    elif $CHECK_ONLY; then
        warn "Python $wanted not installed"
    else
        run uv python install "$wanted"
        ok "Python $wanted installed"
    fi
}

# ---------------------------------------------------------------------------
step_node() {
    local wanted
    wanted="$(node_version_wanted)"
    step_header "Node $wanted (at least $NODE_MIN_VERSION)"

    if ensure_node_on_path; then
        ok "Node $(node -v) found: $(command -v node)"
        if [[ "$(node -v | tr -d v | cut -d. -f1)" != "${wanted%%.*}" ]]; then
            warn "It isn't the Node $wanted in .nvmrc; it should work, but \`nvm use\` matches the team's"
        fi
        return
    fi

    if command -v node &>/dev/null; then
        warn "Node $(node -v) is older than $NODE_MIN_VERSION"
    else
        warn "Node not found"
    fi
    if $CHECK_ONLY; then return; fi

    if ! load_nvm; then
        warn "nvm not found, installing $NVM_INSTALL_VERSION..."
        # nvm's installer adds its own lines to the shell's rc file.
        run bash -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_INSTALL_VERSION}/install.sh | bash"
        load_nvm || { fail_step "nvm install failed; see https://github.com/nvm-sh/nvm"; return; }
    fi

    set +e
    run nvm install "$wanted"
    nvm use "$wanted" >/dev/null 2>&1
    set -e
    if node_ok; then
        ok "Node $(node -v) installed through nvm"
    else
        fail_step "Node install through nvm failed"
    fi
}

# ---------------------------------------------------------------------------
step_pnpm() {
    local wanted
    wanted="$(pnpm_version_wanted)"
    step_header "pnpm $wanted (frontend dependencies)"

    ensure_local_bin_on_path
    if command -v pnpm &>/dev/null && [[ "$(pnpm --version 2>/dev/null)" == "$wanted" ]]; then
        ok "pnpm $wanted found: $(command -v pnpm)"
        return
    fi
    if command -v pnpm &>/dev/null; then
        warn "pnpm $(pnpm --version) found; frontend/package.json pins $wanted"
    else
        warn "pnpm not found"
    fi
    if $CHECK_ONLY; then return; fi

    if ! ensure_node_on_path; then
        fail_step "Node not found; run the 'node' step first"
        return
    fi

    # Corepack ships with Node 22 and installs the pnpm that "packageManager"
    # pins. It writes its shims next to `node`; when that directory isn't
    # writable (a system Node), they go to ~/.local/bin instead.
    export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
    if ! command -v corepack &>/dev/null; then
        run npm install --global corepack
    fi
    if ! run corepack enable pnpm 2>/dev/null; then
        mkdir -p "$HOME/.local/bin"
        run corepack enable pnpm --install-directory "$HOME/.local/bin"
        persist_env_line 'export PATH="$HOME/.local/bin:$PATH"'
    fi
    hash -r
    (cd "$REPO_ROOT/frontend" && run corepack install >/dev/null)

    if command -v pnpm &>/dev/null && [[ "$(cd "$REPO_ROOT/frontend" && pnpm --version)" == "$wanted" ]]; then
        ok "pnpm $wanted ready"
    else
        fail_step "pnpm setup through corepack failed; try: npm install --global pnpm@$wanted"
    fi
}

# ---------------------------------------------------------------------------
step_deps() {
    step_header "Project dependencies (backend/.venv and frontend/node_modules)"

    ensure_local_bin_on_path
    if ! command -v uv &>/dev/null; then
        if $CHECK_ONLY; then warn "uv not installed; can't check the backend"; else fail_step "uv not found; run the 'uv' step first"; fi
    elif $CHECK_ONLY; then
        if (cd "$REPO_ROOT/backend" && uv sync --locked --check &>/dev/null); then
            ok "backend dependencies match uv.lock"
        else
            warn "backend dependencies are missing or don't match uv.lock"
        fi
    else
        (cd "$REPO_ROOT/backend" && run uv sync --locked)
        ok "backend dependencies installed"
    fi

    if ! ensure_node_on_path || ! command -v pnpm &>/dev/null; then
        if $CHECK_ONLY; then warn "Node or pnpm not installed; can't check the frontend"; else fail_step "Node or pnpm not found; run the 'node' and 'pnpm' steps first"; fi
    elif $CHECK_ONLY; then
        if [[ -f "$REPO_ROOT/frontend/node_modules/.modules.yaml" ]]; then
            ok "frontend dependencies installed"
        else
            warn "frontend dependencies not installed"
        fi
    else
        # Without a TTY, pnpm aborts instead of asking to rebuild node_modules
        # (e.g. after the pnpm store moved); just rebuild it.
        (cd "$REPO_ROOT/frontend" && run pnpm install --frozen-lockfile --config.confirmModulesPurge=false)
        ok "frontend dependencies installed"
    fi
}

# ---------------------------------------------------------------------------
# Every Playwright version pins its own browser builds; they're downloaded
# once into Playwright's cache (~/Library/Caches/ms-playwright on macOS), not
# into the repo.
playwright_browsers_missing() {
    (cd "$REPO_ROOT/frontend" && pnpm exec playwright install --dry-run chromium 2>/dev/null) \
        | sed -n 's/^ *Install location: *//p' \
        | while read -r dir; do [[ -d "$dir" ]] || echo "$dir"; done
}

step_browsers() {
    step_header "Playwright's Chromium (end-to-end tests)"

    if ! ensure_node_on_path || ! command -v pnpm &>/dev/null \
        || [[ ! -x "$REPO_ROOT/frontend/node_modules/.bin/playwright" ]]; then
        if $CHECK_ONLY; then warn "frontend dependencies not installed; can't check the browsers"; else fail_step "frontend dependencies not installed; run the 'deps' step first"; fi
        return
    fi

    local missing
    missing="$(playwright_browsers_missing)"
    if [[ -z "$missing" ]]; then
        ok "Chromium for Playwright installed"
    elif $CHECK_ONLY; then
        warn "Chromium for Playwright not installed"
    else
        (cd "$REPO_ROOT/frontend" && run pnpm test:e2e:install)
        if [[ -z "$(playwright_browsers_missing)" ]]; then
            ok "Chromium for Playwright installed"
        else
            fail_step "Playwright's browser download failed; run \`cd frontend && pnpm test:e2e:install\` to see why"
        fi
    fi
}

# ---------------------------------------------------------------------------
compose() { (cd "$REPO_ROOT" && run docker compose "$@"); }

service_running() {
    (cd "$REPO_ROOT" && docker compose ps --status running --services 2>/dev/null) | grep -qx "$1"
}

# Reports a port that something other than our containers is listening on.
check_port_free() {
    local name="$1" port="$2" setting="$3"
    command -v lsof &>/dev/null || return 0
    if lsof -nP -iTCP:"$port" -sTCP:LISTEN &>/dev/null; then
        warn "Port $port is taken by another process, so $name can't start on it."
        warn "Set $setting in .env (copy .env.example) and update its URL to match."
    fi
}

check_ports() {
    service_running postgres || check_port_free "PostgreSQL" "${POSTGRES_PORT:-5432}" POSTGRES_PORT
    service_running redis || check_port_free "Redis" "${REDIS_PORT:-6379}" REDIS_PORT
}

step_services() {
    step_header "PostgreSQL and Redis (Docker Compose) and migrations"

    if ! docker info &>/dev/null; then
        if $CHECK_ONLY; then warn "Docker isn't running; can't check the services"; else fail_step "Docker isn't running; see the 'docker' step"; fi
        return
    fi

    local all_running=true svc
    for svc in "${SERVICES[@]}"; do
        if service_running "$svc"; then
            ok "$svc running"
        else
            all_running=false
            warn "$svc not running"
        fi
    done

    if $CHECK_ONLY; then
        $all_running || check_ports
        return
    fi

    if ! $all_running; then
        if ! compose up -d --wait; then
            check_ports
            fail_step "Couldn't start the services; see the output above"
            return
        fi
        ok "services started"
    fi

    ensure_local_bin_on_path
    if [[ -d "$REPO_ROOT/backend/.venv" ]]; then
        (cd "$REPO_ROOT/backend" && run uv run alembic upgrade head >/dev/null 2>&1) \
            && ok "migrations applied" \
            || fail_step "migrations failed; run \`make migrate\` to see why"
    else
        warn "backend dependencies not installed; run the 'deps' step, then \`make migrate\`"
    fi
}

# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------
echo "Running step(s): ${STEPS_TO_RUN[*]}$($CHECK_ONLY && echo ' (--check, no changes will be made)')"

for CURRENT_STEP in "${STEPS_TO_RUN[@]}"; do
    "step_${CURRENT_STEP}"
done

echo -e "\n----------------------------------------"
if [[ ${#FAILED_STEPS[@]} -gt 0 ]]; then
    err "Needs your attention: ${FAILED_STEPS[*]}. Fix what's reported above and re-run."
    exit 1
fi

if $CHECK_ONLY; then
    echo "Check complete. Re-run without --check to install anything missing above."
    echo "Tip: narrow it down with --step <name>; see --list."
else
    ok "Step(s) complete: ${STEPS_TO_RUN[*]}"
    if [[ "${STEPS_TO_RUN[*]}" == "${ALL_STEPS[*]}" ]]; then
        echo "Next steps:"
        echo "  open a new terminal (or source your shell's rc file) if anything was installed"
        echo "  make dev                     # backend on :8000, frontend on :4321"
        echo "  make test                    # backend, component and end-to-end tests"
        echo "  open http://localhost:8000/health"
    fi
fi
