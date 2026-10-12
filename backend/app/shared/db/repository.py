from databases import Database


class BaseRepository:
    """
    Repositories only run SQL and return models (or `None`). Business rules
    and permission checks belong in services and dependencies.
    """

    def __init__(self, db: Database) -> None:
        self.db = db
