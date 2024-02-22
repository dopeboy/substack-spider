import typesense

from django.conf import settings

client = typesense.Client({
    "api_key": settings.TYPESENSE_KEY,
    "nodes": [{
        "host": settings.TYPESENSE_HOST,
        "port": settings.TYPESENSE_PORT,
        "protocol": "https",
    }],
    "connection_timeout_seconds": 2,
})
