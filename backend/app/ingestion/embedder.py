from functools import lru_cache
from typing import Iterable, List

from langchain_openai import OpenAIEmbeddings

from app.core.config import settings


@lru_cache()
def _get_embedder() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model=settings.openai_embedding_model,
        api_key=settings.openai_api_key,
    )


def embed_documents(texts: Iterable[str]) -> List[List[float]]:
    embedder = _get_embedder()
    return embedder.embed_documents(list(texts))


def embed_query(text: str) -> List[float]:
    embedder = _get_embedder()
    return embedder.embed_query(text)