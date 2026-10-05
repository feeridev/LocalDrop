
# -*- mode: python ; coding: utf-8 -*-

from pathlib import Path


PROJECT_ROOT = Path.cwd()


datas = [
    (
        str(PROJECT_ROOT / "app" / "static"),
        "app/static",
    ),
    (
        str(PROJECT_ROOT / "app" / "templates"),
        "app/templates",
    ),
]


a = Analysis(
    ["run.py"],
    pathex=[str(PROJECT_ROOT)],
    binaries=[],
    datas=datas,
    hiddenimports=[
        "app",
        "app.config",
        "app.main",
        "app.discovery",
        "app.api",
        "app.api.auth",
        "app.api.files",
        "app.auth",
        "app.auth.dependencies",
        "app.auth.password",
        "app.database",
        "app.database.database",
        "app.models",
        "app.models.file",
        "app.models.file_recipient",
        "app.models.session",
        "app.models.user",
        "zeroconf",
        "zeroconf._core",
        "zeroconf._services.info",
        "zeroconf._services.registry",
        "zeroconf._utils.name",
        "zeroconf._utils.ipaddress",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)


pyz = PYZ(
    a.pure
)


exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="LocalDrop",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    icon=str(PROJECT_ROOT / "ldrop.ico"),
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)


coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="LocalDrop",
)

