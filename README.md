# LocalDrop 📦

<p align="center">
  <img src="https://github.com/user-attachments/assets/41f9eac2-7906-4ad5-a668-767b90275d99" alt="LocalDrop logo" width="190" />
</p>

<p align="center">
  <strong>Simple, private file sharing over your local network.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Working%20Prototype-2EA44F?style=for-the-badge" alt="Working Prototype" />
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=flat-square" alt="SQLAlchemy" />
  <img src="https://img.shields.io/badge/Jinja2-Templates-B41717?style=flat-square" alt="Jinja2" />
  <img src="https://img.shields.io/badge/HTML--CSS--JavaScript-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML, CSS and JavaScript" />
  <img src="https://img.shields.io/badge/Argon2-Password%20Hashing-6C5CE7?style=flat-square" alt="Argon2" />
  <img src="https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows&logoColor=white" alt="Windows installer" />
</p>

---

## 🚀 Download for Windows

<p align="center">
  <a href="https://github.com/feeridev/LocalDrop/releases/latest">
    <img src="https://img.shields.io/badge/Download-LocalDrop%20for%20Windows-238636?style=for-the-badge&logo=windows&logoColor=white" alt="Download LocalDrop for Windows" />
  </a>
</p>

The easiest way to get started is to download the latest Windows installer.

- No separate Python installation required.
- Launch LocalDrop from the Desktop or Start Menu.
- Share files with other devices connected to the same local network.

After starting LocalDrop, open:

```text
http://127.0.0.1:8000
```

Other devices on the same network can access it using your computer's LAN IP address:

```text
http://YOUR-PC-IP:8000
```

**[Browse all releases →](https://github.com/feeridev/LocalDrop/releases)**

---

## 💡 What is LocalDrop?

LocalDrop is a web-based file-sharing application built with **Python and FastAPI**.

The idea is simple: if computers are already connected to the same local network, why should you need cloud storage, messaging apps, or USB drives just to move a file from one machine to another?

LocalDrop provides a shared place to upload, download, and transfer files between authenticated users on the same LocalDrop instance.

No external cloud storage is required.

## ✨ Features

### 👤 Accounts & authentication

- User registration and login
- Session-based authentication
- Password hashing with Argon2
- Logout

### 🌍 Public files

Upload files to make them available to authenticated users on the LocalDrop instance.

- Upload and download files
- Delete your own files
- Display file size and upload date
- Show uploader information
- File-type icons

### 🔒 Private file transfers

Send files directly to another registered LocalDrop user.

- Choose a recipient
- Upload private files
- View received files
- View sent files
- Restrict downloads to the sender and recipient

### 📤 Upload experience

- Multiple-file uploads
- Drag and drop
- Upload progress indicators
- File-size display
- Upload status
- Filename handling

---

## 🛠️ Built with

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | Web framework and API |
| SQLAlchemy | Database ORM |
| SQLite | Local database |
| Jinja2 | HTML templating |
| HTML, CSS and JavaScript | User interface |
| Argon2 | Password hashing |
| Uvicorn | ASGI server |

## 🧱 Project Structure

```text
LocalDrop/
├── app/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── templates/
│   └── main.py
├── data/
│   ├── private/
│   └── public/
├── tests/
├── requirements.txt
├── .gitignore
└── README.md
```

The local database and uploaded files are intentionally excluded from Git. Runtime data is stored separately from the application.

---

## ⚙️ Run from Source

### Prerequisites

- Python 3.10 or newer
- Git
- pip

### 1. Clone the repository

```bash
git clone https://github.com/feeridev/LocalDrop.git
cd LocalDrop
```

### 2. Create a virtual environment

```bash
python3 -m venv .venv
```

Activate it.

**Linux / macOS**

```bash
source .venv/bin/activate
```

**Windows PowerShell**

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
python -m pip install -r requirements.txt
```

### 4. Start LocalDrop

```bash
python -m uvicorn app.main:app --reload
```

Open the application at:

```text
http://127.0.0.1:8000
```

---

## 🌐 Use LocalDrop on Your LAN

LocalDrop is designed to make file sharing between devices on the same network straightforward.

Start the server with:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Find the host computer's local IP address, then open the following address on another device:

```text
http://YOUR-PC-IP:8000
```

For example:

```text
http://192.168.1.100:8000
```

Make sure the host firewall allows the connection and that both devices can communicate over the local network.

---

## 🎯 Why I'm Building This

LocalDrop started with a practical problem: sharing files between computers on a company's local network without depending on external cloud services, messaging apps, or USB drives.

Instead of building a one-off solution for a specific network, I decided to turn the idea into a standalone application that could be useful in other local network environments.

I'm also using LocalDrop to deepen my understanding of backend development, authentication, databases, file handling, access control, and building a complete application from the ground up.

The goal is to keep improving it until it becomes genuinely useful in real-world local network environments.

## 📊 Current Status

LocalDrop is a work in progress, with its core file-sharing functionality implemented.

### Implemented

- [x] User registration
- [x] Login and logout
- [x] Session-based authentication
- [x] Public file uploads and downloads
- [x] Private file transfers
- [x] Access control
- [x] File deletion
- [x] File metadata and type icons
- [x] Drag-and-drop uploads
- [x] Multiple-file uploads
- [x] Upload progress
- [x] Windows executable and installer
- [x] Desktop and Start Menu shortcuts
- [x] Windows firewall configuration
- [x] Runtime data stored separately from the application

### Planned

- [ ] Search
- [ ] Sorting and filtering
- [ ] File previews
- [ ] Folders
- [ ] Rename files
- [ ] Share links
- [ ] Download as ZIP
- [ ] Settings and administration
- [ ] Improved mobile UI
- [ ] Automatic updates

## 🔐 Security Considerations

LocalDrop is currently designed for **trusted local networks**. It is not intended to be exposed directly to the public internet in its current state.

Before considering public deployment, additional safeguards are needed, including HTTPS, secure cookie configuration, upload limits, rate limiting, production hardening, and further security testing.

## 🗺️ Development Roadmap

LocalDrop is developed incrementally, with features added through separate commits to keep the project's Git history useful and understandable.

The roadmap will evolve as the application matures and new requirements emerge.

## 📥 Releases

Windows installers are published through GitHub Releases.

<p align="center">
  <a href="https://github.com/feeridev/LocalDrop/releases">
    <img src="https://img.shields.io/badge/View-All%20Releases-181717?style=for-the-badge&logo=github&logoColor=white" alt="View all LocalDrop releases" />
  </a>
</p>

## 📄 License

LocalDrop is licensed under the MIT License.

Copyright © 2026 Farshad

---

<p align="center">
  <sub>Built to make sharing files on a local network simpler.</sub>
</p>
