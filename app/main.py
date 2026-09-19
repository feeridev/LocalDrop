from fastapi import FastAPI

from app.database.database import Base, engine
from app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LocalDrop",
    description="Local network file sharing made simple.",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "application": "LocalDrop",
        "status": "running",
        "version": "0.1.0",
    }