from __future__ import annotations

from functools import lru_cache
from typing import List, Sequence

from pinecone import Pinecone

from app.core.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class VectorStore:
    def __init__(self) -> None:
        self.client = Pinecone(api_key=settings.pinecone_api_key)
        self.index = self.client.Index(settings.pinecone_index_name)

    def upsert_chunks(
        self,
        tenant_id: str,
        source_id: str,
        chunks: Sequence[str],
        embeddings: Sequence[Sequence[float]],
    ) -> None:
        vectors = []
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            vectors.append(
                {
                    "id": f"{tenant_id}:{source_id}:{idx}",
                    "values": list(embedding),
                    "metadata": {
                        "tenant_id": tenant_id,
                        "source_id": source_id,
                        "text": chunk,
                        "chunk_index": idx,
                    },
                }
            )
        if not vectors:
            return
        self.index.upsert(vectors=vectors, namespace=tenant_id)
        logger.info(
            "Upserted %s vectors for tenant %s",
            len(vectors),
            tenant_id,
            extra={"tenant_id": tenant_id, "source_id": source_id},
        )

    def similarity_search(
        self,
        tenant_id: str,
        embedding: Sequence[float],
        top_k: int,
    ) -> List[dict]:
        try:
            response = self.index.query(
                namespace=tenant_id,
                vector=list(embedding),
                top_k=top_k,
                include_metadata=True,
            )
            # Handle both object and dict response formats
            if hasattr(response, "matches"):
                matches = response.matches
            elif isinstance(response, dict):
                matches = response.get("matches", [])
            else:
                matches = []
            return [match for match in matches if match]
        except Exception as exc:
            logger.error(
                "Vector search failed",
                exc_info=exc,
                extra={"tenant_id": tenant_id},
            )
            return []


@lru_cache()
def get_vector_store() -> VectorStore:
    return VectorStore()
