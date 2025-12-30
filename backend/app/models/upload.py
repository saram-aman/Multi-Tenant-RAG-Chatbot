from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class DocumentMetadata(BaseModel):
    filename: str
    mime_type: str
    size_bytes: int = Field(..., ge=0)


class UploadedDocument(BaseModel):
    source_id: str
    chunks_ingested: int = Field(..., ge=0)
    metadata: DocumentMetadata


class UploadSummary(BaseModel):
    tenant_id: str
    documents: List[UploadedDocument]
    total_chunks: int = Field(..., ge=0)
