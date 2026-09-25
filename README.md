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
Installation
1. Clone the repository
git clone git@github.com:feeridev/LocalDrop.git
cd LocalDrop
2. Create a virtual environment
python3 -m venv .venv
3. Activate the virtual environment

Linux/macOS:

source .venv/bin/activate

Windows:

.venv\Scripts\activate
4. Install dependencies
python -m pip install -r requirements.txt
Running LocalDrop

Start the development server:

python -m uvicorn app.main:app --reload

Then open:

http://127.0.0.1:8000

For LAN access, run Uvicorn on all interfaces:

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

Other devices on the same network can then access LocalDrop using:

http://YOUR-COMPUTER-IP:8000

For example:

http://192.168.1.100:8000
How It Works

LocalDrop stores uploaded files locally instead of sending them to an
external cloud service.

Public files are stored separately from private files.

Private file access is controlled through the application database. A private
file can only be downloaded by its owner or the user it was sent to.

Passwords are never stored as plaintext. They are hashed using Argon2.

Current Development Status

LocalDrop is currently under active development.

Implemented:

 User registration
 Login/logout
 Session authentication
 Public file upload
 Public file download
 Private file transfer
 Access control
 File deletion
 File metadata
 File icons
 Drag & drop uploads
 Upload progress

Planned:

 Multi-file upload
 File search
 Sorting and filtering
 File preview
 Folder support
 File rename
 Share links
 ZIP downloads
 Administration/settings
 Improved mobile interface
 Windows desktop package
 Windows installer
Security Notes

LocalDrop is currently intended for trusted local network environments.

Before exposing the application to untrusted networks or the public internet,
additional security measures should be implemented, including production
configuration, secure cookies, HTTPS, upload limits, rate limiting, and
additional authorization controls.

Development

LocalDrop is being developed incrementally with Git.

Each major feature is developed and committed separately to keep the project
history easy to understand and maintain.
