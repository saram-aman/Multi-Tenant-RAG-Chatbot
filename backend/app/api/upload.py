import uuid
from typing import List

from fastapi import APIRouter, Depends, File, UploadFile

from app.core.security import SecurityDependency
from app.ingestion.pipeline import ingest_document
from app.models.upload import DocumentMetadata, UploadSummary, UploadedDocument
from app.utils.documents import extract_text

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post(
    "/documents",
    response_model=UploadSummary,
    dependencies=[SecurityDependency],
)
async def upload_documents(
    tenant_id: str,
    files: List[UploadFile] = File(...),
) -> UploadSummary:
    documents: List[UploadedDocument] = []
    total_chunks = 0

    for file in files:
        content = await file.read()
        text, mime_type = extract_text(file.filename, file.content_type, content)
        source_id = uuid.uuid4().hex
        chunks = ingest_document(
            tenant_id=tenant_id,
            source_id=source_id,
            doc_text=text,
        )
        documents.append(
            UploadedDocument(
                source_id=source_id,
                chunks_ingested=chunks,
                metadata=DocumentMetadata(
                    filename=file.filename or source_id,
                    mime_type=mime_type,
                    size_bytes=len(content),
                ),
            )
        )
        total_chunks += chunks

    return UploadSummary(
        tenant_id=tenant_id,
        documents=documents,
        total_chunks=total_chunks,
    )
