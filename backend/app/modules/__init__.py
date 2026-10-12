"""
One package per module (a domain, not a table), with its layers inside as
files: routes → dependencies → service → repository → schemas. Larger modules
can split into sub-packages within themselves.

Other code only imports a module through its package (`app.modules.<name>`),
whose `__init__` is its public API. `make lint` enforces both rules
(import-linter, see pyproject.toml).
"""
