import os
import sys
import threading
import time
import webbrowser

import uvicorn

from app.main import app
from app.config import HOST, PORT


def open_browser():
    time.sleep(1.5)

    webbrowser.open(
        f"http://127.0.0.1:{PORT}"
    )


def run_application():
    threading.Thread(
        target=open_browser,
        daemon=True,
    ).start()

    uvicorn.run(
        app,
        host=HOST,
        port=PORT,
        reload=False,
    )


if __name__ == "__main__":

    if (
        sys.platform == "win32"
        and "--service" in sys.argv
    ):
        import servicemanager
        from app.windows_service import (
            LocalDropService,
        )

        servicemanager.Initialize(
            LocalDropService._svc_name_,
            None,
        )

        servicemanager.PrepareToHostSingle(
            LocalDropService
        )

        servicemanager.StartServiceCtrlDispatcher()

    elif (
        sys.platform == "win32"
        and len(sys.argv) > 1
        and sys.argv[1] in {
            "install",
            "update",
            "remove",
            "start",
            "stop",
            "restart",
            "debug",
        }
    ):
        import win32serviceutil

        from app.windows_service import (
            LocalDropService,
        )

        win32serviceutil.HandleCommandLine(
            LocalDropService
        )

    else:
        run_application()