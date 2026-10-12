"""
Clients pointed at services that aren't there, to simulate PostgreSQL or Redis
being down without stopping the containers. Port 1 is reserved and nothing
listens on it, so connecting fails fast.
"""

from databases import Database
from redis.asyncio import Redis

UNREACHABLE_DATABASE_URL = "postgresql://sinapsis:sinapsis@127.0.0.1:1/sinapsis"
UNREACHABLE_REDIS_URL = "redis://127.0.0.1:1/0"


def unreachable_database() -> Database:
    return Database(UNREACHABLE_DATABASE_URL)


def unreachable_redis() -> Redis:
    return Redis.from_url(UNREACHABLE_REDIS_URL, socket_connect_timeout=1, socket_timeout=1)
