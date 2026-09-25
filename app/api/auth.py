
from datetime import datetime, timedelta, timezone
from secrets import token_urlsafe

from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    HTTPException,
    Response,
    status,
)
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.auth.dependencies import get_current_user
from app.auth.password import hash_password, verify_password
from app.database.database import get_db
from app.models.session import Session as SessionModel
from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


class RegisterRequest(BaseModel):
    username: str = Field(
        min_length=3,
        max_length=50,
    )

    password: str = Field(
        min_length=8,
        max_length=128,
    )


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register(
    request: RegisterRequest,
    db: DBSession = Depends(get_db),
):
    username = request.username.strip().lower()

    existing_user = db.scalar(
        select(User).where(
            User.username == username
        )
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists",
        )

    user = User(
        username=username,
        password_hash=hash_password(
            request.password
        ),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "username": user.username,
        "is_active": user.is_active,
    }

@router.get("/users")
def list_users(
    current_user: User = Depends(get_current_user),
    db: DBSession = Depends(get_db),
):
    users = db.scalars(
        select(User)
        .where(
            User.is_active.is_(True),
            User.id != current_user.id,
        )
        .order_by(User.username)
    ).all()

    return [
        {
            "id": user.id,
            "username": user.username,
        }
        for user in users
    ]

@router.post("/login")
def login(
    request: RegisterRequest,
    response: Response,
    db: DBSession = Depends(get_db),
):
    username = request.username.strip().lower()

    user = db.scalar(
        select(User).where(
            User.username == username
        )
    )

    if not user or not verify_password(
        request.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    session_id = token_urlsafe(48)

    session = SessionModel(
        id=session_id,
        user_id=user.id,
        expires_at=(
            datetime.now(timezone.utc).replace(
                tzinfo=None
            )
            + timedelta(days=7)
        ),
    )

    db.add(session)
    db.commit()

    response.set_cookie(
        key="localdrop_session",
        value=session_id,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=7 * 24 * 60 * 60,
    )

    return {
        "message": "Login successful",
        "username": user.username,
    }


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "is_active": current_user.is_active,
    }


@router.post("/logout")
def logout(
    response: Response,
    localdrop_session: str | None = Cookie(
        default=None
    ),
    db: DBSession = Depends(get_db),
):
    if localdrop_session:
        session = db.scalar(
            select(SessionModel).where(
                SessionModel.id == localdrop_session
            )
        )

        if session:
            db.delete(session)
            db.commit()

    response.delete_cookie(
        key="localdrop_session"
    )

    return {
        "message": "Logout successful"
    }