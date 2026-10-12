from functools import lru_cache

from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Read from the environment, then from the repo root's `.env` (see
    `.env.example`). Everything has a default that matches Docker Compose, so
    a fresh clone runs without an `.env` at all.
    """

    model_config = SettingsConfigDict(env_file=("../.env", ".env"), extra="ignore")

    project_name: str = "Sinapsis"
    version: str = "0.1.0"
    api_prefix: str = "/api"

    database_url: PostgresDsn = PostgresDsn(
        "postgresql://sinapsis:sinapsis@localhost:5432/sinapsis"
    )
    redis_url: RedisDsn = RedisDsn("redis://localhost:6379/0")
    # Set by the test harness: connects to `<database>_test` and rolls back
    # every transaction.
    testing: bool = False

    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:4321"])

    @property
    def effective_database_url(self) -> str:
        url = str(self.database_url)
        return f"{url}_test" if self.testing else url


@lru_cache
def get_settings() -> Settings:
    return Settings()
