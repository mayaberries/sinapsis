"""
Raw SQL migrations, no SQLAlchemy metadata: the app talks to PostgreSQL
through `databases` with plain queries, as Kalens does.

With `TESTING=1`, migrations run against a freshly recreated
`<database>_test` instead.
"""

import logging
from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine, engine_from_config, pool, text

from app.core.config import get_settings

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)
logger = logging.getLogger("alembic.env")

settings = get_settings()


def _recreate_test_database() -> None:
    database = str(settings.database_url).rsplit("/", 1)[-1]
    engine = create_engine(str(settings.database_url), isolation_level="AUTOCOMMIT")
    with engine.connect() as connection:
        connection.execute(text(f'DROP DATABASE IF EXISTS "{database}_test"'))
        connection.execute(text(f'CREATE DATABASE "{database}_test"'))


def run_migrations_online() -> None:
    if settings.testing:
        _recreate_test_database()

    config.set_main_option("sqlalchemy.url", settings.effective_database_url)
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=None)
        with context.begin_transaction():
            context.run_migrations()


def run_migrations_offline() -> None:
    if settings.testing:
        raise RuntimeError("Test migrations can't run offline.")

    context.configure(url=settings.effective_database_url, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


if context.is_offline_mode():
    logger.info("Running migrations offline")
    run_migrations_offline()
else:
    logger.info("Running migrations online")
    run_migrations_online()
