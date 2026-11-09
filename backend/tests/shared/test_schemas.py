import pytest
from pydantic import ValidationError

from app.shared.schemas import CoreModel, InputModel


class InvoiceCreate(InputModel):
    number: str


class InvoicePublic(CoreModel):
    number: str


def test_input_models_reject_unknown_fields() -> None:
    with pytest.raises(ValidationError) as excinfo:
        InvoiceCreate.model_validate({"number": "A-1", "nmuber": "typo"})

    assert excinfo.value.errors()[0]["type"] == "extra_forbidden"


def test_other_models_still_ignore_unknown_fields() -> None:
    # Rows and responses may carry columns a model doesn't list.
    assert InvoicePublic.model_validate({"number": "A-1", "internal": "x"}).number == "A-1"
