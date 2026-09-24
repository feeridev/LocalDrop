from pathlib import Path
from secrets import token_hex

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.file import File
from app.models.user import User
from app.models.file_recipient import FileRecipient


router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


PUBLIC_STORAGE = Path("data/public")
PUBLIC_STORAGE.mkdir(parents=True, exist_ok=True)


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_file(
    uploaded_file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not uploaded_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required",
        )

    original_name = Path(uploaded_file.filename).name

    extension = Path(original_name).suffix

    stored_name = f"{token_hex(16)}{extension}"

    destination = PUBLIC_STORAGE / stored_name

    with destination.open("wb") as file:
        while chunk := await uploaded_file.read(1024 * 1024):
            file.write(chunk)

    record = File(
        owner_id=current_user.id,
        original_name=original_name,
        stored_name=stored_name,
        storage_path=str(destination),
        visibility="public",
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "filename": record.original_name,
        "visibility": record.visibility,
    }


@router.get("/")
def list_files(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    files = db.scalars(
        select(File)
        .where(File.visibility == "public")
        .order_by(File.created_at.desc())
    ).all()

    return [
        {
            "id": file.id,
            "filename": file.original_name,
            "visibility": file.visibility,
            "created_at": file.created_at,
        }
        for file in files
    ]

@router.post("/private/upload", status_code=status.HTTP_201_CREATED)
async def upload_private_file(
    uploaded_file: UploadFile,
    recipient_username: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not uploaded_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required",
        )

    recipient_username = recipient_username.strip().lower()

    recipient = db.scalar(
        select(User).where(
            User.username == recipient_username
        )
    )

    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found",
        )

    if recipient.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot send a private file to yourself",
        )

    original_name = Path(uploaded_file.filename).name
    extension = Path(original_name).suffix
    stored_name = f"{token_hex(16)}{extension}"

    private_storage = Path("data/private")
    private_storage.mkdir(parents=True, exist_ok=True)

    destination = private_storage / stored_name

    with destination.open("wb") as file:
        while chunk := await uploaded_file.read(1024 * 1024):
            file.write(chunk)

    record = File(
        owner_id=current_user.id,
        original_name=original_name,
        stored_name=stored_name,
        storage_path=str(destination),
        visibility="private",
    )

    db.add(record)
    db.flush()

    recipient_record = FileRecipient(
        file_id=record.id,
        recipient_id=recipient.id,
    )

    db.add(recipient_record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "filename": record.original_name,
        "visibility": record.visibility,
        "sender": current_user.username,
        "recipient": recipient.username,
    }


@router.get("/private/received")
def list_received_files(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    files = db.scalars(
        select(File)
        .join(
            FileRecipient,
            FileRecipient.file_id == File.id,
        )
        .where(
            FileRecipient.recipient_id == current_user.id,
            File.visibility == "private",
        )
        .order_by(File.created_at.desc())
    ).all()

    return [
        {
            "id": file.id,
            "filename": file.original_name,
            "sender_id": file.owner_id,
            "visibility": file.visibility,
            "created_at": file.created_at,
        }
        for file in files
    ]


@router.get("/private/sent")
def list_sent_files(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    files = db.scalars(
        select(File)
        .where(
            File.owner_id == current_user.id,
            File.visibility == "private",
        )
        .order_by(File.created_at.desc())
    ).all()

    return [
        {
            "id": file.id,
            "filename": file.original_name,
            "visibility": file.visibility,
            "created_at": file.created_at,
        }
        for file in files
    ]

@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    file_record = db.scalar(
        select(File).where(File.id == file_id)
    )

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    # Public files are available to authenticated users.
    if file_record.visibility == "public":
        allowed = True

    # Private files are available only to the owner or recipient.
    elif file_record.visibility == "private":
        is_owner = file_record.owner_id == current_user.id

        is_recipient = db.scalar(
            select(FileRecipient).where(
                FileRecipient.file_id == file_record.id,
                FileRecipient.recipient_id == current_user.id,
            )
        ) is not None

        allowed = is_owner or is_recipient

    else:
        allowed = False

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to download this file",
        )

    file_path = Path(file_record.storage_path)

    if not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stored file not found",
        )

    return FileResponse(
        path=file_path,
        filename=file_record.original_name,
        media_type="application/octet-stream",
    )