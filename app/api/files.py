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