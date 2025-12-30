from fastapi import APIRouter

from app.api import chat, upload


api_router = APIRouter()
api_router.include_router(chat.router)
api_router.include_router(upload.router)
