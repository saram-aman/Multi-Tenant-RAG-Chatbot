from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class Citation(BaseModel):
    source_id: str = Field(..., description="Original document identifier")
    chunk_index: int = Field(..., ge=0, description="Chunk position inside the source")
    text_snippet: str = Field(..., description="Short excerpt used for grounding")
    score: float = Field(..., ge=0.0, le=1.0, description="Retrieval similarity score")


class ChatRequest(BaseModel):
    tenant_id: str = Field(..., description="Isolation namespace / tenant identifier")
    message: str = Field(..., min_length=1, description="User query to route through RAG")
    conversation_id: Optional[str] = Field(
        default=None, description="Client-side conversation identifier"
    )
    stream: bool = Field(default=False, description="Enable streaming responses")


class ChatResponse(BaseModel):
    tenant_id: str
    conversation_id: Optional[str] = None
    answer: str
    citations: List[Citation] = Field(default_factory=list)
    latency_ms: int = Field(..., ge=0)
