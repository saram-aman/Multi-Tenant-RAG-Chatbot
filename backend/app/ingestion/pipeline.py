from typing import List

from app.ingestion.chunker import get_chunks
from app.ingestion.cleaner import clean_chunks
from app.ingestion.embedder import embed_documents
from app.services.vector_store import get_vector_store
from app.utils.logger import get_logger

logger = get_logger(__name__)


def ingest_document(tenant_id: str, source_id: str, doc_text: str) -> int:
    chunks = clean_chunks(get_chunks(doc_text))
    if not chunks:
        logger.warning(
            "No chunks generated during ingestion",
            extra={"tenant_id": tenant_id, "source_id": source_id},
        )
        return 0

    vectors = embed_documents(chunks)
    vector_store = get_vector_store()
    vector_store.upsert_chunks(tenant_id=tenant_id, source_id=source_id, chunks=chunks, embeddings=vectors)
    return len(chunks)


def ingest_documents(tenant_id: str, payloads: List[tuple[str, str]]) -> List[int]:
    """
    Helper for bulk ingestion. Payloads are tuples of (source_id, text).
    """
    counts: List[int] = []
    for source_id, text in payloads:
        counts.append(ingest_document(tenant_id, source_id, text))
    return counts