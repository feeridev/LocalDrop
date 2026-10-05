#define MyAppName "LocalDrop"
#define MyAppVersion "0.1.0"
#define MyAppPublisher "Farshad"
#define MyAppExeName "LocalDrop.exe"

#ifndef BuildDir
  #define BuildDir "..\dist\LocalDrop"
#endif


[Setup]

AppId={{8A6D5B1C-4D2E-4A9E-B8F2-LOCALDROP2026}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}

DefaultDirName={autopf}\LocalDrop
DefaultGroupName=LocalDrop

OutputDir=..\installer-output
OutputBaseFilename=LocalDrop-Setup

SetupIconFile=..\ldrop.ico

Compression=lzma
SolidCompression=yes

PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64

DisableProgramGroupPage=yes

UninstallDisplayIcon={app}\ldrop.ico


[Files]

Source: "{#BuildDir}\*"; \
    DestDir: "{app}"; \
    Flags: ignoreversion recursesubdirs createallsubdirs

Source: "..\ldrop.ico"; \
    DestDir: "{app}"; \
    Flags: ignoreversion


[Dirs]

Name: "{commonappdata}\LocalDrop"; \
    Permissions: users-modify

Name: "{commonappdata}\LocalDrop\public"; \
    Permissions: users-modify

Name: "{commonappdata}\LocalDrop\private"; \
    Permissions: users-modify


[Icons]

Name: "{autodesktop}\LocalDrop"; \
    Filename: "{app}\{#MyAppExeName}"; \
    IconFilename: "{app}\ldrop.ico"

Name: "{group}\LocalDrop"; \
    Filename: "{app}\{#MyAppExeName}"; \
    IconFilename: "{app}\ldrop.ico"


[Registry]

Root: HKCU; \
    Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; \
    ValueType: string; \
    ValueName: "LocalDrop"; \
    ValueData: """{app}\{#MyAppExeName}"""; \
    Flags: uninsdeletevalue


[Run]

Filename: "netsh.exe"; \
    Parameters: "advfirewall firewall add rule name=""LocalDrop"" dir=in action=allow protocol=TCP localport=8000"; \
    Flags: runhidden waituntilterminated

Filename: "{app}\{#MyAppExeName}"; \
    Description: "Launch LocalDrop"; \
    Flags: nowait postinstall skipifsilent


[UninstallRun]

Filename: "netsh.exe"; \
    Parameters: "advfirewall firewall delete rule name=""LocalDrop"""; \
    Flags: runhidden waituntilterminated