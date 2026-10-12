"""
Kalens (the scheduling engine) as a dependency: pinned and importable. Its
routers and migrations are wired in story 5.
"""

import tomllib
from pathlib import Path
from typing import Any

import pytest

KALENS_REPO = "https://github.com/mayaberries/kalens.git"
KALENS_TAG = "v0.1.0-alpha.2"
UV_LOCK = Path(__file__).resolve().parents[1] / "uv.lock"


def _locked_package(name: str) -> dict[str, Any]:
    lock = tomllib.loads(UV_LOCK.read_text())
    package: dict[str, Any] = next(p for p in lock["package"] if p["name"] == name)
    return package


@pytest.mark.test_id("PLT-004")
def test_kalens_is_pinned_to_its_tag() -> None:
    # The lockfile, not pyproject.toml: it's what actually gets installed.
    source = _locked_package("kalens")["source"]

    assert source["git"].startswith(f"{KALENS_REPO}?tag={KALENS_TAG}#")


@pytest.mark.test_id("PLT-004")
def test_kalens_imports() -> None:
    import kalens

    # What story 5 wires the library with.
    assert callable(kalens.configure)
    assert kalens.AppointmentsIntegration
    # Kalens reads the connection pool where our lifespan puts it.
    assert kalens.Settings().database_state_attr == "_db"
