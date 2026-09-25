# LocalDrop

Simple LAN file sharing made for local networks.

LocalDrop is a lightweight web-based file sharing application built with FastAPI.
It allows users on the same local network to upload, download, and share files
through a simple browser interface.

The project is designed to work well in environments where users need to
exchange files without relying on cloud storage or external file-sharing
services.

---

## Features

### Authentication
- User registration
- User login/logout
- Session-based authentication
- Password hashing with Argon2
- Active/inactive user support

### Public File Sharing
- Upload files to the public area
- View files shared by users
- Download public files
- Delete your own files
- File size tracking
- File owner information
- Upload timestamp

### Private File Sharing
- Send files directly to another registered user
- Recipient-based access control
- Separate received and sent file lists
- Only the sender and recipient can download private files

### Upload Experience
- Drag & drop file upload
- Upload progress indicator
- Upload status feedback
- File size display
- File type icons
- Filename sanitization

---

## Tech Stack

- Python 3.12
- FastAPI
- SQLAlchemy
- SQLite
- Jinja2
- HTML / CSS / JavaScript
- Argon2 password hashing
- Uvicorn

---

## Project Structure

```text
LocalDrop/
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   └── files.py
│   │
│   ├── auth/
│   │   ├── password.py
│   │   └── dependencies.py
│   │
│   ├── database/
│   │   └── database.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── session.py
│   │   ├── file.py
│   │   └── file_recipient.py
│   │
│   ├── templates/
│   │   ├── login.html
│   │   ├── register.html
│   │   └── dashboard.html
│   │
│   └── main.py
│
├── data/
│   ├── private/
│   ├── public/
│   └── localdrop.db
│
├── tests/
├── requirements.txt
├── .gitignore
└── README.md
