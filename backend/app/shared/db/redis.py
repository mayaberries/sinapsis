from redis.asyncio import Redis

from app.shared.config import Settings


def create_redis(settings: Settings) -> Redis:
    # The client connects lazily on its first command, so creating it never
    # fails while Redis is down.
    return Redis.from_url(str(settings.redis_url), socket_connect_timeout=2, socket_timeout=2)
