import os

import uvicorn


if __name__ == "__main__":
    host = os.getenv("LOCALDROP_HOST", "0.0.0.0")
    port = int(os.getenv("LOCALDROP_PORT", "8000"))

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=False,
    )