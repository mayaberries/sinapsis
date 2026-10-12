"""
Prints the API's OpenAPI schema to stdout without starting the server or
touching the database. The frontend generates its typed client from it:
`make gen-api`.
"""

import json

from app.main import create_app


def main() -> None:
    print(json.dumps(create_app().openapi(), indent=2))


if __name__ == "__main__":
    main()
