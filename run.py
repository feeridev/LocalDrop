import os

import uvicorn

from app.main import app


if __name__ == "__main__":
    host = os.getenv("LOCALDROP_HOST", "0.0.0.0")
    port = int(os.getenv("LOCALDROP_PORT", "8000"))

    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
    )