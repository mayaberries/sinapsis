from datetime import UTC, datetime

from pydantic import BaseModel, ConfigDict, field_validator


class CoreModel(BaseModel):
    """
    Any common logic to be shared by all models goes here.
    """


class InputModel(CoreModel):
    """
    Every request body. Unknown fields are a 422, not silently dropped: a
    typo'd or unsupported field must not look like it was accepted.
    """

    model_config = ConfigDict(extra="forbid")


class DateTimeModelMixin(BaseModel):
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @field_validator("created_at", "updated_at", mode="before")
    @classmethod
    def default_datetime(cls, value: datetime | None) -> datetime:
        return value or datetime.now(UTC)


class IDModelMixin(BaseModel):
    id: str
