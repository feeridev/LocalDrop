from fastapi import FastAPI

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