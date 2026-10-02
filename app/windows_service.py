import servicemanager
import win32event
import win32service
import win32serviceutil

import uvicorn

from app.config import HOST, PORT
from app.main import app


class LocalDropService(
    win32serviceutil.ServiceFramework
):
    _svc_name_ = "LocalDrop"
    _svc_display_name_ = "LocalDrop File Sharing Service"
    _svc_description_ = (
        "LocalDrop LAN file sharing server."
    )
    _exe_args_ = "--service"

    def __init__(self, args):
        super().__init__(args)

        self.stop_event = win32event.CreateEvent(
            None,
            0,
            0,
            None,
        )

        self.server = None

    def SvcStop(self):
        self.ReportServiceStatus(
            win32service.SERVICE_STOP_PENDING
        )

        if self.server is not None:
            self.server.should_exit = True

        win32event.SetEvent(self.stop_event)

    def SvcDoRun(self):
        servicemanager.LogInfoMsg(
            "LocalDrop service started."
        )

        config = uvicorn.Config(
            app,
            host=HOST,
            port=PORT,
            reload=False,
            log_level="info",
        )

        self.server = uvicorn.Server(config)
        self.server.run()


if __name__ == "__main__":
    win32serviceutil.HandleCommandLine(
        LocalDropService
    )
