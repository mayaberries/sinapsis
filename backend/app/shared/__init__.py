"""
Domain-agnostic code every module can use: config, database and Redis
clients, base repository, base schemas, domain errors and their HTTP mapping.
Nothing here imports from `app.modules`. If only some modules need something,
it belongs to one of them, exported through its public API.
"""
