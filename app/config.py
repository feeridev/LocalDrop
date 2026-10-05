
from pathlib import Path
import os
import sys


APP_NAME = "LocalDrop"
APP_VERSION = "0.1.0"

HOST = os.getenv("LOCALDROP_HOST", "0.0.0.0")
PORT = int(os.getenv("LOCALDROP_PORT", "8000"))


# ---------------------------------------------------------
# Application paths
# ---------------------------------------------------------

if getattr(sys, "frozen", False):
    BASE_DIR = Path(sys._MEIPASS)
else:
    BASE_DIR = Path(__file__).resolve().parent.parent


# ---------------------------------------------------------
# Runtime data
# ---------------------------------------------------------

if os.name == "nt":

    default_data_root = (
        Path(
            os.environ.get(
                "PROGRAMDATA",
                r"C:\ProgramData",
            )
        )
        / APP_NAME
    )

    DATA_ROOT = Path(
        os.environ.get(
            "LOCALDROP_DATA_DIR",
            str(default_data_root),
        )
    )

else:

    DATA_ROOT = Path(
        os.environ.get(
            "LOCALDROP_DATA_DIR",
            str(BASE_DIR / "data"),
        )
    )


DATABASE_PATH = DATA_ROOT / "localdrop.db"

PUBLIC_STORAGE = DATA_ROOT / "public"
PRIVATE_STORAGE = DATA_ROOT / "private"


# ---------------------------------------------------------
# Create runtime directories
# ---------------------------------------------------------

DATA_ROOT.mkdir(
    parents=True,
    exist_ok=True,
)

PUBLIC_STORAGE.mkdir(
    parents=True,
    exist_ok=True,
)

PRIVATE_STORAGE.mkdir(
    parents=True,
    exist_ok=True,
)


# ---------------------------------------------------------
# Bundled application resources
# ---------------------------------------------------------

STATIC_DIR = BASE_DIR / "app" / "static"
TEMPLATES_DIR = BASE_DIR / "app" / "templates"

