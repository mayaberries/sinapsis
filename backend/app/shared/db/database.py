import logging

from databases import Database

from app.shared.config import Settings

logger = logging.getLogger(__name__)


def create_database(settings: Settings) -> Database:
    return Database(
        settings.effective_database_url,
        min_size=2,
        max_size=10,
        force_rollback=settings.testing,
    )


async def try_connect(database: Database) -> bool:
    """
    Connects if not connected yet. Never raises: the app has to start, and
    `/health` has to answer, even while PostgreSQL is down.
    """
    if database.is_connected:
        return True
    try:
        await database.connect()
    except Exception:
        logger.warning("PostgreSQL unreachable", exc_info=True)
        return False
    return True


async def disconnect(database: Database) -> None:
    if database.is_connected:
        await database.disconnect()
