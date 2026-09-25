from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.auth import router as auth_router
from app.api.files import router as files_router
from app.database.database import Base, engine
from app.models.file import File
from app.models.session import Session
from app.models.user import User
from app.models.file_recipient import FileRecipient
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
templates = Jinja2Templates(directory="app/templates")
from fastapi import Depends
from app.auth.dependencies import get_current_user
from app.models.user import User

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="LocalDrop",
    description="Local network file sharing made simple.",
    version="0.1.0",
)

app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static",
)

templates = Jinja2Templates(directory="app/templates")

app.include_router(auth_router)
app.include_router(files_router)


@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={},
    )
@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(
    request: Request,
    current_user: User = Depends(get_current_user),
):
    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={
            "username": current_user.username,
        },
    )
@app.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="register.html",
        context={},
    )