from fastapi import APIRouter

from app.core.security import SecurityDependency
from app.models.chat import ChatRequest, ChatResponse
from app.services.rag_chain import get_rag_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/ask", response_model=ChatResponse, dependencies=[SecurityDependency])
def ask_chat(request: ChatRequest) -> ChatResponse:
    service = get_rag_service()
    return service.answer_question(request)
