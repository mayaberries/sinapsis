from app.db.database import try_connect
from app.db.repositories.base import BaseRepository

PING_QUERY = "SELECT 1;"


class HealthRepository(BaseRepository):
    async def ping(self) -> bool:
        # Reconnects first, so PostgreSQL coming back after startup is seen.
        if not await try_connect(self.db):
            return False
        try:
            await self.db.execute(query=PING_QUERY)
        except Exception:
            return False
        return True
