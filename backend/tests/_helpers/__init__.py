"""
Plain functions and fakes that tests import directly (unlike fixtures, which
pytest injects). Keep them domain-agnostic, e.g. a client pointed at an
unreachable service; a helper only one module's tests use lives in that
module's test folder.
"""
