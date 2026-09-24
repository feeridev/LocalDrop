from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.files import router as files_router
from app.database.database import Base, engine
from app.models.file import File
from app.models.session import Session
from app.models.user import User
from app.models.file_recipient import FileRecipient

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="LocalDrop",
    description="Local network file sharing made simple.",
    version="0.1.0",
)


app.include_router(auth_router)
app.include_router(files_router)


@app.get("/")
def root():
    return {
        "application": "LocalDrop",
        "status": "running",
        "version": "0.1.0",
    }