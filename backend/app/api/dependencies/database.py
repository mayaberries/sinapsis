from collections.abc import Callable
from typing import Annotated

from databases import Database
from fastapi import Depends, Request

from app.db.repositories.base import BaseRepository


def get_database(request: Request) -> Database:
    database: Database = request.app.state._db
    return database


DatabaseDep = Annotated[Database, Depends(get_database)]


def get_repository[RepoT: BaseRepository](repo_type: type[RepoT]) -> Callable[[Database], RepoT]:
    def get_repo(db: DatabaseDep) -> RepoT:
        return repo_type(db)

    return get_repo
