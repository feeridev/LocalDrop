# LocalDrop 📦

<img width="255" height="255" alt="Untitled design" src="https://github.com/user-attachments/assets/41f9eac2-7906-4ad5-a668-767b90275d99" />

A simple file sharing app for your local network.

LocalDrop is a web-based file sharing application built with **Python and FastAPI**.

The idea is simple: if computers are already connected to the same local network, why should you need cloud storage, messaging apps, or USB drives just to move a file from one machine to another?

LocalDrop is built around that idea.



---

## 🚀 Download for Windows

The easiest way to get started on Windows is to download the latest installer.

### [⬇️ Download LocalDrop for Windows](https://github.com/feeridev/LocalDrop/releases/latest)

Download the installer, run it, and LocalDrop will be installed on your Windows machine.

No Python installation is required.

After installation, LocalDrop can be launched from the **Desktop** or **Start Menu**.

Once running, open:

```text
http://127.0.0.1:8000
```

Other devices on the same local network can access it using:

```text
http://YOUR-PC-IP:8000
```

---

## ✨ What can it do?

### 👤 Accounts

* Register and login
* Session-based authentication
* Passwords hashed with Argon2
* Logout

### 🌍 Public files

Files uploaded here are available to authenticated users on the LocalDrop instance.

* Upload files
* Download files
* Delete your own files
* See file size
* See who uploaded a file
* See upload date
* File type icons

### 🔒 Private files

You can send a file directly to another LocalDrop user.

* Choose a recipient
* Upload a private file
* See files you've received
* See files you've sent
* Only the sender and recipient can download the file

### 📤 Upload experience

* Multiple file upload
* Drag & drop
* Upload progress
* File size display
* Upload status
* Filename handling

---

## 🛠️ Built with

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **SQLite**
* **Jinja2**
* **HTML / CSS / JavaScript**
* **Argon2**
* **Uvicorn**

---

## 📁 Project structure

```text
LocalDrop/
├── app/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── models/
│   ├── templates/
│   └── main.py
│
├── data/
│   ├── private/
│   └── public/
│
├── tests/
├── requirements.txt
├── .gitignore
└── README.md
```

The local database and uploaded files are intentionally **not included in Git**.

---

## 🚀 Run it from source

Clone the project:

```bash
git clone https://github.com/feeridev/LocalDrop.git
cd LocalDrop
```

Create a virtual environment:

```bash
python3 -m venv .venv
```

Activate it.

### Linux / macOS

```bash
source .venv/bin/activate
```

### Windows

```powershell
.venv\Scripts\activate
```

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

Start LocalDrop:

```bash
python -m uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000
```

---

## 🌐 Use it on your LAN

That's actually the main idea behind LocalDrop.

Start the server with:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Then another device on the same network can open:

```text
http://YOUR-PC-IP:8000
```

For example:

```text
http://192.168.1.100:8000
```

No cloud storage required.

---

## 💭 Why I'm building this

LocalDrop started with a real problem.

The original idea came from a need inside a company's local network: there was a simple need to move and share files between computers on the same network without relying on external cloud services, messaging apps, or USB drives.

Instead of building a one-off solution for that specific network, I decided to turn the idea into a standalone project that could be useful in other local network environments as well.

At the same time, I'm using LocalDrop as a way to get deeper into backend development, authentication, databases, file handling, permissions, and building a complete application from the ground up.

The goal is to keep improving it until it becomes something that is genuinely useful on a real local network.

---

## 🧪 Current status

LocalDrop is still a work in progress, but the core functionality is working.

Already working:

* [x] User registration
* [x] Login / logout
* [x] Sessions
* [x] Public file upload
* [x] Public file download
* [x] Private file transfers
* [x] Access control
* [x] File deletion
* [x] File metadata
* [x] File icons
* [x] Drag & drop
* [x] Multiple file upload
* [x] Upload progress
* [x] Windows executable
* [x] Windows installer
* [x] Desktop & Start Menu shortcuts
* [x] Windows firewall configuration
* [x] Runtime data stored separately from the application

Next things I want to work on:

* [ ] Search
* [ ] Sorting & filtering
* [ ] File preview
* [ ] Folders
* [ ] Rename files
* [ ] Share links
* [ ] Download as ZIP
* [ ] Settings / administration
* [ ] Better mobile UI
* [ ] Automatic updates

---

## 🔐 A note about security

LocalDrop is currently designed for **trusted local networks**.

It is not intended to be exposed directly to the public internet yet.

Before doing that, things like HTTPS, secure cookies, upload limits, rate limiting, stronger production configuration, and additional security checks need to be added.

---

## 📌 Roadmap

The project is being developed step by step.

New features will be added through separate commits so the Git history shows how LocalDrop evolves over time.

---

## 📥 Downloads

Windows installers are published through GitHub Releases.

[**View all LocalDrop releases →**](https://github.com/feeridev/LocalDrop/releases)

---

## 📄 License

LocalDrop is licensed under the MIT License.

Copyright (c) 2026 Farshad

<img width="255" height="255" alt="Untitled design" src="https://github.com/user-attachments/assets/25894d3a-c6ec-42de-8c49-1b3a2ba207aa" />
<img width="255" height="255" alt="Untitled design" src="https://github.com/user-attachments/assets/c1c53d3d-579b-4285-95ac-492671d98c3c" />
