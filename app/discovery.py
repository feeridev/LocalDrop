import socket
import threading

from zeroconf import ServiceInfo, Zeroconf

from app.config import APP_NAME, PORT


SERVICE_TYPE = "_http._tcp.local."
SERVICE_NAME = "LocalDrop._http._tcp.local."


class LocalDropDiscovery:
    def __init__(self):
        self.zeroconf = None
        self.service_info = None
        self.thread = None

    @staticmethod
    def get_local_ip():
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

        try:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
        except OSError:
            return "127.0.0.1"
        finally:
            sock.close()

    def start(self):
        if self.zeroconf is not None:
            return

        ip = self.get_local_ip()

        self.zeroconf = Zeroconf()

        self.service_info = ServiceInfo(
            SERVICE_TYPE,
            SERVICE_NAME,
            addresses=[socket.inet_aton(ip)],
            port=PORT,
            properties={
                b"name": APP_NAME.encode(),
                b"version": b"0.1.0",
                b"url": f"http://{ip}:{PORT}".encode(),
            },
        )

        self.zeroconf.register_service(self.service_info)

    def stop(self):
        if self.zeroconf is None:
            return

        try:
            if self.service_info is not None:
                self.zeroconf.unregister_service(
                    self.service_info
                )
        finally:
            self.zeroconf.close()
            self.zeroconf = None
            self.service_info = None


discovery = LocalDropDiscovery()
