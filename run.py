import threading
import time
import webbrowser
import sqlite3

import uvicorn

from app.config import HOST, PORT


print(
    "LOCALDROP DATA PATH:",
    __import__("app.config", fromlist=["DATA_ROOT"]).DATA_ROOT,
)

print(
    "LOCALDROP DATABASE:",
    __import__("app.config", fromlist=["DATABASE_PATH"]).DATABASE_PATH,
)


# ---------------------------------------------------------
# SQLite diagnostic test
# ---------------------------------------------------------

test_db = r"C:\ProgramData\LocalDrop\sqlite-test-from-exe.db"

print("SQLITE MODULE:", sqlite3.__file__)
print("SQLITE VERSION:", sqlite3.sqlite_version)

try:
    conn = sqlite3.connect(test_db)

    conn.execute(
        "CREATE TABLE IF NOT EXISTS test (id INTEGER)"
    )

    conn.close()

    print("SQLITE EXE TEST: OK")

except Exception as e:

    print(
        "SQLITE EXE TEST: FAILED:",
        repr(e),
    )


# ---------------------------------------------------------
# Application
# ---------------------------------------------------------

from app.main import app


def open_browser():
    time.sleep(1.5)

    webbrowser.open(
        f"http://127.0.0.1:{PORT}"
    )


if __name__ == "__main__":

    threading.Thread(
        target=open_browser,
        daemon=True,
    ).start()

    uvicorn.run(
        app,
        host=HOST,
        port=PORT,
        reload=False,
        log_config=None,
    )